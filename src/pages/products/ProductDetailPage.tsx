import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    Edit,
    Trash2,
    Calendar,
    User,
    Tag,
    Box,
    DollarSign,
    Target,
    ShieldCheck,
    AlertCircle
} from 'lucide-react'
import { useProduct, useDeleteProduct } from '@/hooks/useProducts'
import { useState } from 'react'
import { toast } from 'sonner'
import ProductModal from './components/ProductModal'
import DeleteConfirmModal from '../boxes/components/DeleteConfirmModal'

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { data: product, isLoading, isError } = useProduct(id!)
    const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
                <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                <p>Cargando detalles del producto...</p>
            </div>
        )
    }

    if (isError || !product) {
        return (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-8 rounded-2xl text-center">
                <AlertCircle className="text-red-500 mx-auto mb-3" size={32} />
                <p className="text-red-600 dark:text-red-400 font-medium">No se pudo encontrar el producto solicitado.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="mt-4 text-sm font-bold text-accent hover:underline"
                >
                    Volver al inventario
                </button>
            </div>
        )
    }

    const confirmDelete = () => {
        deleteProduct(product.id, {
            onSuccess: () => {
                toast.success('Producto eliminado exitosamente')
                setIsDeleteModalOpen(false)
                navigate('/products')
            },
            onError: (err: any) => {
                toast.error('Error al eliminar el producto', {
                    description: err.response?.data?.error || 'Intenta de nuevo'
                })
                setIsDeleteModalOpen(false)
            }
        })
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Nav Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/products')}
                        className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-105"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white capitalize">
                            {product.product_type_name}
                        </h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                            <span className="text-accent">SKU:</span>
                            <span>{product.id.split('-')[0]}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Volver</span>
                    </button>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        title="Editar información"
                    >
                        <Edit size={20} />
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="p-2.5 rounded-2xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                        title="Eliminar producto"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Identity Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                            <Tag size={120} />
                        </div>

                        <div className="relative space-y-8">
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-black uppercase tracking-widest">
                                    {product.disposition}
                                </span>
                                <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-xs font-black uppercase tracking-widest">
                                    Estado: {product.physical_condition}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                        <Box size={14} /> Información Técnica
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-baseline py-2 border-b border-slate-50 dark:border-slate-800">
                                            <span className="text-sm text-slate-500">Talla registrada</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{product.size || 'Sin Talla'}</span>
                                        </div>
                                        <div className="flex justify-between items-baseline py-2 border-b border-slate-50 dark:border-slate-800">
                                            <span className="text-sm text-slate-500">Categoría</span>
                                            <span className="font-bold text-slate-900 dark:text-white capitalize">{product.product_type_name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                        <User size={14} /> Origen & Registro
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-baseline py-2 border-b border-slate-50 dark:border-slate-800">
                                            <span className="text-sm text-slate-500">Donado por</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{product.donor_name}</span>
                                        </div>
                                        <div className="flex justify-between items-baseline py-2 border-b border-slate-50 dark:border-slate-800">
                                            <span className="text-sm text-slate-500">Fecha Ingreso</span>
                                            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                                                <Calendar size={14} className="text-slate-400" />
                                                {new Date(product.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description Block */}
                            {product.description && (
                                <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
                                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                                        Detalles Adicionales
                                    </h4>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                                        <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed">
                                            "{product.description}"
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                    {/* Financial Card */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/40 transition-all duration-700" />
                        <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <DollarSign size={14} /> Análisis Financiero
                        </h4>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-wider mb-1">Precio de Venta Sugerido</p>
                                <p className="text-3xl font-black text-accent">{formatPrice(product.sale_price)}</p>
                            </div>
                            <div className="h-px bg-white/10" />
                            <div>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-wider mb-1">Valor de Donación (Avalúo)</p>
                                <p className="text-xl font-bold text-white/80">{formatPrice(product.donation_price)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quality Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ShieldCheck size={14} /> Garantía de Calidad
                        </h4>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                                <Target size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">{product.physical_condition}</p>
                                <p className="text-xs text-slate-500">Inspeccionado en el ingreso</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProductModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                productToEdit={product}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isPending={isDeleting}
                title="¿Eliminar este producto?"
                description={`Esta acción eliminará permanentemente la información de este artículo del inventario.`}
            />
        </div>
    )
}
