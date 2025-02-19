interface DashboardCardProps {
    title: string;
    children: React.ReactNode;
}

export const DashboardCard = ({ title, children }: DashboardCardProps) => {
    return (
        <div className="bg-white shadow-md hover:shadow-lg rounded-xl overflow-hidden transition-shadow duration-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};
