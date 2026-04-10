import { useState } from 'react'
import { Plus, Edit2, Loader2, Tag } from 'lucide-react'
import { useProductTypes } from '@/hooks/useSettings'
import type { ProductType } from '@/types/settings.types'
import ProductTypeModal from './ProductTypeModal'

export default function ProductTypesTable() {
    const { data: productTypes, isLoading, isError } = useProductTypes()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [productTypeToEdit, setProductTypeToEdit] = useState<ProductType | null>(null)

    const handleCreate = () => { setProductTypeToEdit(null); setIsModalOpen(true) }
    const handleEdit = (pt: ProductType) => { setProductTypeToEdit(pt); setIsModalOpen(true) }

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between gap-6">
                <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Tag size={16} className="text-violet-500" />
                        Tipos de Producto
                    </h3>
                    {!isLoading && (
                        <p className="text-xs text-slate-400 mt-0.5">
                            {productTypes?.length ?? 0} registros en total
                        </p>
                    )}
                </div>
                <button
                    onClick={handleCreate}
                    className="btn-primary flex items-center gap-1.5 px-3 py-2 text-sm flex-shrink-0"
                >
                    <Plus size={14} />
                    <span>Nuevo Tipo</span>
                </button>
            </div>

            {/* Table card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest w-20">
                                    ID
                                </th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest text-center">
                                    Nombre
                                </th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest text-center">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">

                            {isLoading && (
                                <tr>
                                    <td colSpan={3} className="px-5 py-14 text-center">
                                        <Loader2 size={20} className="animate-spin mx-auto mb-2 text-slate-300" />
                                        <p className="text-sm text-slate-400">Cargando tipos...</p>
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={3} className="px-5 py-10 text-center text-sm text-red-500">
                                        Error al cargar los tipos de producto.
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !isError && productTypes?.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-5 py-14 text-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                                            <Tag size={18} className="text-slate-300" />
                                        </div>
                                        <p className="text-sm text-slate-400">Sin tipos registrados</p>
                                    </td>
                                </tr>
                            )}

                            {productTypes?.map((pt) => (
                                <tr
                                    key={pt.id}
                                    className="group hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                                >
                                    <td className="px-5 py-3.5">
                                        <span className="text-[11px] font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                            #{pt.id}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm font-medium text-slate-800 dark:text-slate-100 text-center">
                                        {pt.name}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <button
                                            onClick={() => handleEdit(pt)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-accent/10 transition-all"
                                            title="Editar"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductTypeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productTypeToEdit={productTypeToEdit}
            />
        </div>
    )
}