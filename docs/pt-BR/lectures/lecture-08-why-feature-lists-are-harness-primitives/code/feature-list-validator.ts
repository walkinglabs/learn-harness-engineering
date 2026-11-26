/**
 * feature-list-validator.ts
 *
 * Lê um feature_list.json, valida seu esquema e verifica se existem
 * funcionalidades marcadas como "pass" sem evidências de verificação.
 * Gera um relatório estruturado.
 * Pode ser executado em qualquer diretório de projeto que contenha um feature_list.json.
 *
 * Uso:
 *   npx tsx docs/lectures/lecture-08.../code/feature-list-validator.ts [caminho-para-o-diretório]
 *   (por padrão, utiliza o diretório que contém este script)
 *
 * Executar:
 *   npx tsx docs/lectures/lecture-08-why-feature-lists-are-harness-primitives/code/feature-list-validator.ts
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface FeatureEntry {
  id?: string;
  category?: string;
  description?: string;
  verification?: string[];
  passes?: boolean;
  // Permite campos desconhecidos para maior flexibilidade
  [key: string]: unknown;
}

interface ValidationResult {
  featureId: string;
  schemaValid: boolean;
  schemaErrors: string[];
  hasVerification: boolean;
  markedPassWithoutEvidence: boolean;
  passes: boolean;
  verificationCount: number;
}

// ---------------------------------------------------------------------------
// Validação do esquema
// ---------------------------------------------------------------------------

function validateSchema(entry: FeatureEntry, index: number): string[] {
  const errors: string[] = [];
  const label = entry.id ?? `entrada ${index + 1}`;

  if (!entry.id || typeof entry.id !== "string") {
    errors.push(`[${label}] Campo 'id' ausente ou inválido`);
  }
  if (!entry.category || typeof entry.category !== "string") {
    errors.push(`[${label}] Campo 'category' ausente ou inválido`);
  }
  if (!entry.description || typeof entry.description !== "string") {
    errors.push(`[${label}] Campo 'description' ausente ou inválido`);
  }
  if (entry.verification !== undefined && !Array.isArray(entry.verification)) {
    errors.push(`[${label}] 'verification' deve ser um array, se estiver presente`);
  }
  if (entry.passes !== undefined && typeof entry.passes !== "boolean") {
    errors.push(`[${label}] 'passes' deve ser um booleano, se estiver presente`);
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Validação de evidências
// ---------------------------------------------------------------------------

function checkEvidence(entry: FeatureEntry): {
  hasVerification: boolean;
  markedPassWithoutEvidence: boolean;
} {
  const hasVerification =
    Array.isArray(entry.verification) && entry.verification.length > 0;

  const markedPassWithoutEvidence =
    entry.passes === true && !hasVerification;

  return { hasVerification, markedPassWithoutEvidence };
}

// ---------------------------------------------------------------------------
// Processamento da lista de funcionalidades
// ---------------------------------------------------------------------------

function processFeatureList(entries: FeatureEntry[]): ValidationResult[] {
  return entries.map((entry, index) => {
    const schemaErrors = validateSchema(entry, index);
    const evidence = checkEvidence(entry);

    return {
      featureId: (entry.id as string) ?? `entry-${index + 1}`,
      schemaValid: schemaErrors.length === 0,
      schemaErrors,
      hasVerification: evidence.hasVerification,
      markedPassWithoutEvidence: evidence.markedPassWithoutEvidence,
      passes: entry.passes === true,
      verificationCount: Array.isArray(entry.verification)
        ? entry.verification.length
        : 0,
    };
  });
}

// ---------------------------------------------------------------------------
// Relatórios
// ---------------------------------------------------------------------------

function pad(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function run(): void {
  // Resolve o diretório de destino
  const scriptDir = path.dirname(new URL(import.meta.url).pathname);

  const targetDir = process.argv[2]
    ? path.resolve(process.argv[2])
    : scriptDir;

  const filePath = path.join(targetDir, "feature_list.json");

  console.log("\n" + "=".repeat(90));
  console.log("  VALIDADOR DE LISTA DE FUNCIONALIDADES");
  console.log("=".repeat(90));
  console.log(`  Lendo: ${filePath}\n`);

  if (!fs.existsSync(filePath)) {
    console.error(
      `  ERRO: feature_list.json não encontrado em ${filePath}`
    );
    console.error(
      "  Uso: npx tsx feature-list-validator.ts [caminho-para-o-diretório-que-contém-feature_list.json]\n"
    );
    process.exit(1);
  }

  let entries: FeatureEntry[];

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    entries = JSON.parse(raw);
  } catch (err) {
    console.error(
      `  ERRO: Não foi possível interpretar o feature_list.json: ${err}`
    );
    process.exit(1);
  }

  if (!Array.isArray(entries)) {
    console.error(
      "  ERRO: feature_list.json deve conter um array JSON no nível superior."
    );
    process.exit(1);
  }

  // Para fins de demonstração, acrescenta um conjunto estendido de testes apenas ao usar o exemplo incluído
  const demoEntries: FeatureEntry[] = process.argv[2] ? entries : [
    ...entries,
    {
      id: "qna-002",
      category: "import",
      description: "O usuário pode importar um documento PDF.",
      verification: [
        "Fazer upload de um arquivo PDF",
        "Verificar se ele aparece na lista de documentos",
      ],
      passes: true,
    },
    {
      id: "qna-003",
      category: "grounded_qa",
      description: "A taxa de alucinação do sistema é inferior a 5%.",
      verification: [], // Vazio — sem evidências
      passes: true, // Marcado como aprovado SEM evidências
    },
    {
      id: "missing-fields",
      // Campos 'category' e 'description' ausentes
      passes: true,
    } as FeatureEntry,
  ];

  const results = processFeatureList(demoEntries);

  // Exibe o relatório
  const header = `| ${pad("ID da Funcionalidade", 14)}| ${pad("Esquema", 8)}| ${pad("Passa", 7)}| ${pad("Verificações", 14)}| ${pad("Evidência?", 12)}| Observações`;

  const sep = `|${"-".repeat(16)}|${"-".repeat(10)}|${"-".repeat(9)}|${"-".repeat(16)}|${"-".repeat(14)}|${"-".repeat(30)}`;

  console.log(header);
  console.log(sep);

  for (const r of results) {
    const schemaLabel = r.schemaValid ? "OK" : "INVÁLIDO";
    const passesLabel = r.passes ? "PASS" : "FAIL";
    const evidenceLabel = r.hasVerification ? "Presente" : "AUSENTE";

    const notes = r.markedPassWithoutEvidence
      ? "SINALIZADO: aprovado sem evidências!"
      : r.schemaErrors.length > 0
        ? r.schemaErrors[0]
        : "";

    const marker = r.markedPassWithoutEvidence
      ? ">>"
      : r.schemaValid
        ? "  "
        : "!!";

    console.log(
      `${marker}| ${pad(r.featureId, 14)}| ${pad(schemaLabel, 8)}| ${pad(
        passesLabel,
        7
      )}| ${pad(String(r.verificationCount), 14)}| ${pad(
        evidenceLabel,
        12
      )}| ${notes}`
    );
  }

  // Resumo
  const total = results.length;
  const schemaOk = results.filter((r) => r.schemaValid).length;
  const passing = results.filter((r) => r.passes).length;
  const flagged = results.filter(
    (r) => r.markedPassWithoutEvidence
  ).length;

  const withEvidence = results.filter(
    (r) => r.hasVerification
  ).length;

  console.log("\n" + "-".repeat(90));
  console.log("  RESUMO");
  console.log("-".repeat(90));

  console.log(`  Total de funcionalidades:              ${total}`);
  console.log(`  Esquema válido:                        ${schemaOk}/${total}`);
  console.log(`  Marcadas como aprovadas:               ${passing}/${total}`);
  console.log(`  Com evidências de verificação:         ${withEvidence}/${total}`);
  console.log(`  Sinalizadas (aprovadas sem evidência): ${flagged}`);

  if (flagged > 0) {
    console.log(
      `\n  AVISO: ${flagged} funcionalidade(s) marcadas como "pass" sem qualquer evidência de verificação.`
    );
    console.log(
      "  Essas funcionalidades precisam ser verificadas antes de serem consideradas confiáveis.\n"
    );
  } else {
    console.log(
      "\n  Todas as funcionalidades aprovadas possuem evidências de verificação. A lista de funcionalidades está saudável.\n"
    );
  }
}

run();