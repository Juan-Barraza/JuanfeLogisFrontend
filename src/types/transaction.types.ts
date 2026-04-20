import type { ProductDisposition } from "./product.types";

export type TransactionType = 'entrada' | 'salida' | 'devolucion' | 'ajuste'

export interface Transaction {
    id: string;
    type: TransactionType;
    user_name: string;
    created_at: string;
    item_count: number;
}

export interface TransactionItem {
    id: string;
    product_id: string;
    product_name: string;
    box_id: string;
    box_name: string;
    quantity: number;
    applied_price: number;
    destination: ProductDisposition;
}

export interface TransactionDetail extends Omit<Transaction, 'item_count'> {
    items: TransactionItem[];
}

export interface PaginatedTransactions {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    data: Transaction[];
}

export interface TransactionFilters {
    type?: string;
    startDate?: string;
    endDate?: string;
}

export interface TransactionRequest {
    product_id: string;
    quantity: number;
    disposition: ProductDisposition;
}