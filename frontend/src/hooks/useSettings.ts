import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsApi } from '@/api/settings.api'
import type { DonorRequest, LocationRequest, ProductTypeRequest } from '@/types/settings.types'
import { useAuthStore } from '@/store/auth.store'

// ---- Donors Hooks ----
export function useDonors(page: number, pageSize: number = 10) {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: ['settings', 'donors', page, pageSize],
        queryFn: () => settingsApi.getDonors(page, pageSize),
        enabled: !!user?.id,
    })
}

export function useCreateDonor() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: DonorRequest) => settingsApi.createDonor(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings', 'donors'] })
        },
    })
}

export function useUpdateDonor() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: DonorRequest }) => settingsApi.updateDonor(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings', 'donors'] })
        },
    })
}

// ---- Locations Hooks ----
export function useLocations() {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: ['settings', 'locations'],
        queryFn: settingsApi.getLocations,
        enabled: !!user?.id,
    })
}

export function useCreateLocation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: LocationRequest) => settingsApi.createLocation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings', 'locations'] })
        },
    })
}

export function useUpdateLocation() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: LocationRequest }) => settingsApi.updateLocation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings', 'locations'] })
        },
    })
}

// ---- Product Types Hooks ----
export function useProductTypes() {
    const user = useAuthStore((s) => s.user)
    return useQuery({
        queryKey: ['settings', 'product-types'],
        queryFn: settingsApi.getProductTypes,
        enabled: !!user?.id,
    })
}

export function useCreateProductType() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: ProductTypeRequest) => settingsApi.createProductType(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings', 'product-types'] })
        },
    })
}

export function useUpdateProductType() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ProductTypeRequest }) => settingsApi.updateProductType(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings', 'product-types'] })
        },
    })
}
