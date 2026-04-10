import { useState } from 'react'
import { Plus, Edit2, Loader2, ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { useDonors } from '@/hooks/useSettings'
import type { Donor } from '@/types/settings.types'
import DonorModal from './DonorModal'

const TYPE_CONFIG: Record<string, { label: string; classes: string }> = {
    'Persona': {
        label: 'Persona',
        classes: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 ring-1 ring-inset ring-blue-200 dark:ring-blue-500/30',
    },
    'Empresa': {
        label: 'Empresa',
        classes: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400 ring-1 ring-inset ring-violet-200 dark:ring-violet-500/30',
    },
    'Organización': {
        label: 'Organización',
        classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-500/30',
    },
}

const DEFAULT_TYPE_CLASSES = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 ring-1 ring-inset ring-slate-200 dark:ring-slate-700'

export default function DonorsTable() {
    const [page, setPage] = useState(1)
    const pageSize = 10
    const { data: responseData, isLoading, isError } = useDonors(page, pageSize)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [donorToEdit, setDonorToEdit] = useState<Donor | null>(null)

    const handleCreate = () => { setDonorToEdit(null); setIsModalOpen(true) }
    const handleEdit = (donor: Donor) => { setDonorToEdit(donor); setIsModalOpen(true) }

    const { data: donors = [], total_pages = 1, total_items = 0 } = responseData || {}

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Users size={16} className="text-blue-500" />
                        Donadores
                    </h3>
                    {!isLoading && (
                        <p className="text-xs text-slate-400 mt-0.5">{total_items} registros en total</p>
                    )}
                </div>
                <button
                    onClick={handleCreate}
                    className="btn-primary flex items-center gap-1.5 px-3 py-2 text-sm flex-shrink-0"
                >
                    <Plus size={14} />
                    <span>Nuevo Donador</span>
                </button>
            </div>

            {/* Table card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">

                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                                    Nombre
                                </th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                                    Tipo
                                </th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest text-center">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">

                            {isLoading && (
                                <tr>
                                    <td colSpan={4} className="px-5 py-14 text-center">
                                        <Loader2 size={20} className="animate-spin mx-auto mb-2 text-slate-300" />
                                        <p className="text-sm text-slate-400">Cargando donadores...</p>
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-red-500">
                                        Error al cargar los donadores.
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !isError && donors.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-5 py-14 text-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                                            <Users size={18} className="text-slate-300" />
                                        </div>
                                        <p className="text-sm text-slate-400">Sin donadores registrados</p>
                                    </td>
                                </tr>
                            )}

                            {donors.map((donor) => {
                                const typeConf = TYPE_CONFIG[donor.type]
                                return (
                                    <tr
                                        key={donor.id}
                                        className="group hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                                    >

                                        <td className="px-5 py-3.5 text-sm font-medium text-slate-800 dark:text-slate-100">
                                            {donor.name}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${typeConf?.classes ?? DEFAULT_TYPE_CLASSES}`}>
                                                {typeConf?.label ?? donor.type}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-center">
                                            <button
                                                onClick={() => handleEdit(donor)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-accent/10 transition-all"
                                                title="Editar"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                    <p className="text-xs text-slate-400">
                        {donors.length} de {total_items}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                            {page} / {total_pages || 1}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(total_pages, p + 1))}
                            disabled={page >= total_pages}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <DonorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                donorToEdit={donorToEdit}
            />
        </div>
    )
}