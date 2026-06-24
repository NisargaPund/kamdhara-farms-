interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'gold' | 'green' | 'blue' | 'red';
}

const colorClasses = {
  gold: 'bg-gold/10 text-gold',
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  red: 'bg-red-100 text-red-600',
};

export default function StatCard({ title, value, subtitle, icon, color = 'gold' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-medium-brown mb-1">{title}</p>
          <p className="text-3xl font-bold text-dark-brown">{value}</p>
          {subtitle && <p className="text-xs text-medium-brown mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
