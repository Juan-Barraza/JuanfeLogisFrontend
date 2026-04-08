import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, X, Tag } from 'lucide-react'
import { useCreateBox, useUpdateBox } from '@/hooks/useBoxes'
import { useLocations, useProductTypes } from '@/hooks/useSettings'
import type { BoxResponse, BoxRequest } from '@/types/box.types'
import { toast } from 'sonner'

interface BoxModalProps {
    isOpen: boolean
    onClose: () => void
    boxToEdit?: BoxResponse | null
}

interface BoxForm {
    name: string
    location_id: number
    label_ids: number[]
}

export default function BoxModal({ isOpen, onClose, boxToEdit }: BoxModalProps) {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<BoxForm>({
        defaultValues: {
            label_ids: []
        }
    })

    const { data: locations } = useLocations()
    const { data: productTypes } = useProductTypes()

    const createMutation = useCreateBox()
    const updateMutation = useUpdateBox()

    const isPending = createMutation.isPending || updateMutation.isPending
    const selectedLabels = watch('label_ids')

    useEffect(() => {
        if (boxToEdit && isOpen) {
            // Mapping labels back to IDs is tricky because BoxResponse has label names, not IDs.
            // However, the backend DTO says BoxRequest needs LabelIDs.
            // If the backend doesn't return LabelIDs in BoxResponse, we might need to match by name
            // or modify the backend. Let's assume we can match by name from productTypes.
            const labelIds = boxToEdit.labels
                .map(name => productTypes?.find(pt => pt.name === name)?.id)
                .filter(id => id !== undefined) as number[]

            reset({
                name: boxToEdit.name,
                location_id: boxToEdit.location_id,
                label_ids: labelIds
            })
        } else if (isOpen) {
            reset({ name: '', location_id: 0, label_ids: [] })
        }
    }, [boxToEdit, reset, isOpen, productTypes])

    if (!isOpen) return null

    const onSubmit = (data: BoxForm) => {
        // Ensure location_id is a number
        const payload: BoxRequest = {
            ...data,
            location_id: Number(data.location_id)
        }

        if (boxToEdit) {
            updateMutation.mutate(
                { id: boxToEdit.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success('Caja actualizada correctamente')
                        onClose()
                    }
                }
            )
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success('Caja creada correctamente')
                    onClose()
                }
            })
        }
    }

    const toggleLabel = (id: number) => {
        const current = [...selectedLabels]
        const index = current.indexOf(id)
        if (index > -1) {
            current.splice(index, 1)
        } else {
            current.push(id)
        }
        setValue('label_ids', current)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {boxToEdit ? 'Editar Caja' : 'Nueva Caja'}
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
                            {(createMutation.error as any)?.response?.data?.error || (updateMutation.error as any)?.response?.data?.error || 'Error al salvar la caja'}
                        </div>
                    )}

                    <form id="box-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Nombre de la Caja
                            </label>
                            <input
                                {...register('name', { required: 'El nombre es obligatorio' })}
                                type="text"
                                placeholder="Ej: Caja de Invierno 01"
                                className="w-full"
                                disabled={isPending}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Ubicación (Bodega)
                            </label>
                            <select
                                {...register('location_id', {
                                    required: 'La ubicación es obligatoria',
                                    min: { value: 1, message: 'Seleccione una ubicación' }
                                })}
                                className="w-full"
                                disabled={isPending}
                            >
                                <option value={0}>Seleccionar bodega...</option>
                                {locations?.map(loc => (
                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                                ))}
                            </select>
                            {errors.location_id && (
                                <p className="text-xs text-red-500">{errors.location_id.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Tag size={14} />
                                Etiquetas (Tipos de Producto)
                            </label>
                            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                {productTypes?.map(pt => {
                                    const isSelected = selectedLabels.includes(pt.id)
                                    return (
                                        <button
                                            key={pt.id}
                                            type="button"
                                            onClick={() => toggleLabel(pt.id)}
                                            className={`
                                                px-3 py-1.5 rounded-full text-xs font-medium transition-all
                                                ${isSelected
                                                    ? 'bg-accent text-slate-900 shadow-sm'
                                                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-accent hover:text-accent'
                                                }
                                            `}
                                        >
                                            {pt.name}
                                        </button>
                                    )
                                })}
                                {(!productTypes || productTypes.length === 0) && (
                                    <p className="text-xs text-slate-400">No hay tipos de producto disponibles.</p>
                                )}
                            </div>
                            <input
                                type="hidden"
                                {...register('label_ids', {
                                    validate: val => val.length > 0 || 'Seleccione al menos una etiqueta'
                                })}
                            />
                            {errors.label_ids && (
                                <p className="text-xs text-red-500">{errors.label_ids.message}</p>
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
                        form="box-form"
                        disabled={isPending}
                        className="btn-primary min-w-[100px] flex justify-center items-center gap-2 text-sm"
                    >
                        {isPending && <Loader2 size={16} className="animate-spin" />}
                        {boxToEdit ? 'Guardar Cambios' : 'Crear Caja'}
                    </button>
                </div>
            </div>
        </div>
    )
}
