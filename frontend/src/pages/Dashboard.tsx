import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
    fetchDeviceOverview,
    fetchRequestDashboard,
    fetchWarrantyDashboard
} from "../store/dashboardSlice";
import { DashboardCard } from "../components/dashboard/DashboardCard";
import { StatCard } from "../components/dashboard/StatCard";
import {
    Laptop,
    ClipboardList,
    Shield,
    RefreshCw,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Alert, AlertDescription } from "../components/common/Alert";

// Helper function for status badges
const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'in progress':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

// Helper function to check if warranty is expiring within a week
const isWithinNextWeek = (date: Date) => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return date <= nextWeek && date >= today;
};

export const Dashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        deviceOverview,
        requestManagement,
        warrantyManagement,
        loading,
        error
    } = useSelector((state: RootState) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDeviceOverview());
        dispatch(fetchRequestDashboard());
        dispatch(fetchWarrantyDashboard());
    }, [dispatch]);

    const isLoading = loading.deviceOverview || loading.requestManagement || loading.warrantyManagement;
    const hasError = error.deviceOverview || error.requestManagement || error.warrantyManagement;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (hasError) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{hasError}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 rounded-xl">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

                {/* Device Overview Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Available Devices"
                        value={deviceOverview?.totalAvailable ?? 0}
                        icon={<Laptop className="w-5 h-5" />}
                        color="blue"
                    />
                    <StatCard
                        title="Total Requests"
                        value={requestManagement?.totalRequests ?? 0}
                        icon={<ClipboardList className="w-5 h-5" />}
                        color="purple"
                    />
                    <StatCard
                        title="Active Warranties"
                        value={warrantyManagement?.statusCounts.ACTIVE ?? 0}
                        icon={<Shield className="w-5 h-5" />}
                        color="green"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Device Condition Distribution */}
                    <DashboardCard title="Device Conditions">
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={Object.entries(deviceOverview?.conditionDistribution ?? {}).map(
                                        ([key, value]) => ({ name: key, value })
                                    )}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: '#4b5563', fontSize: 12 }}
                                        axisLine={{ stroke: '#e5e7eb' }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#4b5563', fontSize: 12 }}
                                        axisLine={{ stroke: '#e5e7eb' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="#3b82f6"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </DashboardCard>

                    {/* Request Status Distribution */}
                    <DashboardCard title="Request Status">
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={Object.entries(requestManagement?.statusCounts ?? {}).map(
                                        ([key, value]) => ({ name: key, value })
                                    )}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: '#4b5563', fontSize: 12 }}
                                        axisLine={{ stroke: '#e5e7eb' }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#4b5563', fontSize: 12 }}
                                        axisLine={{ stroke: '#e5e7eb' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="#8b5cf6"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </DashboardCard>

                    {/* Recent Requests */}
                    <DashboardCard title="Recent Requests">
                        <div className="overflow-x-auto rounded-lg">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {requestManagement?.recentRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-sm text-gray-900">{request.type}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(request.status)}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-[160px]">{request.requesterEmail}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </DashboardCard>

                    {/* Expiring Warranties */}
                    <DashboardCard title="Expiring Warranties">
                        <div className="overflow-x-auto rounded-lg">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {warrantyManagement?.expiringSoon.map((warranty) => {
                                        const isExpiringSoon = isWithinNextWeek(new Date(warranty.endDate));
                                        return (
                                            <tr key={warranty.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-sm text-gray-900">{warranty.warrantyId}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{warranty.type}</td>
                                                <td className={`px-4 py-3 text-sm ${isExpiringSoon ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                                    {new Date(warranty.endDate).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </div>
    );
};