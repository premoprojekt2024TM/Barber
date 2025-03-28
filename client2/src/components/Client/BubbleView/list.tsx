import type { Hairdresser } from "./hairdresser";

interface HairdresserListProps {
  hairdressers: Hairdresser[];
  onSelectHairdresser: (hairdresser: Hairdresser) => void;
}

export default function HairdresserList({
  hairdressers,
  onSelectHairdresser,
}: HairdresserListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {hairdressers.map((hairdresser) => (
        <div
          key={hairdresser.id}
          onClick={() => onSelectHairdresser(hairdresser)}
          className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={hairdresser.profilePic}
              alt={`${hairdresser.name}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium text-gray-900">{hairdresser.name}</h3>
            <div className="flex items-center mt-1 space-x-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
