import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: number | string;
  icon: ReactNode; // Now accepts a React node (Lucide icon)
}

const StatsCard = ({ title, value, icon }: Props) => (
  <div className="bg-gray-800 p-4 rounded-lg border border-green-500">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-green-400">{value}</p>
      </div>
      <div className="text-green-400">
        {icon}
      </div>
    </div>
  </div>
);

export default StatsCard;