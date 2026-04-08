import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false, // No recargar datos al cambiar de pestaña
            staleTime: 1000 * 60 * 5, // Los datos se consideran "frescos" por 5 minutos
        },
    },
});