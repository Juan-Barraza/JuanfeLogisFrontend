export const queryKeys = {
    dashboard: {
        all: ['dashboard'] as const,
        logistics: () => [...queryKeys.dashboard.all, 'logistics'] as const,
        financial: () => [...queryKeys.dashboard.all, 'financial'] as const,
    },
    auth: {
        all: ['auth'] as const,
        session: () => [...queryKeys.auth.all, 'session'] as const,
    },
    boxes: {
        all: ['boxes'] as const,
        list: (page: number, pageSize: number, name: string, location: string, productId?: string) =>
            [...queryKeys.boxes.all, 'list', { page, pageSize, name, location, productId }] as const,
        detail: (id: string) => [...queryKeys.boxes.all, 'detail', id] as const,
    },
    products: {
        all: ['products'] as const,
        list: (page: number, pageSize: number, filters: any) =>
            [...queryKeys.products.all, 'list', { page, pageSize, ...filters }] as const,
        detail: (id: string) => [...queryKeys.products.all, 'detail', id] as const,
    },
    transactions: {
        all: ['transactions'] as const,
        list: (page: number, pageSize: number, filters: any) =>
            [...queryKeys.transactions.all, 'list', { page, pageSize, ...filters }] as const,
        detail: (id: string) => [...queryKeys.transactions.all, 'detail', id] as const,
    },
}