export type ProductDisposition = 'Closet Laboral' | 'Bazar' | 'Tienda Juanfe'

export interface Product {
    id: string;
    product_type_id: number;
    donor_id: string;
    product_type_name: string;
    donor_name: string;
    size: string;
    donation_price: number;
    sale_price: number;
    physical_condition: string;
    disposition: ProductDisposition;
    created_at: string;
    updated_at: string;
}

export interface PaginatedProducts {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    data: Product[];
}

export interface ProductRequest {
    product_type_id: number;
    donor_id: string;
    size: string;
    donation_price: number;
    sale_price: number;
    physical_condition: string;
    disposition: ProductDisposition;
}

export interface ProductFilters {
    type?: string;
    size?: string;
    donor?: string;
    disposition?: ProductDisposition;
}
