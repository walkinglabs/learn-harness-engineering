interface Props {
  title: string;
  body: string;
  compact?: boolean;
}

export function EmptyState({ title, body, compact = false }: Props) {
  return (
    <div style={{ padding: compact ? 16 : 32, color: '#9fb2cc', textAlign: 'center' }}>
      <div style={{ fontSize: compact ? 13 : 16, fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}
