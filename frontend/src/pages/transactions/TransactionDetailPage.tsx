import { ArrowLeft, User, Calendar, Tag, Package, Banknote } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTransaction } from '@/hooks/useTransactions'

export default function TransactionDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: transaction, isLoading } = useTransaction(id!)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-24">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    <p className="text-slate-400 font-bold">Cargando transacción...</p>
                </div>
            </div>
        )
    }

    if (!transaction) {
        return (
            <div className="text-center p-24">
                <p className="text-slate-500">Transacción no encontrada.</p>
            </div>
        )
    }

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'entrada': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
            case 'salida': return 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20'
            case 'devolucion': return 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'
            default: return 'text-slate-600 bg-slate-50 dark:bg-slate-500/10 border-slate-200'
        }
    }

    const FormatPrice = ({ amount }: { amount: number }) => (
        <span>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount)}</span>
    )

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/transactions')}
                    className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-105 shadow-sm"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        Detalle de Movimiento
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getTypeColor(transaction.type)}`}>
                            {transaction.type}
                        </span>
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                        <Tag size={12} /> ID: {transaction.id}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Summary Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6 block">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Información General</h3>
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha de Ejecución</p>
                                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                                    {new Date(transaction.created_at).toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                <User size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operador</p>
                                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{transaction.user_name}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950 rounded-[2rem] p-8 shadow-xl text-white flex flex-col justify-center">
                    <div className="flex items-center gap-3 opacity-50 mb-2">
                        <Package size={20} />
                        <h3 className="text-sm font-black uppercase tracking-widest">Total Ítems Afectados</h3>
                    </div>
                    <div className="text-5xl font-black text-accent">{transaction.items.length}</div>
                    <p className="mt-4 text-sm font-medium text-slate-300">
                        Esta transacción representa un movimiento de {transaction.items.length} tipo(s) de producto(s) en las bodegas.
                    </p>
                </div>
            </div>

            {/* Items Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center gap-2">
                    <Package className="text-slate-400" size={18} />
                    <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Desglose de Inventario</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Producto</th>
                                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Caja Involucrada</th>
                                <th className="text-center py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidades</th>
                                <th className="text-right py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Aplicable</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {transaction.items.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-sm text-slate-900 dark:text-white capitalize">
                                            {item.product_name}
                                        </div>
                                        <div className="text-xs text-slate-400 font-medium mt-0.5">
                                            ID: {item.product_id.split('-')[0]}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-sm text-slate-700 dark:text-slate-300 capitalize">
                                            {item.box_name}
                                        </div>
                                        <div className="text-xs text-slate-400 font-medium mt-0.5">
                                            Caja ID: {item.box_id.split('-')[0]}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-black text-slate-700 dark:text-slate-300">
                                            {item.quantity}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="font-black text-sm text-accent flex items-center justify-end gap-1.5">
                                            <Banknote size={14} className="opacity-50" />
                                            <FormatPrice amount={item.applied_price} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
