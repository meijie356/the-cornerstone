'use client';

export default function ActionTiles({ onSearch }: { onSearch: (query: string) => void }) {
  const actions = [
    { label: 'Find Peace', query: 'Help me find inner peace.' },
    { label: 'Daily Strength', query: 'Give me strength for today.' },
    { label: 'Guidance', query: 'I need guidance on a decision.' },
    { label: 'Gratitude', query: 'Remind me of things to be grateful for.' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => onSearch(action.query)}
          className="p-4 bg-[var(--card-bg)] rounded-2xl shadow-sm border border-black/5 hover:opacity-80 transition-colors text-sm font-medium text-[var(--accent)]"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
