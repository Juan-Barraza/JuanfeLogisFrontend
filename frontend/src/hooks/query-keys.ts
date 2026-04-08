export const queryKeys = {
    auth: {
        all: ['auth'] as const,
        session: () => [...queryKeys.auth.all, 'session'] as const,
    },
    boxes: {
        all: ['boxes'] as const,
        list: (page: number, pageSize: number, name: string, location: string) => 
            [...queryKeys.boxes.all, 'list', { page, pageSize, name, location }] as const,
        detail: (id: string) => [...queryKeys.boxes.all, 'detail', id] as const,
    },
}