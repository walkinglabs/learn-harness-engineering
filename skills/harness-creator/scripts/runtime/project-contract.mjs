const REQUIREMENT_STATES = new Set(['confirmed', 'inferred', 'unknown', 'needs-decision']);
const FEATURE_STATES = new Set(['not-started', 'in-progress', 'blocked', 'done']);

export function auditProjectContract(model, featureList = null) {
  const issues = [];
  const add = (area, code, message) => issues.push({ area, code, message });

  if (!isObject(model)) {
    add('projectModel', 'model.invalid', 'project-model.json must contain a JSON object');
    return finish(issues, {});
  }

  if (model.reviewStatus !== 'reviewed') {
    add('projectModel', 'model.unreviewed', 'project-model.json must have reviewStatus "reviewed" before a derived harness is authoritative');
  }
  if (!nonEmpty(model.purpose)) {
    add('projectModel', 'model.purpose', 'project purpose must be stated');
  }

  const sources = array(model.sources);
  const capabilities = array(model.capabilities);
  const requirements = array(model.requirements);
  const verifications = array(model.verificationPlan);
  const unknowns = array(model.unknowns);

  if (!sources.length) add('projectModel', 'sources.empty', 'at least one requirements or design source is required');
  if (!capabilities.length) add('projectModel', 'capabilities.empty', 'at least one project capability is required');
  if (!requirements.length) add('projectModel', 'requirements.empty', 'at least one requirement is required');

  const sourceIds = idsFor(sources, 'src-', 'source', add);
  const capabilityIds = idsFor(capabilities, 'cap-', 'capability', add);
  const requirementIds = idsFor(requirements, 'req-', 'requirement', add);
  const verificationIds = idsFor(verifications, 'ver-', 'verification', add);
  const unknownIds = idsFor(unknowns, 'unk-', 'unknown', add);
  const acceptanceIds = new Set();

  for (const source of sources) {
    if (!sourceIds.has(source?.id)) continue;
    if (!nonEmpty(source.path)) add('projectModel', 'source.path', `${source.id}: source.path is required`);
    if (typeof source.path === 'string' && !/^https?:\/\//.test(source.path) && (source.path.startsWith('/') || source.path.split(/[\\/]/).includes('..'))) {
      add('projectModel', 'source.pathScope', `${source.id}: local source paths must stay inside the target repository`);
    }
    if (!nonEmpty(source.kind)) add('projectModel', 'source.kind', `${source.id}: source.kind is required`);
    if (!nonEmpty(source.revision) || (model.reviewStatus === 'reviewed' && source.revision === 'unreviewed')) {
      add('projectModel', 'source.revision', `${source.id}: reviewed models must identify the source revision, date, or sha256 fingerprint`);
    }
    if (!['contract', 'authoritative', 'context', 'superseded'].includes(source.authority)) {
      add('projectModel', 'source.authority', `${source.id}: source.authority must distinguish contract, authoritative, context, or superseded material`);
    }
  }

  for (const capability of capabilities) {
    if (!capabilityIds.has(capability?.id)) continue;
    if (!nonEmpty(capability.name) || !nonEmpty(capability.description)) {
      add('projectModel', 'capability.definition', `${capability.id}: capability needs a name and description`);
    }
    for (const dep of array(capability.dependencies)) {
      if (!capabilityIds.has(dep)) add('traceability', 'capability.dependency', `${capability.id}: unknown capability dependency ${JSON.stringify(dep)}`);
    }
    if (!Array.isArray(capability.inputs) || !Array.isArray(capability.outputs) || !Array.isArray(capability.boundaries)) {
      add('projectModel', 'capability.boundary', `${capability.id}: inputs, outputs, and boundaries must be arrays`);
    }
  }

  for (const requirement of requirements) {
    if (!requirementIds.has(requirement?.id)) continue;
    if (!nonEmpty(requirement.statement)) add('projectModel', 'requirement.statement', `${requirement.id}: requirement statement is required`);
    if (!REQUIREMENT_STATES.has(requirement.state)) {
      add('projectModel', 'requirement.state', `${requirement.id}: state must be confirmed, inferred, unknown, or needs-decision`);
    }
    const refs = array(requirement.sourceRefs);
    if (!refs.length) add('traceability', 'requirement.sources', `${requirement.id}: at least one sourceRef is required`);
    for (const ref of refs) {
      if (!sourceIds.has(ref)) add('traceability', 'requirement.sourceRef', `${requirement.id}: unknown sourceRef ${JSON.stringify(ref)}`);
    }
    if (requirement.state === 'confirmed' && !refs.some((ref) => {
      const source = sources.find((item) => item.id === ref);
      return source && ['contract', 'authoritative'].includes(source.authority);
    })) {
      add('traceability', 'requirement.authority', `${requirement.id}: a confirmed requirement needs a contract or authoritative source`);
    }
    const capRefs = array(requirement.capabilityRefs);
    if (!capRefs.length) add('traceability', 'requirement.capabilities', `${requirement.id}: at least one capabilityRef is required`);
    for (const ref of capRefs) {
      if (!capabilityIds.has(ref)) add('traceability', 'requirement.capabilityRef', `${requirement.id}: unknown capabilityRef ${JSON.stringify(ref)}`);
    }
    const criteria = array(requirement.acceptanceCriteria);
    if (['confirmed', 'inferred'].includes(requirement.state) && !criteria.length) {
      add('traceability', 'requirement.acceptance', `${requirement.id}: confirmed or inferred requirements need acceptance criteria`);
    }
    for (const criterion of criteria) {
      if (!isObject(criterion) || !nonEmpty(criterion.id) || !criterion.id.startsWith('ac-')) {
        add('traceability', 'acceptance.id', `${requirement.id}: each acceptance criterion needs an ac-* id`);
        continue;
      }
      if (acceptanceIds.has(criterion.id)) add('traceability', 'acceptance.duplicate', `duplicate acceptance criterion id ${criterion.id}`);
      acceptanceIds.add(criterion.id);
      if (!nonEmpty(criterion.statement)) add('traceability', 'acceptance.statement', `${criterion.id}: acceptance statement is required`);
    }
  }

  for (const verification of verifications) {
    if (!verificationIds.has(verification?.id)) continue;
    const refs = array(verification.acceptanceCriteriaRefs);
    if (!refs.length) add('traceability', 'verification.acceptance', `${verification.id}: at least one acceptanceCriteriaRef is required`);
    for (const ref of refs) {
      if (!acceptanceIds.has(ref)) add('traceability', 'verification.acceptanceRef', `${verification.id}: unknown acceptanceCriteriaRef ${JSON.stringify(ref)}`);
    }
    for (const field of ['kind', 'procedure', 'expected', 'evidencePath']) {
      if (!nonEmpty(verification[field])) add('traceability', `verification.${field}`, `${verification.id}: ${field} is required`);
    }
  }

  for (const capability of capabilities) {
    if (!requirements.some((requirement) => array(requirement.capabilityRefs).includes(capability.id))) {
      add('traceability', 'capability.requirements', `${capability.id}: no requirement defines this capability`);
    }
  }

  for (const requirement of requirements.filter((item) => ['confirmed', 'inferred'].includes(item?.state))) {
    for (const criterion of array(requirement.acceptanceCriteria)) {
      if (!verifications.some((verification) => array(verification?.acceptanceCriteriaRefs).includes(criterion?.id))) {
        add('traceability', 'acceptance.unverified', `${criterion?.id || requirement.id}: no verification plan entry covers this acceptance criterion`);
      }
    }
  }

  for (const unknown of unknowns) {
    if (!unknownIds.has(unknown?.id)) continue;
    if (!nonEmpty(unknown.question) || !nonEmpty(unknown.impact)) {
      add('projectModel', 'unknown.definition', `${unknown.id}: unknown needs a question and impact`);
    }
    if (!['open', 'resolved'].includes(unknown.status)) add('projectModel', 'unknown.status', `${unknown.id}: status must be open or resolved`);
    const blocks = array(unknown.blocks);
    if (unknown.status === 'open' && !blocks.length) add('traceability', 'unknown.blocks', `${unknown.id}: an open unknown must name what it blocks`);
    for (const ref of blocks) {
      if (!requirementIds.has(ref) && !capabilityIds.has(ref)) add('traceability', 'unknown.blockRef', `${unknown.id}: unknown block reference ${JSON.stringify(ref)}`);
    }
  }

  for (const requirement of requirements.filter((item) => ['unknown', 'needs-decision'].includes(item?.state))) {
    if (!unknowns.some((unknown) => unknown.status === 'open' && array(unknown.blocks).includes(requirement.id))) {
      add('traceability', 'requirement.unresolved', `${requirement.id}: unresolved requirement needs an open unknown that names it in blocks`);
    }
  }

  if (featureList !== null) {
    auditFeatures(featureList, { capabilities, requirements, verifications, unknowns, capabilityIds, requirementIds, verificationIds, acceptanceIds }, add);
  }

  return finish(issues, {
    sources: sources.length,
    capabilities: capabilities.length,
    requirements: requirements.length,
    acceptanceCriteria: acceptanceIds.size,
    verifications: verifications.length,
    unknowns: unknowns.length
  });
}

