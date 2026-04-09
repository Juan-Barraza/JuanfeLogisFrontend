import { useState, useMemo } from 'react'
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'
import { DollarSign, TrendingUp, Warehouse, ArrowUpRight, ArrowDownRight, Calendar, X } from 'lucide-react'
import {
    useFinancialKPIs,
    useFinancialTrends,
    useTopDonorsFinancial,
    useProfitability,
} from '@/hooks/useDashboard'
import KPICard from './KPICard'
import ChartCard from './ChartCard'

const CHART_COLORS = [
    '#78d700', '#38bdf8', '#f472b6', '#fbbf24',
    '#a78bfa', '#34d399', '#fb923c', '#64748b',
    '#e879f9', '#2dd4bf',
]

const MONTHS = [
    { value: '01', label: 'Ene' }, { value: '02', label: 'Feb' },
    { value: '03', label: 'Mar' }, { value: '04', label: 'Abr' },
    { value: '05', label: 'May' }, { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' }, { value: '08', label: 'Ago' },
    { value: '09', label: 'Sep' }, { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' }, { value: '12', label: 'Dic' },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i)

function formatCOP(value: number) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

function formatMonth(period: string) {
    const [year, month] = period.split('-')
    const m = MONTHS.find(m => m.value === month)
    return `${m?.label ?? month} ${year.slice(2)}`
}

const FinancialTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-xl text-sm">
            <p className="font-bold text-slate-900 dark:text-white mb-2">{formatMonth(label)}</p>
            {payload.map((entry: any, i: number) => (
                <p key={i} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: entry.color }} />
                    <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
                    <span className="font-bold" style={{ color: entry.color }}>{formatCOP(entry.value)}</span>
                </p>
            ))}
        </div>
    )
}

const DonorTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-xl text-sm">
            <p className="font-bold text-slate-900 dark:text-white">{payload[0]?.payload?.label}</p>
            <p className="text-emerald-500 font-bold">{formatCOP(payload[0]?.value)}</p>
        </div>
    )
}

