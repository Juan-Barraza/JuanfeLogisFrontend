import api from '@/lib/axios'

import type {
    LogisticsKPIResponse,
    LogisticsDistributionResponse,
    FinancialKPIResponse,
    FinancialTrendResponse,
    ProfitabilityResponse,
    DistributionItem,
    FinancialDistributionItem,
} from '@/types/dashboard.types'

export interface FinancialFilters {
    startDate?: string // YYYY-MM-DD
    endDate?: string   // YYYY-MM-DD
}

export const dashboardApi = {
    // ---- LOGÍSTICA ----
    getLogisticsKPIs: async (): Promise<LogisticsKPIResponse> =>
        (await api.get('/dashboard/logistics/kpis')).data,

    getLogisticsDistribution: async (): Promise<LogisticsDistributionResponse> =>
        (await api.get('/dashboard/logistics/distribution')).data,

    getLocationDistribution: async (): Promise<DistributionItem[]> =>
        (await api.get('/dashboard/logistics/locations')).data,

    getTopDonorsLogistics: async (): Promise<DistributionItem[]> =>
        (await api.get('/dashboard/logistics/donors/top')).data,

    // ---- FINANCIERO (con filtros de fecha) ----
    getFinancialKPIs: async (filters?: FinancialFilters): Promise<FinancialKPIResponse> =>
        (await api.get('/dashboard/financial/kpis', { params: filters })).data,

    getFinancialTrends: async (filters?: FinancialFilters): Promise<FinancialTrendResponse> =>
        (await api.get('/dashboard/financial/trends', { params: filters })).data,

    getTopDonorsFinancial: async (filters?: FinancialFilters): Promise<FinancialDistributionItem[]> =>
        (await api.get('/dashboard/financial/donors/top', { params: filters })).data,

    getProfitability: async (filters?: FinancialFilters): Promise<ProfitabilityResponse> =>
        (await api.get('/dashboard/financial/profitability', { params: filters })).data,
}
