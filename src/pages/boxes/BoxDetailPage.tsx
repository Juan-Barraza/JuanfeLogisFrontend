import { useParams, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    Download,
    Trash2,
    Plus,
    Package,
    MapPin,
    Calendar,
    Search,
    AlertCircle,
    ShoppingBag
} from 'lucide-react'
import { useBox, useDeleteBox } from '@/hooks/useBoxes'
import { boxApi } from '@/api/box.api'
import { useState } from 'react'
import { toast } from 'sonner'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import ProductModal from '../products/components/ProductModal'

export default function BoxDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { data: detailData, isLoading, isError } = useBox(id!)
    const { mutate: deleteBox, isPending: isDeleting } = useDeleteBox()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [productModalMode, setProductModalMode] = useState<'new' | 'existing'>('new')

    const [searchTerm, setSearchTerm] = useState('')

    const formatPrice = (value: number | string) => {
        const num = typeof value === 'string' ? parseFloat(value) : value
        if (isNaN(num)) return '$ 0'

        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
                <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                <p>Cargando detalles de la caja...</p>
            </div>
        )
    }

    if (isError || !detailData) {
        return (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-8 rounded-2xl text-center">
                <AlertCircle className="text-red-500 mx-auto mb-3" size={32} />
                <p className="text-red-600 dark:text-red-400 font-medium">No se pudo encontrar la caja solicitada.</p>
                <button
                    onClick={() => navigate('/boxes')}
                    className="mt-4 text-sm font-bold text-accent hover:underline"
                >
                    Volver al listado
                </button>
            </div>
        )
    }

    const { box, products } = detailData

    const handleDelete = () => {
        if (products.length > 0) {
            toast.error('No se puede eliminar una caja que contiene productos.', {
                description: 'Asegúrate de que la caja esté vacía antes de borrarla.'
            })
            return
        }

        setIsDeleteModalOpen(true)
    }

    const confirmDelete = () => {
        deleteBox(box.id, {
            onSuccess: () => {
                toast.success('Caja eliminada exitosamente')
                setIsDeleteModalOpen(false)
                navigate('/boxes')
            },
            onError: (err: any) => {
                toast.error('Error al eliminar la caja', {
                    description: err.response?.data?.error || 'Por favor intenta de nuevo'
                })
                setIsDeleteModalOpen(false)
            }
        })
    }

    const handleDownloadQR = async () => {
        try {
            await boxApi.downloadBoxQR(box.id)
            toast.success('Código QR descargado correctamente')
        } catch (err) {
            toast.error('Error al descargar el código QR.')
        }
    }

    const filteredProducts = products.filter(p =>
        p.product_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.donor_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Nav Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button
                        onClick={() => navigate('/boxes')}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="min-w-0">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                            {box.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1 shrink-0">
                                <MapPin size={12} />
                                {box.location_name}
                            </span>
                            <span className="flex items-center gap-1 shrink-0">
                                <Calendar size={12} />
                                {new Date(box.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                        onClick={handleDownloadQR}
                        className="btn-secondary flex items-center gap-2 px-3 md:px-4 py-2 text-sm rounded-xl whitespace-nowrap"
                        title="Descargar QR"
                    >
                        <Download size={16} />
                        <span className="hidden md:inline">Descargar QR</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-50 text-red-600 border border-red-100 p-2 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50 shrink-0"
                        title="Eliminar caja"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Info Card */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Información General</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-slate-400 text-xs">ID de Caja</p>
                                <p className="font-mono text-slate-700 dark:text-slate-200 mt-0.5">{box.id}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs text-medium">Etiquetas</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {box.labels.map((label, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-accent/10 text-accent rounded-lg font-bold text-[10px] uppercase">
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-accent to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-accent/20">
                        <ShoppingBag size={24} className="mb-4 opacity-50" />
                        <h4 className="text-2xl font-black mb-1">{products.length}</h4>
                        <p className="text-xs font-bold text-white/70 uppercase">Productos Registrados</p>
                    </div>
                </div>

                {/* Products Table */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Contenedor de Buscador */}
                        <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft transition-all">
                            <Search className="text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar en el inventario..."
                                className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => {
                                setProductModalMode('existing')
                                setIsProductModalOpen(true)
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
                        >
                            <Search size={16} />
                            <span>Agregar Existente</span>
                        </button>
                        <button
                            onClick={() => {
                                setProductModalMode('new')
                                setIsProductModalOpen(true)
                            }}
                            className="btn-primary flex items-center gap-2 px-4 py-2 text-sm rounded-xl shrink-0"
                        >
                            <Plus size={16} />
                            <span>Agregar Producto</span>
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Donante</th>
                                        <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Cant.</th>
                                        <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider">P. Donación</th>
                                        <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider">P. Venta</th>
                                        <th className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase tracking-wider">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {filteredProducts.map((p, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div 
                                                    onClick={() => navigate(`/products/${p.product_id}`)}
                                                    className="flex flex-col cursor-pointer group/item"
                                                >
                                                    <span className="font-bold text-slate-900 dark:text-white capitalize group-hover/item:text-accent transition-colors">
                                                        {p.product_type_name}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-400">
                                                        {p.product_id.substring(0, 8)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{p.donor_name}</td>
                                            <td className="px-6 py-4 font-black text-slate-900 dark:text-white">{p.quantity}</td>
                                            <td className="px-6 py-4 font-bold text-emerald-500">{formatPrice(p.donation_price)}</td>
                                            <td className="px-6 py-4 font-bold text-emerald-500">{formatPrice(p.sale_price)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${p.physical_condition === 'nuevo'
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                                                    : 'bg-orange-50 text-orange-600 dark:bg-orange-900/20'
                                                    }`}>
                                                    {p.physical_condition}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center">
                                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Package size={24} className="text-slate-300" />
                                                </div>
                                                <p className="text-slate-400">No hay productos en esta caja</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isPending={isDeleting}
                title="¿Eliminar esta caja?"
                description={`Estás a punto de eliminar "${box.name}". Esta acción no se puede deshacer.`}
            />
            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                initialBoxId={box.id}
                initialMode={productModalMode}
            />
        </div>
    )
}
