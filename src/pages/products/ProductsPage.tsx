import { useState } from 'react'
import { Plus, Search, Filter, ShoppingBag, ChevronLeft, ChevronRight, User, Tag, Box } from 'lucide-react'
import { useProducts, useDeleteProduct } from '@/hooks/useProducts'
import { useDebounce } from '@/hooks/useDebounce'
import type { Product, ProductFilters } from '@/types/product.types'
import ProductModal from './components/ProductModal'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import DeleteConfirmModal from '@/pages/boxes/components/DeleteConfirmModal'

export default function ProductsPage() {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [productToEdit, setProductToEdit] = useState<Product | null>(null)
    const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()
    const [filters, setFilters] = useState<ProductFilters>({
        type: '',
        size: '',
        donor: '',
        disposition: undefined
    })

    const debouncedSearch = useDebounce(searchTerm, 500)

    // Combine search term into filters
    const activeFilters: ProductFilters = {
        ...filters,
        type: debouncedSearch || undefined,
        size: filters.size || undefined,
        donor: filters.donor || undefined,
        disposition: filters.disposition || undefined
    }

    const { data: paginatedData, isLoading } = useProducts(page, 12, activeFilters)

    const handleEdit = (product: Product) => {
        setProductToEdit(product)
        setSelectedProductForStock(null)
        setIsModalOpen(true)
    }

    const handleAddToBox = (product: Product) => {
        setProductToEdit(null)
        setSelectedProductForStock(product)
        setIsModalOpen(true)
    }

    const handleDelete = (product: Product) => {
        setProductToEdit(product)
        setIsDeleteModalOpen(true)
    }

    const confirmDelete = () => {
        deleteProduct(productToEdit!.id, {
            onSuccess: () => {
                toast.success('Producto eliminado exitosamente')
                setIsDeleteModalOpen(false)
                navigate('/products')
            },
            onError: (err: any) => {
                toast.error('Error al eliminar el producto', {
                    description: err.response?.data?.error || 'Por favor intenta de nuevo'
                })
                setIsDeleteModalOpen(false)
            }
        })
    }

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Inventario de Productos</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Gestiona los artículos y su disposición final</p>
                </div>
                <button
                    onClick={() => {
                        setProductToEdit(null)
                        setIsModalOpen(true)
                    }}
                    className="btn-primary flex items-center gap-2 px-6 py-3 shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    <span>Nuevo Producto</span>
                </button>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search by Type */}
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft transition-all">
                        <Search className="text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tipo (ej: Camisa)..."
                            className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter by Donor */}
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft transition-all">
                        <User className="text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Donante..."
                            className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                            value={filters.donor}
                            onChange={(e) => setFilters({ ...filters, donor: e.target.value })}
                        />
                    </div>

                    {/* Filter by Size */}
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft transition-all">
                        <Tag size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Talla..."
                            className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                            value={filters.size}
                            onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                        />
                    </div>

                    {/* Filter by Disposition */}
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft transition-all">
                        <Filter className="text-slate-400" size={18} />
                        <select
                            className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm text-slate-900 dark:text-white"
                            value={filters.disposition || ''}
                            onChange={(e) => setFilters({ ...filters, disposition: e.target.value as any || undefined })}
                        >
                            <option value="">Todas las Disposiciones</option>
                            <option value="Closet Laboral">Closet Laboral</option>
                            <option value="Bazar">Bazar</option>
                            <option value="Tienda Juanfe">Tienda Juanfe</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    {(searchTerm || filters.donor || filters.size || filters.disposition) && (
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setFilters({
                                    type: '',
                                    donor: '',
                                    size: '',
                                    disposition: undefined
                                })
                                setPage(1)
                            }}
                            className="text-xs font-bold text-accent hover:underline px-2"
                        >
                            Limpiar Filtros
                        </button>
                    )}
                </div>
            </div>

            {/* Grid Layout */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedData?.data.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300"
                        >
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="p-3 bg-accent/10 text-accent rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {product.size || 'Unica'}
                                    </span>
                                </div>
                                <div onClick={() => navigate(`/products/${product.id}`)} className="cursor-pointer">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg capitalize">{product.product_type_name}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-1">Donado por: {product.donor_name}</p>
                                    {product.description && (
                                        <p className="text-xs text-slate-400 mt-2 line-clamp-2 italic">
                                            "{product.description}"
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400 font-medium">Precio Venta:</span>
                                        <span className="font-bold text-accent">{formatPrice(product.sale_price)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400 font-medium">Disposición:</span>
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 rounded font-bold uppercase text-[9px]">
                                            {product.disposition}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => handleAddToBox(product)}
                                    className="flex items-center gap-1.5 text-[10px] font-bold text-accent hover:bg-accent/10 py-1.5 px-3 rounded-lg transition-colors border border-accent/20"
                                >
                                    <Box size={12} />
                                    A Caja
                                </button>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="text-xs font-bold text-slate-400 hover:text-accent transition-colors"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product)}
                                        className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && paginatedData?.data.length === 0 && (
                <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No se encontraron productos</h3>
                    <p className="text-slate-400 mt-1">Intenta con otros términos de búsqueda o filtros</p>
                </div>
            )}

            {/* Pagination Placeholder */}
            {paginatedData && paginatedData.total_pages >= 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-400">
                        Mostrando página <span className="font-bold text-slate-700 dark:text-slate-200">{paginatedData.page}</span> de <span className="font-bold text-slate-700 dark:text-slate-200">{paginatedData.total_pages}</span>
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(paginatedData.total_pages, p + 1))}
                            disabled={page === paginatedData.total_pages}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isPending={isDeleting}
                title="¿Eliminar este producto?"
                description={`Estás a punto de ocultar "${productToEdit?.product_type_name}". El historial de movimientos se conservará en la base de datos para auditoría.`}
            />
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedProductForStock(null)
                }}
                productToEdit={productToEdit}
                initialSelectedProduct={selectedProductForStock}
            />
        </div>
    )
}