export default function FinancialDashboard() {
    const [selectedYear, setSelectedYear] = useState<string>('')
    const [selectedMonth, setSelectedMonth] = useState<string>('')

    // Compute startDate / endDate from the filters
    const filters = useMemo(() => {
        if (!selectedYear) return undefined

        if (selectedMonth) {
            // Specific month: from day 1 to last day of month
            const lastDay = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate()
            return {
                startDate: `${selectedYear}-${selectedMonth}-01`,
                endDate: `${selectedYear}-${selectedMonth}-${String(lastDay).padStart(2, '0')}`,
            }
        }
        // Full year
        return {
            startDate: `${selectedYear}-01-01`,
            endDate: `${selectedYear}-12-31`,
        }
    }, [selectedYear, selectedMonth])

    const { data: kpis, isLoading: kpisLoading } = useFinancialKPIs(filters)
    const { data: trends, isLoading: trendsLoading } = useFinancialTrends(filters)
    const { data: topDonors, isLoading: donorsLoading } = useTopDonorsFinancial(filters)
    const { data: profit, isLoading: profitLoading } = useProfitability(filters)

    const handleClearFilters = () => {
        setSelectedYear('')
        setSelectedMonth('')
    }

    const hasFilter = !!selectedYear

    // Build filter label for display
    const filterLabel = useMemo(() => {
        if (!selectedYear) return null
        if (selectedMonth) {
            const m = MONTHS.find(m => m.value === selectedMonth)
            return `${m?.label} ${selectedYear}`
        }
        return `Año ${selectedYear}`
    }, [selectedYear, selectedMonth])

    // Merge trends
    const mergedTrends = useMemo(() => {
        const map = new Map<string, { period: string; ventas: number; donaciones: number }>()
        trends?.salesTrends?.forEach((t) => {
            if (!map.has(t.period)) map.set(t.period, { period: t.period, ventas: 0, donaciones: 0 })
            map.get(t.period)!.ventas = t.value
        })
        trends?.donationTrends?.forEach((t) => {
            if (!map.has(t.period)) map.set(t.period, { period: t.period, ventas: 0, donaciones: 0 })
            map.get(t.period)!.donaciones = t.value
        })
        return Array.from(map.values()).sort((a, b) => a.period.localeCompare(b.period))
    }, [trends])

    const netProfit = profit?.netProfit ?? 0
    const isPositive = netProfit >= 0

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* ── DATE FILTER BAR ────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-slate-500 shrink-0">
                    <Calendar size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Período</span>
                </div>

                {/* Year selector */}
                <select
                    value={selectedYear}
                    onChange={(e) => {
                        setSelectedYear(e.target.value)
                        setSelectedMonth('') // reset month when year changes
                    }}
                    className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-accent/30 focus:border-accent cursor-pointer"
                >
                    <option value="">Todos los años</option>
                    {YEARS.map((y) => (
                        <option key={y} value={String(y)}>{y}</option>
                    ))}
                </select>

                {/* Month selector — only enabled when a year is selected */}
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    disabled={!selectedYear}
                    className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-accent/30 focus:border-accent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <option value="">Todos los meses</option>
                    {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>

                {/* Active filter badge + clear */}
                {hasFilter && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/30 rounded-lg">
                        <span className="text-xs font-bold text-accent">{filterLabel}</span>
                        <button
                            onClick={handleClearFilters}
                            className="text-accent/70 hover:text-accent transition-colors"
                            title="Limpiar filtro"
                        >
                            <X size={13} />
                        </button>
                    </div>
                )}
            </div>

            {/* ── KPI CARDS ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KPICard
                    icon={<DollarSign size={22} />}
                    label="Total Vendido"
                    value={kpis?.totalSold ?? 0}
                    format="currency"
                    isLoading={kpisLoading}
                    accentColor="#78d700"
                />
                <KPICard
                    icon={<TrendingUp size={22} />}
                    label="Total Donaciones"
                    value={kpis?.totalDonatedValue ?? 0}
                    format="currency"
                    isLoading={kpisLoading}
                    accentColor="#38bdf8"
                />
                <KPICard
                    icon={<Warehouse size={22} />}
                    label="Valor del Inventario"
                    value={kpis?.inventoryValue ?? 0}
                    format="currency"
                    isLoading={kpisLoading}
                    accentColor="#a78bfa"
                />
            </div>

            {/* ── PROFITABILITY CARDS ───────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Ingresos (Ventas)</p>
                    {profitLoading
                        ? <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                        : <p className="text-2xl font-black text-emerald-500">{formatCOP(profit?.totalRevenue ?? 0)}</p>
                    }
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Costo Base (Donación)</p>
                    {profitLoading
                        ? <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                        : <p className="text-2xl font-black text-orange-500">{formatCOP(profit?.totalCost ?? 0)}</p>
                    }
                </div>

                <div className={`rounded-2xl border p-5 md:p-6 relative overflow-hidden ${isPositive
                    ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30'
                    : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
                }`}>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ganancia Neta</p>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPositive
                            ? 'bg-emerald-100 dark:bg-emerald-800/30'
                            : 'bg-red-100 dark:bg-red-800/30'
                        }`}>
                            {isPositive
                                ? <ArrowUpRight size={18} className="text-emerald-600" />
                                : <ArrowDownRight size={18} className="text-red-600" />
                            }
                        </div>
                    </div>
                    {profitLoading
                        ? <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                        : <p className={`text-2xl font-black ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatCOP(netProfit)}
                          </p>
                    }
                </div>
            </div>

            {/* ── TRENDS CHART ─────────────────────────────────────── */}
            <ChartCard
                title="Tendencia de Ventas vs Donaciones"
                isLoading={trendsLoading}
                isEmpty={mergedTrends.length === 0}
                height={350}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mergedTrends} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#78d700" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#78d700" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradDonaciones" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f020" />
                        <XAxis
                            dataKey="period"
                            tickFormatter={formatMonth}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<FinancialTooltip />} />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            iconSize={8}
                            formatter={(val: string) => (
                                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 capitalize">{val}</span>
                            )}
                        />
                        <Area type="monotone" dataKey="ventas" name="Ventas" stroke="#78d700" strokeWidth={2.5}
                            fill="url(#gradVentas)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} animationDuration={1000} />
                        <Area type="monotone" dataKey="donaciones" name="Donaciones" stroke="#38bdf8" strokeWidth={2.5}
                            fill="url(#gradDonaciones)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} animationDuration={1000} />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── TOP DONORS ───────────────────────────────────────── */}
            <ChartCard
                title="Top 10 Donantes (por valor $)"
                isLoading={donorsLoading}
                isEmpty={!topDonors?.length}
                height={350}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topDonors} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f020" />
                        <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} width={100} />
                        <Tooltip content={<DonorTooltip />} />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24} animationDuration={800}>
                            {topDonors?.map((_, i) => (
                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    )
}
