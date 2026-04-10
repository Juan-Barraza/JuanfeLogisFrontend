import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { queryKeys } from './query-keys'
import type { PaginatedTransactions, TransactionDetail, TransactionFilters } from '@/types/transaction.types'

export function useTransactions(page: number, pageSize: number, filters: TransactionFilters) {
    return useQuery({
        queryKey: queryKeys.transactions.list(page, pageSize, filters),
        queryFn: async () => {
            const { data } = await api.get<PaginatedTransactions>('/transactions', {
                params: {
                    page,
                    pageSize,
                    ...filters
                }
            })
            return data
        }
    })
}

export function useTransaction(id: string) {
    return useQuery({
        queryKey: queryKeys.transactions.detail(id),
        queryFn: async () => {
            const { data } = await api.get<TransactionDetail>(`/transactions/${id}`)
            return data
        },
        enabled: !!id
    })
}
