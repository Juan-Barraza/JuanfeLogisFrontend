export interface PaginatedResponse<T> {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  data: T[];
}

export interface BoxResponse {
  id: string;
  name: string;
  location_id: number;
  location_name: string;
  labels: string[];
  qr_code_url: string;
  created_at: string;
}

export interface BoxStockItem {
  product_id: string;
  product_type_name: string;
  donor_name: string;
  quantity: number;
  donation_price: number;
  sale_price: number;
  physical_condition: string;
}

export interface BoxDetailResponse {
  box: BoxResponse;
  products: BoxStockItem[];
}

export interface BoxRequest {
  name: string;
  location_id: number;
  label_ids: number[];
}

export interface BoxStockRequest {
  product_id: string;
  quantity: number;
}