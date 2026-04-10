import { useState } from 'react'
import { Plus, Edit2, Warehouse } from 'lucide-react'
import { useLocations } from '@/hooks/useSettings'
import type { Location } from '@/types/settings.types'
import LocationModal from './LocationModal'



export default function LocationsTable() {
    const { data: locations, isLoading, isError } = useLocations()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [locationToEdit, setLocationToEdit] = useState<Location | null>(null)

    const handleCreate = () => { setLocationToEdit(null); setIsModalOpen(true) }
    const handleEdit = (location: Location) => { setLocationToEdit(location); setIsModalOpen(true) }

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Warehouse size={15} className="text-emerald-500" />
                        Bodegas
                    </h3>
                    {!isLoading && (
                        <p className="text-xs text-slate-400 mt-0.5">
                            {locations?.length ?? 0} registros encontrados
                        </p>
                    )}
                </div>
                <button
                    onClick={handleCreate}
                    className="btn-primary flex items-center gap-1.5 px-3 py-2 text-sm flex-shrink-0"
                >
                    <Plus size={14} />
                    <span>Añadir Bodega</span>
                </button>
            </div>

            {/* Tabla — desktop */}
            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest w-24">
                                    ID
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Nombre
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">

                            {isLoading && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-16 text-center">
                                        <div className="flex items-center justify-center gap-3 text-slate-400">
                                            <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                                            Cargando bodegas...
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {isError && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-16 text-center text-red-500 text-sm">
                                        Error al cargar las bodegas.
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !isError && locations?.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-16 text-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                                            <Warehouse size={18} className="text-slate-300" />
                                        </div>
                                        <p className="text-sm text-slate-400">Sin bodegas registradas</p>
                                    </td>
                                </tr>
                            )}

                            {!isLoading && locations?.map((location) => (
                                <tr
                                    key={location.id}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm font-bold text-slate-500 dark:text-slate-400">
                                            #{location.id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200">
                                        {location.name}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleEdit(location)}
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

            {/* Cards — móvil */}
            <div className="md:hidden space-y-3">
                {isLoading && (
                    <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                        <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                        Cargando bodegas...
                    </div>
                )}

                {isError && (
                    <p className="text-center text-red-500 text-sm py-8">
                        Error al cargar las bodegas.
                    </p>
                )}

                {!isLoading && !isError && locations?.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                            <Warehouse size={18} className="text-slate-300" />
                        </div>
                        <p className="text-sm text-slate-400">Sin bodegas registradas</p>
                    </div>
                )}

                {!isLoading && locations?.map((location) => (
                    <div
                        key={location.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between gap-3"
                    >
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                {location.name}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-400">
                                #{location.id}
                            </span>
                        </div>
                        <button
                            onClick={() => handleEdit(location)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-accent hover:bg-accent/10 transition-all flex-shrink-0"
                            title="Editar"
                        >
                            <Edit2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <LocationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                locationToEdit={locationToEdit}
            />
        </div>
    )
}