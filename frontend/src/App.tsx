import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/query-client';
import { router } from './router';

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster position="top-right" richColors />
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}