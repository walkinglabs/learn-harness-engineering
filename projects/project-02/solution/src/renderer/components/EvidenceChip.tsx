interface Props {
  utteranceId: string;
  onClick: (utteranceId: string) => void;
}

export function EvidenceChip({ utteranceId, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(utteranceId)}
      style={{ fontSize: 11, border: '1px solid #3d5a80', background: '#172033', color: '#dbeafe', borderRadius: 4, padding: '2px 6px' }}
    >
      evidence {utteranceId.slice(-6)}
    </button>
  );
}
