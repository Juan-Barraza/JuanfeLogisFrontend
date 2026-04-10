import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Minus, RotateCcw, Filter, Calendar, Search, ArrowRight } from 'lucide-react'
import { useTransactions } from '@/hooks/useTransactions'
import StockMovementModal, { type MovementType } from './components/StockMovementModal'

export default function TransactionsPage() {
    const navigate = useNavigate()

    const [page, setPage] = useState(1)
    const [pageSize] = useState(15)

    // Filters state
    const [filterType, setFilterType] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalAction, setModalAction] = useState<MovementType>('entrada')

    const { data: transactionsData, isLoading } = useTransactions(page, pageSize, {
        type: filterType,
        startDate,
        endDate
    })

    const handleOpenModal = (action: MovementType) => {
        setModalAction(action)
        setIsModalOpen(true)
    }

    const clearFilters = () => {
        setFilterType('')
        setStartDate('')
        setEndDate('')
        setPage(1)
    }

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'entrada': return 'text-accent bg-accent/10'
            case 'salida': return 'text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800'
            case 'devolucion': return 'text-accent bg-transparent border border-accent/30'
            default: return 'text-slate-600 bg-slate-50 dark:bg-slate-500/10'
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Transacciones</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Historial inmutable de movimientos e inventario</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleOpenModal('entrada')}
                        className="flex items-center gap-2 bg-accent hover:opacity-90 text-[#0f172a] px-4 py-2.5 rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={18} /> <span className="hidden md:inline">Entrada</span>
                    </button>
                    <button
                        onClick={() => handleOpenModal('salida')}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white px-4 py-2.5 rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-0.5"
                    >
                        <Minus size={18} /> <span className="hidden md:inline">Salida</span>
                    </button>
                    <button
                        onClick={() => handleOpenModal('devolucion')}
                        className="flex items-center gap-2 bg-white text-accent border border-accent hover:bg-accent/10 dark:bg-transparent px-4 py-2.5 rounded-2xl font-bold transition-all hover:-translate-y-0.5"
                    >
                        <RotateCcw size={18} /> <span className="hidden md:inline">Devolución</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-4 items-end">
                <div className="w-full lg:w-48 space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-none">
                        <Filter size={14} /> Tipo de Movimiento
                    </label>
                    <select
                        value={filterType}
                        onChange={(e) => { setFilterType(e.target.value); setPage(1) }}
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-accent/20 outline-none text-sm font-semibold"
                    >
                        <option value="">Todos los Tipos</option>
                        <option value="entrada">Entradas</option>
                        <option value="salida">Salidas</option>
                        <option value="devolucion">Devoluciones</option>
                    </select>
                </div>

                <div className="flex-1 w-full flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-none">
                            <Calendar size={14} /> Fecha Inicio
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => { setStartDate(e.target.value); setPage(1) }}
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-accent/20 outline-none text-sm font-semibold"
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-none">
                            <Calendar size={14} /> Fecha Fin
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => { setEndDate(e.target.value); setPage(1) }}
                            className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-accent/20 outline-none text-sm font-semibold"
                        />
                    </div>
                </div>

                {(filterType || startDate || endDate) && (
                    <button
                        onClick={clearFilters}
                        className="h-11 px-4 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors underline decoration-slate-300 underline-offset-4"
                    >
                        Limpiar
                    </button>
                )}
            </div>

            {/* List */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                <th className="text-left py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-widest w-[100px]">ID</th>
                                <th className="text-left py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                                <th className="text-left py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                                <th className="text-left py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Usuario</th>
                                <th className="text-center py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Items</th>
                                <th className="text-right py-5 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-3 animate-pulse">
                                            <Search size={32} className="opacity-50" />
                                            <span className="font-bold">Cargando transacciones...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : transactionsData?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Filter size={32} className="opacity-50" />
                                            <span className="font-bold">No se encontraron transacciones.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transactionsData?.data?.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                        <td className="py-4 px-6 text-sm font-bold text-slate-400 uppercase">
                                            {tx.id.split('-')[0]}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getTypeColor(tx.type)}`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            {new Date(tx.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-bold text-slate-900 dark:text-white">
                                            {tx.user_name}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
                                                {tx.item_count}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => navigate(`/transactions/${tx.id}`)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-accent hover:bg-accent/10 transition-colors"
                                            >
                                                <ArrowRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Similar to ProductsPage but adapted) */}
                {transactionsData && transactionsData.total_pages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                        <span className="text-sm font-bold text-slate-400">
                            Página {page} de {transactionsData.total_pages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all shadow-sm"
                            >
                                Anterior
                            </button>
                            <button
                                disabled={page === transactionsData.total_pages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 text-sm font-bold bg-accent text-white rounded-xl shadow-lg shadow-accent/20 hover:bg-accent/90 disabled:opacity-50 transition-all"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <StockMovementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={modalAction}
            />
        </div>
    )
}