function auditFeatures(featureList, indexes, add) {
  if (!isObject(featureList) || !Array.isArray(featureList.features)) {
    add('traceability', 'features.invalid', 'feature_list.json must contain a features array');
    return;
  }

  const featureIds = idsFor(featureList.features, 'feat-', 'feature', add);
  const mappedCapabilities = new Set();
  const mappedRequirements = new Set();

  for (const feature of featureList.features) {
    if (!featureIds.has(feature?.id)) continue;
    if (!FEATURE_STATES.has(feature.status)) add('traceability', 'feature.status', `${feature.id}: invalid status ${JSON.stringify(feature.status)}`);

    const capRefs = array(feature.capabilityRefs);
    const reqRefs = array(feature.requirementRefs);
    const acRefs = array(feature.acceptanceCriteriaRefs);
    const verRefs = array(feature.verificationRefs);
    const linkedRequirements = indexes.requirements.filter((requirement) => reqRefs.includes(requirement.id));
    const allowedAcceptance = new Set(linkedRequirements.flatMap((requirement) => array(requirement.acceptanceCriteria).map((criterion) => criterion.id)));
    const allowedVerifications = new Set(indexes.verifications.filter((verification) =>
      array(verification.acceptanceCriteriaRefs).some((ref) => allowedAcceptance.has(ref))
    ).map((verification) => verification.id));
    for (const ref of capRefs) {
      if (!indexes.capabilityIds.has(ref)) add('traceability', 'feature.capabilityRef', `${feature.id}: unknown capabilityRef ${JSON.stringify(ref)}`);
      else mappedCapabilities.add(ref);
    }
    for (const ref of reqRefs) {
      if (!indexes.requirementIds.has(ref)) add('traceability', 'feature.requirementRef', `${feature.id}: unknown requirementRef ${JSON.stringify(ref)}`);
      else {
        mappedRequirements.add(ref);
        const requirement = indexes.requirements.find((item) => item.id === ref);
        if (requirement && !array(requirement.capabilityRefs).some((capabilityRef) => capRefs.includes(capabilityRef))) {
          add('traceability', 'feature.requirementCapability', `${feature.id}: ${ref} is not attached to one of the feature's capabilities`);
        }
      }
    }
    for (const ref of acRefs) {
      if (!indexes.acceptanceIds.has(ref)) add('traceability', 'feature.acceptanceRef', `${feature.id}: unknown acceptanceCriteriaRef ${JSON.stringify(ref)}`);
      else if (!allowedAcceptance.has(ref)) add('traceability', 'feature.acceptanceChain', `${feature.id}: ${ref} does not belong to a linked requirement`);
    }
    for (const ref of allowedAcceptance) {
      if (!acRefs.includes(ref)) add('traceability', 'feature.acceptanceMissing', `${feature.id}: linked requirement criterion ${ref} is missing from acceptanceCriteriaRefs`);
    }
    for (const ref of verRefs) {
      if (!indexes.verificationIds.has(ref)) add('traceability', 'feature.verificationRef', `${feature.id}: unknown verificationRef ${JSON.stringify(ref)}`);
      else if (!allowedVerifications.has(ref)) add('traceability', 'feature.verificationChain', `${feature.id}: ${ref} does not verify a linked acceptance criterion`);
    }
    for (const ref of allowedVerifications) {
      if (!verRefs.includes(ref)) add('traceability', 'feature.verificationMissing', `${feature.id}: linked acceptance verification ${ref} is missing from verificationRefs`);
    }
    for (const dep of array(feature.dependencies)) {
      if (!featureIds.has(dep)) add('traceability', 'feature.dependency', `${feature.id}: unknown feature dependency ${JSON.stringify(dep)}`);
    }

    const unresolved = indexes.requirements.some((requirement) =>
      reqRefs.includes(requirement.id) && ['unknown', 'needs-decision'].includes(requirement.state)
    ) || indexes.unknowns.some((unknown) =>
      unknown.status === 'open' && array(unknown.blocks).some((ref) => reqRefs.includes(ref) || capRefs.includes(ref))
    );
    if (unresolved && ['in-progress', 'done'].includes(feature.status)) {
      add('traceability', 'feature.unresolved', `${feature.id}: unresolved project-contract questions require blocked status`);
    }

    if (feature.status === 'done') {
      const evidence = array(feature.evidence);
      for (const verificationRef of verRefs) {
        const observed = evidence.find((item) => item?.verificationRef === verificationRef);
        if (!observed) {
          add('evidence', 'evidence.missing', `${feature.id}: done feature has no observed evidence for ${verificationRef}`);
          continue;
        }
        for (const field of ['observedAt', 'result', 'artifact']) {
          if (!nonEmpty(observed[field])) add('evidence', `evidence.${field}`, `${feature.id}/${verificationRef}: evidence.${field} is required`);
        }
      }
    }
  }

  for (const capability of indexes.capabilities) {
    if (!mappedCapabilities.has(capability.id)) add('traceability', 'capability.unmapped', `${capability.id}: no feature implements this capability`);
  }
  for (const requirement of indexes.requirements.filter((item) => ['confirmed', 'inferred'].includes(item.state))) {
    if (!mappedRequirements.has(requirement.id)) add('traceability', 'requirement.unmapped', `${requirement.id}: no feature implements this requirement`);
  }
}

function idsFor(items, prefix, label, add) {
  const ids = new Set();
  for (const [index, item] of items.entries()) {
    const id = item?.id;
    if (!nonEmpty(id) || !id.startsWith(prefix)) {
      add('projectModel', `${label}.id`, `${label}[${index}] needs a unique ${prefix}* id`);
      continue;
    }
    if (ids.has(id)) add('projectModel', `${label}.duplicate`, `duplicate ${label} id ${id}`);
    ids.add(id);
  }
  return ids;
}

function finish(issues, counts) {
  return {
    valid: issues.length === 0,
    issues,
    counts,
    byArea: Object.fromEntries(['projectModel', 'traceability', 'evidence'].map((area) => [area, issues.filter((issue) => issue.area === area)]))
  };
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
