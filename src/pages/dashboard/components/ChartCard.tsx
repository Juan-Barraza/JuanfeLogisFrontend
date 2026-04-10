import type { ReactNode } from 'react'

interface ChartCardProps {
    title: string
    children: ReactNode
    isLoading?: boolean
    isEmpty?: boolean
    className?: string
    height?: number
}

export default function ChartCard({
    title,
    children,
    isLoading = false,
    isEmpty = false,
    className = '',
    height = 300,
}: ChartCardProps) {
    return (
        <div
            className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 transition-all hover:shadow-lg ${className}`}
        >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                {title}
            </h3>

            {isLoading ? (
                <div
                    className="flex items-center justify-center"
                    style={{ height }}
                >
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                        <div className="w-8 h-8 border-3 border-accent/20 border-t-accent rounded-full animate-spin" />
                        <p className="text-xs font-medium">Cargando datos...</p>
                    </div>
                </div>
            ) : isEmpty ? (
                <div
                    className="flex items-center justify-center"
                    style={{ height }}
                >
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                        <svg
                            className="w-10 h-10 text-slate-200 dark:text-slate-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        <p className="text-xs font-medium">Sin datos disponibles</p>
                    </div>
                </div>
            ) : (
                <div style={{ height }}>{children}</div>
            )}
        </div>
    )
}
