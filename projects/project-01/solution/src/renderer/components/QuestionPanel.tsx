import { useState } from 'react';

interface Props {
  onAsk: (question: string) => void;
  disabled: boolean;
}

export function QuestionPanel({ onAsk, disabled }: Props) {
  const [question, setQuestion] = useState('');

  const submit = () => {
    const value = question.trim();
    if (!value || disabled) return;
    onAsk(value);
    setQuestion('');
  };

  return (
    <div className="composer-wrap">
      <div className="composer">
        <textarea
          value={question}
          onChange={event => setQuestion(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          placeholder="Ask anything about your documents…"
          rows={1}
          disabled={disabled}
        />
        <button type="button" onClick={submit} disabled={disabled || !question.trim()} aria-label="Ask question">↑</button>
      </div>
      <p>Keystone searches only your local library. Press Enter to send.</p>
    </div>
  );
}
