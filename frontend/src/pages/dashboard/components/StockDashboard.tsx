import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'
import { Package, Box, Users } from 'lucide-react'
import {
    useLogisticsKPIs,
    useLogisticsDistribution,
    useLocationDistribution,
    useTopDonorsLogistics,
} from '@/hooks/useDashboard'
import KPICard from './KPICard'
import ChartCard from './ChartCard'

const CHART_COLORS = [
    '#78d700',
    '#38bdf8',
    '#f472b6',
    '#fbbf24',
    '#a78bfa',
    '#34d399',
    '#fb923c',
    '#64748b',
    '#e879f9',
    '#2dd4bf',
]

const LABEL_MAP: Record<string, string> = {
    nuevo: 'Nuevo',
    usado: 'Usado',
    venta: 'Venta',
    donacion: 'Donación',
    reciclaje: 'Reciclaje',
    S: 'S',
    M: 'M',
    L: 'L',
    XL: 'XL',
    XXL: 'XXL',
    XS: 'XS',
}

function translateLabel(label: string) {
    return LABEL_MAP[label] ?? label
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-xl text-sm">
            <p className="font-bold text-slate-900 dark:text-white mb-1">
                {translateLabel(label || payload[0]?.name)}
            </p>
            {payload.map((entry: any, i: number) => (
                <p key={i} className="text-slate-500" style={{ color: entry.color }}>
                    {entry.value?.toLocaleString('es-CO')} unidades
                </p>
            ))}
        </div>
    )
}

const PieTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const item = payload[0]
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-xl text-sm">
            <p className="font-bold text-slate-900 dark:text-white">
                {translateLabel(item.name)}
            </p>
            <p className="text-slate-500">
                <span style={{ color: item.payload?.fill }} className="font-bold">
                    {item.value?.toLocaleString('es-CO')}
                </span>{' '}
                unidades
            </p>
        </div>
    )
}

const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: any) => {
    if (percent < 0.05) return null
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
        <text
            x={x}
            y={y}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fontWeight={700}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

export default function StockDashboard() {
    const { data: kpis, isLoading: kpisLoading } = useLogisticsKPIs()
    const { data: distribution, isLoading: distLoading } = useLogisticsDistribution()
    const { data: locations, isLoading: locLoading } = useLocationDistribution()
    const { data: topDonors, isLoading: donorsLoading } = useTopDonorsLogistics()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <KPICard
                    icon={<Package size={22} />}
                    label="Total Ítems Físicos"
                    value={kpis?.totalPhysicalItems ?? 0}
                    isLoading={kpisLoading}
                    accentColor="#78d700"
                />
                <KPICard
                    icon={<Box size={22} />}
                    label="Cajas Activas"
                    value={kpis?.totalActiveBoxes ?? 0}
                    isLoading={kpisLoading}
                    accentColor="#38bdf8"
                />
                <KPICard
                    icon={<Users size={22} />}
                    label="Donantes Únicos"
                    value={kpis?.totalUniqueDonors ?? 0}
                    isLoading={kpisLoading}
                    accentColor="#a78bfa"
                />
            </div>

            {/* Distribution Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* By Size - Donut */}
                <ChartCard
                    title="Distribución por Talla"
                    isLoading={distLoading}
                    isEmpty={!distribution?.bySize?.length}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={distribution?.bySize?.map((d) => ({
                                    ...d,
                                    name: translateLabel(d.label),
                                }))}
                                cx="50%"
                                cy="50%"
                                innerRadius="45%"
                                outerRadius="80%"
                                paddingAngle={3}
                                dataKey="value"
                                nameKey="name"
                                labelLine={false}
                                label={renderCustomLabel}
                                animationBegin={0}
                                animationDuration={800}
                            >
                                {distribution?.bySize?.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                                        stroke="none"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<PieTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                iconType="circle"
                                iconSize={8}
                                formatter={(val: string) => (
                                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                                        {val}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* By Condition - Donut */}
                <ChartCard
                    title="Distribución por Condición"
                    isLoading={distLoading}
                    isEmpty={!distribution?.byCondition?.length}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={distribution?.byCondition?.map((d) => ({
                                    ...d,
                                    name: translateLabel(d.label),
                                }))}
                                cx="50%"
                                cy="50%"
                                innerRadius="45%"
                                outerRadius="80%"
                                paddingAngle={3}
                                dataKey="value"
                                nameKey="name"
                                labelLine={false}
                                label={renderCustomLabel}
                                animationBegin={100}
                                animationDuration={800}
                            >
                                {distribution?.byCondition?.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={CHART_COLORS[(i + 2) % CHART_COLORS.length]}
                                        stroke="none"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<PieTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                iconType="circle"
                                iconSize={8}
                                formatter={(val: string) => (
                                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                                        {val}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Distribution Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* By Disposition - Bar */}
                <ChartCard
                    title="Distribución por Disposición"
                    isLoading={distLoading}
                    isEmpty={!distribution?.byDisposition?.length}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={distribution?.byDisposition?.map((d) => ({
                                ...d,
                                label: translateLabel(d.label),
                            }))}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                                stroke="#e2e8f020"
                            />
                            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis
                                type="category"
                                dataKey="label"
                                tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                                width={80}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="value"
                                fill="#78d700"
                                radius={[0, 8, 8, 0]}
                                barSize={28}
                                animationBegin={200}
                                animationDuration={800}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* By Type - Bar */}
                <ChartCard
                    title="Distribución por Tipo de Producto"
                    isLoading={distLoading}
                    isEmpty={!distribution?.byType?.length}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={distribution?.byType}
                            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e2e8f020"
                            />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40} animationDuration={800}>
                                {distribution?.byType?.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Location & Top Donors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Location Distribution */}
                <ChartCard
                    title="Cajas por Ubicación / Sede"
                    isLoading={locLoading}
                    isEmpty={!locations?.length}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={locations}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                                stroke="#e2e8f020"
                            />
                            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis
                                type="category"
                                dataKey="label"
                                tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                                width={100}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="value"
                                fill="#38bdf8"
                                radius={[0, 8, 8, 0]}
                                barSize={28}
                                animationDuration={800}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Top 10 Donors */}
                <ChartCard
                    title="Top 10 Donantes (por cantidad)"
                    isLoading={donorsLoading}
                    isEmpty={!topDonors?.length}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topDonors}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                                stroke="#e2e8f020"
                            />
                            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis
                                type="category"
                                dataKey="label"
                                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                                width={100}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="value"
                                radius={[0, 8, 8, 0]}
                                barSize={24}
                                animationDuration={800}
                            >
                                {topDonors?.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    )
}
