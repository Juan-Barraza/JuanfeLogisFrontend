export interface Donor {
    id: string;
    name: string;
    type: string;
    created_at: string;
}

export interface DonorRequest {
    name: string;
    type: string;
}

export interface PaginatedDonors {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    data: Donor[];
}

export interface Location {
    id: number;
    name: string;
    created_at: string;
}

export interface LocationRequest {
    name: string;
}

export interface ProductType {
    id: number;
    name: string;
}

export interface ProductTypeRequest {
    name: string;
}
