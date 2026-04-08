import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard.api'
import { useAuthStore } from '@/store/auth.store'

export function useLogisticsKPIs() {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: ['dashboard', 'logistics', 'kpis'],
        queryFn: dashboardApi.getLogisticsKPIs,
        enabled: !!user?.id

    })
}

export function useLogisticsDistribution() {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: ['dashboard', 'logistics', 'distribution'],
        queryFn: dashboardApi.getLogisticsDistribution,
        enabled: !!user?.id
    })
}

export function useLocationDistribution() {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: ['dashboard', 'logistics', 'locations'],
        queryFn: dashboardApi.getLocationDistribution,
        enabled: !!user?.id
    })
}

export function useTopDonorsLogistics() {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: ['dashboard', 'logistics', 'top-donors'],
        queryFn: dashboardApi.getTopDonorsLogistics,
        enabled: !!user?.id
    })
}

export function useFinancialKPIs() {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: ['dashboard', 'financial', 'kpis'],
        queryFn: dashboardApi.getFinancialKPIs,
        enabled: !!user?.id
    })
}

export function useFinancialTrends() {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: ['dashboard', 'financial', 'trends'],
        queryFn: dashboardApi.getFinancialTrends,
        enabled: !!user?.id
    })
}

export function useTopDonorsFinancial() {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: ['dashboard', 'financial', 'top-donors'],
        queryFn: dashboardApi.getTopDonorsFinancial,
        enabled: !!user?.id
    })
}

export function useProfitability() {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: ['dashboard', 'financial', 'profitability'],
        queryFn: dashboardApi.getProfitability,
        enabled: !!user?.id
    })
}
