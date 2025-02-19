import { WarrantyDTO } from "./device";
import { RequestType, RequestStatus } from "./deviceRequest";

export interface DeviceOverviewData {
    totalAvailable: number;
    totalAssigned: number;
    totalUnderMaintenance: number;
    conditionDistribution: {
        NEW: number;
        USED: number;
        DAMAGED: number;
    };
    topLocations: {
        [key: string]: number;
    };
    totalDevices: number;
}

export interface RequestManagementData {
    typeCounts: {
        NEW_DEVICE: number;
        DEVICE_ASSIGNMENT: number;
    };
    statusCounts: {
        PENDING: number;
        APPROVED: number;
        REJECTED: number;
    };
    recentRequests: {
        id: number;
        type: RequestType;
        status: RequestStatus;
        requesterEmail: string;
        createTime: string;
        updateTime: string;
    }[];
    totalRequests: number;
}

export interface WarrantyManagementData {
    statusCounts: {
        ACTIVE: number;
        EXPIRING: number;
        EXPIRED: number;
    };
    expiringSoon: WarrantyDTO[];
    recentlyExpired: WarrantyDTO[];
    totalWarranties: number;
}

export interface DashboardState {
    deviceOverview: DeviceOverviewData | null;
    requestManagement: RequestManagementData | null;
    warrantyManagement: WarrantyManagementData | null;
    loading: {
        deviceOverview: boolean;
        requestManagement: boolean;
        warrantyManagement: boolean;
    };
    error: {
        deviceOverview: string | null;
        requestManagement: string | null;
        warrantyManagement: string | null;
    };
}