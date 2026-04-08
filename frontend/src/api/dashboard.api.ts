import api from '@/lib/axios'

import type { 
    LogisticsKPIResponse, 
    LogisticsDistributionResponse,
    FinancialKPIResponse,
    FinancialTrendResponse,
    ProfitabilityResponse,
    DistributionItem,
    FinancialDistributionItem
} from '@/types/dashboard.types'

export const dashboardApi = {
    getLogisticsKPIs: async (): Promise<LogisticsKPIResponse> => 
        (await api.get('/dashboard/logistics/kpis')).data,
        
    getLogisticsDistribution: async (): Promise<LogisticsDistributionResponse> => 
        (await api.get('/dashboard/logistics/distribution')).data,
        
    getLocationDistribution: async (): Promise<DistributionItem[]> => 
        (await api.get('/dashboard/logistics/locations')).data,
        
    getTopDonorsLogistics: async (): Promise<DistributionItem[]> => 
        (await api.get('/dashboard/logistics/donors/top')).data,
        
    getFinancialKPIs: async (): Promise<FinancialKPIResponse> => 
        (await api.get('/dashboard/financial/kpis')).data,
        
    getFinancialTrends: async (): Promise<FinancialTrendResponse> => 
        (await api.get('/dashboard/financial/trends')).data,
        
    getTopDonorsFinancial: async (): Promise<FinancialDistributionItem[]> => 
        (await api.get('/dashboard/financial/donors/top')).data,
        
    getProfitability: async (): Promise<ProfitabilityResponse> => 
        (await api.get('/dashboard/financial/profitability')).data,
}
