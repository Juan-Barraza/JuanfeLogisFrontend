import { AlertTriangle, X } from 'lucide-react'

interface DeleteConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    isPending?: boolean
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Eliminar permanentemente',
    isPending = false
}: DeleteConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center space-y-4 pt-4">
                    {/* Warning Icon Container */}
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 shadow-inner">
                        <AlertTriangle size={40} strokeWidth={1.5} />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full pt-4">
                        <button
                            onClick={onClose}
                            disabled={isPending}
                            className="px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isPending}
                            className="px-4 py-3 text-sm font-semibold text-white bg-red-600 rounded-2xl hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
            </div>
        </div>
    )
}
