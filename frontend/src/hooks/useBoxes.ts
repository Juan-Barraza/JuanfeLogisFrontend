import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { boxApi } from '@/api/box.api'
import { queryKeys } from './query-keys'
import type { BoxRequest, BoxStockRequest } from '@/types/box.types'

export const useBoxes = (page = 1, pageSize = 10, name = '', location = '') => {
  return useQuery({
    queryKey: queryKeys.boxes.list(page, pageSize, name, location),
    queryFn: () => boxApi.getBoxes(page, pageSize, name, location),
  })
}

export const useBox = (id: string) => {
  return useQuery({
    queryKey: queryKeys.boxes.detail(id),
    queryFn: () => boxApi.getBoxById(id),
    enabled: !!id,
  })
}

export const useCreateBox = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: BoxRequest) => boxApi.createBox(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boxes.all })
    },
  })
}

export const useUpdateBox = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BoxRequest }) =>
      boxApi.updateBox(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boxes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.boxes.detail(id) })
    },
  })
}

export const useDeleteBox = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => boxApi.deleteBox(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boxes.all })
    },
  })
}

// Stock Mutations
export const useAddBoxStock = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ boxId, data }: { boxId: string; data: BoxStockRequest }) =>
      boxApi.addBoxStock(boxId, data),
    onSuccess: (_, { boxId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boxes.detail(boxId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
  })
}

export const useRemoveBoxStock = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ boxId, data }: { boxId: string; data: BoxStockRequest }) =>
      boxApi.removeBoxStock(boxId, data),
    onSuccess: (_, { boxId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boxes.detail(boxId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
  })
}

export const useReturnBoxStock = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ boxId, data }: { boxId: string; data: BoxStockRequest }) =>
      boxApi.returnBoxStock(boxId, data),
    onSuccess: (_, { boxId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.boxes.detail(boxId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
  })
}
