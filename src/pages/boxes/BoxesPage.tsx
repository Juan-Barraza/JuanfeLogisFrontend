import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    Package,
    MapPin,
    Tag as TagIcon,
    ExternalLink,
    Filter
} from 'lucide-react'
import { useBoxes } from '@/hooks/useBoxes'
import { useDebounce } from '@/hooks/useDebounce'
import BoxModal from './components/BoxModal'
import type { BoxResponse } from '@/types/box.types'

export default function BoxesPage() {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const [locationFilter, setLocationFilter] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [boxToEdit, setBoxToEdit] = useState<BoxResponse | null>(null)

    const debouncedSearch = useDebounce(searchTerm, 400)
    const debouncedLocation = useDebounce(locationFilter, 400)

    const { data: boxesData, isLoading, isError } = useBoxes(page, 10, debouncedSearch, debouncedLocation)

    const handleCreate = () => {
        setBoxToEdit(null)
        setIsModalOpen(true)
    }

    const handleEdit = (box: BoxResponse, e: React.MouseEvent) => {
        e.stopPropagation()
        setBoxToEdit(box)
        setIsModalOpen(true)
    }

    const boxes = boxesData?.data || []

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Package className="text-accent" size={24} />
                        </div>
                        Cajas
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Gestiona el inventario por cajas y ubicaciones
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    <span>Crear Nueva Caja</span>
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contenedor de Buscador */}
                <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft transition-all">
                    <Search className="text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Contenedor de Filtro */}
                <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft transition-all">
                    <Filter className="text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Filtrar por ubicación..."
                        className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    />
                </div>
            </div>


            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
                    <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                    <p className="font-medium">Cargando cajas...</p>
                </div>
            ) : isError ? (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-8 rounded-2xl text-center">
                    <p className="text-red-600 dark:text-red-400 font-medium">Error al cargar las cajas. Por favor intenta de nuevo.</p>
                </div>
            ) : boxes.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 p-20 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">No se encontraron cajas</h3>
                    <p className="text-slate-400 max-w-xs mx-auto mt-2 text-sm">
                        No hay cajas que coincidan con tu búsqueda. Prueba con otros términos o crea una nueva.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {boxes.map((box) => (
                        <div
                            key={box.id}
                            onClick={() => navigate(`/boxes/${box.id}`)}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-accent/40 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-3 duration-300"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                                    <Package size={20} />
                                </div>
                                <button
                                    onClick={(e) => handleEdit(box, e)}
                                    className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full hover:border-accent hover:text-accent transition-all"
                                >
                                    Editar
                                </button>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-accent transition-colors">
                                {box.name}
                            </h3>

                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                                <MapPin size={12} />
                                {box.location_name}
                            </div>

                            <div className="flex flex-wrap gap-1.5 mt-auto">
                                {box.labels.slice(0, 3).map((label, idx) => (
                                    <span
                                        key={idx}
                                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-semibold"
                                    >
                                        <TagIcon size={10} />
                                        {label}
                                    </span>
                                ))}
                                {box.labels.length > 3 && (
                                    <span className="text-[10px] font-bold text-slate-400 py-1">
                                        +{box.labels.length - 3}
                                    </span>
                                )}
                            </div>

                            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                                <span className="font-mono text-[10px] text-slate-400">
                                    ID: {box.id.substring(0, 8)}...
                                </span>
                                <div className="text-accent flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    Ver Detalle
                                    <ExternalLink size={12} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {boxesData && boxesData.total_pages >= 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-400">
                        Mostrando página <span className="font-bold text-slate-700 dark:text-slate-200">{boxesData.page}</span> de <span className="font-bold text-slate-700 dark:text-slate-200">{boxesData.total_pages}</span>
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
                            onClick={() => setPage(p => Math.min(boxesData.total_pages, p + 1))}
                            disabled={page === boxesData.total_pages}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            <BoxModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                boxToEdit={boxToEdit}
            />
        </div>
    )
}
