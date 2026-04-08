export interface LogisticsKPIResponse {
    totalPhysicalItems: number;
    totalActiveBoxes: number;
    totalUniqueDonors: number;
}

export interface DistributionItem {
    label: string;
    value: number;
}

export interface LogisticsDistributionResponse {
    bySize: DistributionItem[];
    byCondition: DistributionItem[];
    byDisposition: DistributionItem[];
    byType: DistributionItem[];
}

export interface FinancialKPIResponse {
    totalSold: number;
    totalDonatedValue: number;
    inventoryValue: number;
}

export interface FinancialTrendItem {
    period: string;
    value: number;
}

export interface FinancialTrendResponse {
    salesTrends: FinancialTrendItem[];
    donationTrends: FinancialTrendItem[];
}

export interface FinancialDistributionItem {
    label: string;
    value: number;
}

export interface ProfitabilityResponse {
    totalRevenue: number;
    totalCost: number;
    netProfit: number;
}
