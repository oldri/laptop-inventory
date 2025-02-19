interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color?: 'blue' | 'purple' | 'green';
}

export const StatCard = ({ title, value, icon, color = 'blue' }: StatCardProps) => {
    const colorVariants = {
        blue: 'bg-blue-100 text-blue-600',
        purple: 'bg-purple-100 text-purple-600',
        green: 'bg-green-100 text-green-600',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`${colorVariants[color]} p-3 rounded-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};