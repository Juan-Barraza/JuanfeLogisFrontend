import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import AuthLayout from '@/layouts/AuthLayout'
import AppLayout from '@/layouts/AppLayout'
import LoginPage from '@/pages/auth/LoginPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import SettingsPage from '@/pages/settings/SettingsPage'
import BoxesPage from '@/pages/boxes/BoxesPage'
import BoxDetailPage from '@/pages/boxes/BoxDetailPage'
import ProductsPage from '@/pages/products/ProductsPage'
import ProductDetailPage from '@/pages/products/ProductDetailPage'
import TransactionsPage from '@/pages/transactions/TransactionsPage'
import TransactionDetailPage from '@/pages/transactions/TransactionDetailPage'


function ProtectedRoute() {
    const token = useAuthStore((s) => s.token)
    if (!token) return <Navigate to="/login" replace />
    return <Outlet />
}

function PublicRoute() {
    const token = useAuthStore((s) => s.token)
    if (token) return <Navigate to="/dashboard" replace />
    return <Outlet />
}

export const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    { path: '/login', element: <LoginPage /> },
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <Navigate to="/dashboard" replace />,
            },
            {
                element: <AppLayout />,
                children: [
                    { path: '/dashboard', element: <DashboardPage /> },
                    { path: '/settings', element: <SettingsPage /> },
                    { path: '/boxes', element: <BoxesPage /> },
                    { path: '/boxes/:id', element: <BoxDetailPage /> },
                    { path: '/products', element: <ProductsPage /> },
                    { path: '/products/:id', element: <ProductDetailPage /> },
                    { path: '/transactions', element: <TransactionsPage /> },
                    { path: '/transactions/:id', element: <TransactionDetailPage /> },
                ],
            },
        ],
    },
])