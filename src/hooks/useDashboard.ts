import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard.api'
import type { FinancialFilters } from '@/api/dashboard.api'
import { useAuthStore } from '@/store/auth.store'
import { queryKeys } from './query-keys'

// ---- LOGÍSTICO ----

export function useLogisticsKPIs() {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: [...queryKeys.dashboard.logistics(), 'kpis'],
        queryFn: dashboardApi.getLogisticsKPIs,
        enabled: !!user?.id,
    })
}

export function useLogisticsDistribution() {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: [...queryKeys.dashboard.logistics(), 'distribution'],
        queryFn: dashboardApi.getLogisticsDistribution,
        enabled: !!user?.id,
    })
}

export function useLocationDistribution() {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: [...queryKeys.dashboard.logistics(), 'locations'],
        queryFn: dashboardApi.getLocationDistribution,
        enabled: !!user?.id,
    })
}

export function useTopDonorsLogistics() {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: [...queryKeys.dashboard.logistics(), 'top-donors'],
        queryFn: dashboardApi.getTopDonorsLogistics,
        enabled: !!user?.id,
    })
}

// ---- FINANCIERO (con filtros de fecha opcionales) ----

export function useFinancialKPIs(filters?: FinancialFilters) {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: [...queryKeys.dashboard.financial(), 'kpis', filters],
        queryFn: () => dashboardApi.getFinancialKPIs(filters),
        enabled: !!user?.id,
    })
}

export function useFinancialTrends(filters?: FinancialFilters) {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: [...queryKeys.dashboard.financial(), 'trends', filters],
        queryFn: () => dashboardApi.getFinancialTrends(filters),
        enabled: !!user?.id,
    })
}

export function useTopDonorsFinancial(filters?: FinancialFilters) {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: [...queryKeys.dashboard.financial(), 'top-donors', filters],
        queryFn: () => dashboardApi.getTopDonorsFinancial(filters),
        enabled: !!user?.id,
    })
}

export function useProfitability(filters?: FinancialFilters) {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: [...queryKeys.dashboard.financial(), 'profitability', filters],
        queryFn: () => dashboardApi.getProfitability(filters),
        enabled: !!user?.id,
    })
}
