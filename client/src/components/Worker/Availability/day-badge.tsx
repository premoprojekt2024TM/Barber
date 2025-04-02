interface DayBadgeProps {
  day: string;
}

export function DayBadge({ day }: DayBadgeProps) {
  return (
    <span className="inline-block bg-black text-white rounded-xl px-4 py-2 text-base font-bold">
      {day}
    </span>
  );
}
