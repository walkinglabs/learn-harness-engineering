import React from 'react';
import { FollowUpChain } from '../../types';
import { EvidenceChip } from './EvidenceChip';

interface Props {
  chains: FollowUpChain[];
  onEvidenceClick: (utteranceId: string) => void;
}

export function FollowUpChainView({ chains, onEvidenceClick }: Props) {
  return (
    <ReportSection title="Follow-up Logic">
      {chains.map(chain => (
        <div key={chain.id} style={{ marginBottom: 12 }}>
          <strong>{chain.topic}</strong>
          <div style={{ fontSize: 12, color: '#b8c7dc' }}>{chain.summary}</div>
          <EvidenceChip utteranceId={chain.rootQuestionUtteranceId} onClick={onEvidenceClick} />
        </div>
      ))}
    </ReportSection>
  );
}

export function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: 12, borderBottom: '1px solid #263244' }}>
      <h2 style={{ fontSize: 14, margin: '0 0 10px' }}>{title}</h2>
      {children}
    </section>
  );
}
