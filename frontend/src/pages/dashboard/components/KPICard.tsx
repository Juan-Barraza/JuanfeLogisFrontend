import type { ReactNode } from 'react'

interface KPICardProps {
    icon: ReactNode
    label: string
    value: number | string
    format?: 'number' | 'currency'
    accentColor?: string
    isLoading?: boolean
}

export default function KPICard({
    icon,
    label,
    value,
    format = 'number',
    accentColor,
    isLoading = false,
}: KPICardProps) {
    const formattedValue =
        format === 'currency'
            ? new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
              }).format(typeof value === 'string' ? parseFloat(value) : value)
            : typeof value === 'number'
              ? value.toLocaleString('es-CO')
              : value

    const bgColor = accentColor ?? 'var(--accent)'

    return (
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 group">
            {/* Decorative gradient bar at top */}
            <div
                className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, ${bgColor}, transparent)` }}
            />

            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        {label}
                    </p>

                    {isLoading ? (
                        <div className="h-9 w-28 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                    ) : (
                        <p
                            className="text-2xl md:text-3xl font-black tracking-tight truncate"
                            style={{ color: bgColor }}
                        >
                            {formattedValue}
                        </p>
                    )}
                </div>

                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: `${bgColor}15` }}
                >
                    <div style={{ color: bgColor }}>{icon}</div>
                </div>
            </div>
        </div>
    )
}
