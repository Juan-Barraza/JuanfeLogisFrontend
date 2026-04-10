import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/product.api';
import { queryKeys } from './query-keys';
import type { ProductRequest, ProductFilters } from '../types/product.types';

export const useProducts = (page: number, pageSize: number, filters: ProductFilters = {}) => {
    return useQuery({
        queryKey: queryKeys.products.list(page, pageSize, filters),
        queryFn: () => productApi.getProducts(page, pageSize, filters),
    });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: queryKeys.products.detail(id),
        queryFn: () => productApi.getProduct(id),
        enabled: !!id,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ProductRequest) => productApi.createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ProductRequest }) =>
            productApi.updateProduct(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => productApi.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
        },
    });
};
