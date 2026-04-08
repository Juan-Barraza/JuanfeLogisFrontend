import api from '@/lib/axios'
import type { 
    Donor, DonorRequest, PaginatedDonors, 
    Location, LocationRequest, 
    ProductType, ProductTypeRequest 
} from '@/types/settings.types'

export const settingsApi = {
    // Donors
    getDonors: async (page = 1, pageSize = 10): Promise<PaginatedDonors> => 
        (await api.get(`/donors?page=${page}&page_size=${pageSize}`)).data,
    createDonor: async (data: DonorRequest): Promise<Donor> => 
        (await api.post('/donors', data)).data,
    updateDonor: async (id: string, data: DonorRequest): Promise<Donor> => 
        (await api.put(`/donors/${id}`, data)).data,

    // Locations
    getLocations: async (): Promise<Location[]> => 
        (await api.get('/locations')).data,
    createLocation: async (data: LocationRequest): Promise<Location> => 
        (await api.post('/locations', data)).data,
    updateLocation: async (id: number, data: LocationRequest): Promise<Location> => 
        (await api.put(`/locations/${id}`, data)).data,

    // Product Types
    getProductTypes: async (): Promise<ProductType[]> => 
        (await api.get('/product-types')).data,
    createProductType: async (data: ProductTypeRequest): Promise<ProductType> => 
        (await api.post('/product-types', data)).data,
    updateProductType: async (id: number, data: ProductTypeRequest): Promise<ProductType> => 
        (await api.put(`/product-types/${id}`, data)).data,
}
