import api from '@/lib/axios'
import type { PaginatedProducts, Product, ProductRequest, ProductFilters } from '@/types/product.types';

export const productApi = {
    getProducts: async (page = 1, pageSize = 10, filters: ProductFilters = {}) => {
        let url = `/products?page=${page}&page_size=${pageSize}`;
        if (filters.type) url += `&type=${encodeURIComponent(filters.type)}`;
        if (filters.donor) url += `&donor=${encodeURIComponent(filters.donor)}`;
        if (filters.size) url += `&size=${encodeURIComponent(filters.size)}`;
        if (filters.disposition) url += `&disposition=${encodeURIComponent(filters.disposition)}`;

        const { data } = await api.get<PaginatedProducts>(url);
        return data;
    },

    getProduct: async (id: string): Promise<Product> => {
        const { data } = await api.get<Product>(`/products/${id}`);
        return data;
    },

    createProduct: async (product: ProductRequest): Promise<Product> => {
        const { data } = await api.post('/products', product);
        return data;
    },

    updateProduct: async (id: string, product: ProductRequest): Promise<Product> => {
        const { data } = await api.put(`/products/${id}`, product);
        return data;
    },

    deleteProduct: async (id: string): Promise<void> => {
        await api.delete(`/products/${id}`);
    },
};
