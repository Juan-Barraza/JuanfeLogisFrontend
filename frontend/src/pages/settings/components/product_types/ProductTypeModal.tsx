import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, X } from 'lucide-react'
import { useCreateProductType, useUpdateProductType } from '@/hooks/useSettings'
import type { ProductType } from '@/types/settings.types'

interface ProductTypeModalProps {
    isOpen: boolean
    onClose: () => void
    productTypeToEdit?: ProductType | null
}

interface ProductTypeForm {
    name: string
}

export default function ProductTypeModal({ isOpen, onClose, productTypeToEdit }: ProductTypeModalProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductTypeForm>()

    const createMutation = useCreateProductType()
    const updateMutation = useUpdateProductType()

    const isPending = createMutation.isPending || updateMutation.isPending

    useEffect(() => {
        if (productTypeToEdit) {
            reset({ name: productTypeToEdit.name })
        } else {
            reset({ name: '' })
        }
    }, [productTypeToEdit, reset, isOpen])

    if (!isOpen) return null

    const onSubmit = (data: ProductTypeForm) => {
        if (productTypeToEdit) {
            updateMutation.mutate(
                { id: productTypeToEdit.id, data },
                { onSuccess: onClose }
            )
        } else {
            createMutation.mutate(data, { onSuccess: onClose })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {productTypeToEdit ? 'Editar Tipo de Producto' : 'Nuevo Tipo de Producto'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {(createMutation.error || updateMutation.error) && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                            {(createMutation.error as any)?.response?.data?.error || (updateMutation.error as any)?.response?.data?.error || 'Error al guardar el tipo de producto'}
                        </div>
                    )}

                    <form id="product-type-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Nombre del Tipo de Producto
                            </label>
                            <input
                                {...register('name', { required: 'El nombre es obligatorio' })}
                                type="text"
                                placeholder="Ej: Ropa"
                                className="w-full"
                                disabled={isPending}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">{errors.name.message}</p>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="product-type-form"
                        disabled={isPending}
                        className="btn-primary min-w-[100px] flex justify-center items-center gap-2 text-sm"
                    >
                        {isPending && <Loader2 size={16} className="animate-spin" />}
                        {productTypeToEdit ? 'Guardar' : 'Crear'}
                    </button>
                </div>
            </div>
        </div>
    )
}
