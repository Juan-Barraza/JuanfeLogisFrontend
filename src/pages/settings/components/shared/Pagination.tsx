interface PaginationProps {
    page: number
    limit: number
    total: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({ page, limit, total, totalPages, onPageChange }: PaginationProps) {
    // Ventana deslizante de 5 páginas centrada en la página actual
    const getPageNumbers = () => {
        const delta = 2 // páginas a cada lado de la actual
        const left = Math.max(1, page - delta)
        const right = Math.min(totalPages, page + delta)

        // Ajustar si estamos cerca del inicio o del final
        const pages: number[] = []
        for (let i = left; i <= right; i++) {
            pages.push(i)
        }

        // Rellenar hasta 5 si hay espacio
        while (pages.length < 5 && pages[0] > 1) {
            pages.unshift(pages[0] - 1)
        }
        while (pages.length < 5 && pages[pages.length - 1] < totalPages) {
            pages.push(pages[pages.length - 1] + 1)
        }

        return pages
    }

    const pageNumbers = getPageNumbers()
    const showLeftEllipsis = pageNumbers[0] > 1
    const showRightEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages

    return (
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs font-medium text-slate-400">
                Mostrando {total === 0 ? 0 : ((page - 1) * limit) + 1}–{Math.min(page * limit, total)} de {total}
            </p>

            <div className="flex items-center gap-1.5">
                {/* Anterior */}
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Primera página + ellipsis */}
                {showLeftEllipsis && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            1
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs">
                            …
                        </span>
                    </>
                )}

                {/* Ventana de páginas */}
                {pageNumbers.map(p => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-colors ${page === p
                            ? 'bg-accent text-slate-900'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                    >
                        {p}
                    </button>
                ))}

                {/* Ellipsis + última página */}
                {showRightEllipsis && (
                    <>
                        <span className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs">
                            …
                        </span>
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Siguiente */}
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages || totalPages === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
