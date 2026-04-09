import { useEffect, useState } from 'react'
import { useForm as useHookForm } from 'react-hook-form'
import { Loader2, X, Box, Tag, Plus, Minus, RotateCcw } from 'lucide-react'
import { useAddBoxStock, useRemoveBoxStock, useReturnBoxStock, useBoxes } from '@/hooks/useBoxes'
import { useProducts } from '@/hooks/useProducts'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'

export type MovementType = 'entrada' | 'salida' | 'devolucion'

interface StockMovementModalProps {
    isOpen: boolean
    onClose: () => void
    type: MovementType
}

interface StockForm {
    box_id: string
    product_id: string
    quantity: number
}

export default function StockMovementModal({ isOpen, onClose, type }: StockMovementModalProps) {
    const [productSearch, setProductSearch] = useState('')
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)
    const debouncedProductSearch = useDebounce(productSearch, 500)

    const [boxSearch, setBoxSearch] = useState('')
    const [isBoxDropdownOpen, setIsBoxDropdownOpen] = useState(false)
    const debouncedBoxSearch = useDebounce(boxSearch, 500)

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useHookForm<StockForm>({
        defaultValues: {
            quantity: 1
        }
    })

    const { data: productsData } = useProducts(1, 20, { type: debouncedProductSearch })
    const { data: boxesData } = useBoxes(1, 20, debouncedBoxSearch)

    const addMutation = useAddBoxStock()
    const removeMutation = useRemoveBoxStock()
    const returnMutation = useReturnBoxStock()

    const isPending = addMutation.isPending || removeMutation.isPending || returnMutation.isPending

    useEffect(() => {
        if (isOpen) {
            setProductSearch('')
            setBoxSearch('')
            reset({
                quantity: 1,
                box_id: '',
                product_id: ''
            })
        }
    }, [isOpen, reset])

    if (!isOpen) return null

    const handleProductSelect = (id: string, name: string) => {
        setValue('product_id', id)
        setProductSearch(name)
        setIsProductDropdownOpen(false)
    }

    const handleBoxSelect = (id: string, name: string) => {
        setValue('box_id', id)
        setBoxSearch(name)
        setIsBoxDropdownOpen(false)
    }

    const onSubmit = async (data: StockForm) => {
        try {
            const payload = {
                product_id: data.product_id,
                quantity: Number(data.quantity)
            }

            if (type === 'entrada') {
                await addMutation.mutateAsync({ boxId: data.box_id, data: payload })
                toast.success('Entrada de stock registrada exitosamente')
            } else if (type === 'salida') {
                await removeMutation.mutateAsync({ boxId: data.box_id, data: payload })
                toast.success('Salida de stock registrada exitosamente')
            } else if (type === 'devolucion') {
                await returnMutation.mutateAsync({ boxId: data.box_id, data: payload })
                toast.success('Devolución de stock registrada exitosamente')
            }
            onClose()
        } catch (error: any) {
            toast.error(`Error al registrar la ${type}`, {
                description: error.response?.data?.error || 'Por favor intenta de nuevo'
            })
        }
    }

    const config = {
        entrada: {
            title: 'Registrar Entrada',
            color: 'text-accent',
            bg: 'bg-accent/10',
            icon: Plus,
            submitText: 'Agregar Stock',
            submitColor: 'bg-accent text-[#0f172a] hover:opacity-90'
        },
        salida: {
            title: 'Registrar Salida',
            color: 'text-slate-700 dark:text-slate-300',
            bg: 'bg-slate-100 dark:bg-slate-800',
            icon: Minus,
            submitText: 'Remover Stock',
            submitColor: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90'
        },
        devolucion: {
            title: 'Registrar Devolución',
            color: 'text-accent',
            bg: 'bg-transparent border border-accent/30',
            icon: RotateCcw,
            submitText: 'Devolver Stock',
            submitColor: 'bg-white text-accent border border-accent dark:bg-transparent hover:bg-accent/10'
        }
    }[type]

    const Icon = config.icon

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl ${config.bg} ${config.color}`}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">{config.title}</h2>
                            <p className="text-sm font-semibold text-slate-500">Módulo de Transacciones</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    <div className="space-y-4">
                        {/* Product Search */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Tag size={14} /> Producto
                            </label>
                            <input
                                type="text"
                                value={productSearch}
                                onChange={(e) => {
                                    setProductSearch(e.target.value)
                                    setIsProductDropdownOpen(true)
                                    if (!e.target.value) setValue('product_id', '')
                                }}
                                onFocus={() => setIsProductDropdownOpen(true)}
                                onBlur={() => setTimeout(() => setIsProductDropdownOpen(false), 200)}
                                placeholder="Buscar producto por categoría..."
                                className="w-full h-12 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                                autoComplete="off"
                            />
                            {isProductDropdownOpen && productSearch && productsData?.data && (
                                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
                                    {productsData.data.map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => handleProductSelect(p.id, `${p.product_type_name} - ${p.donor_name} (Talla: ${p.size || 'Unica'})`)}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                                        >
                                            <p className="font-bold text-slate-900 dark:text-white capitalize">
                                                {p.product_type_name}
                                            </p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                                                Donante: {p.donor_name} • Talla: {p.size || 'Unica'} • Descripción: {p.description}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                            <input type="hidden" {...register('product_id', { required: 'El producto es requerido' })} />
                            {errors.product_id && <p className="text-xs text-red-500 mt-1 font-bold">{errors.product_id.message}</p>}
                        </div>

                        {/* Box Search */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Box size={14} /> Caja Destino/Origen
                            </label>
                            <input
                                type="text"
                                value={boxSearch}
                                onChange={(e) => {
                                    setBoxSearch(e.target.value)
                                    setIsBoxDropdownOpen(true)
                                    if (!e.target.value) setValue('box_id', '')
                                }}
                                onFocus={() => setIsBoxDropdownOpen(true)}
                                onBlur={() => setTimeout(() => setIsBoxDropdownOpen(false), 200)}
                                placeholder="Buscar caja por nombre..."
                                className="w-full h-12 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                                autoComplete="off"
                            />
                            {isBoxDropdownOpen && boxSearch && boxesData?.data && (
                                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
                                    {boxesData.data.map((b) => (
                                        <button
                                            key={b.id}
                                            type="button"
                                            onClick={() => handleBoxSelect(b.id, `${b.name} (${b.location_name})`)}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                                        >
                                            <p className="font-bold text-slate-900 dark:text-white capitalize">
                                                {b.name}
                                            </p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                                                Ubicación: {b.location_name}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                            <input type="hidden" {...register('box_id', { required: 'La caja es requerida' })} />
                            {errors.box_id && <p className="text-xs text-red-500 mt-1 font-bold">{errors.box_id.message}</p>}
                        </div>

                        {/* Quantity */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Cantidad</label>
                            <input
                                {...register('quantity', { required: 'La cantidad es requerida', min: { value: 1, message: 'La cantidad mínima es 1' } })}
                                type="number"
                                min="1"
                                className="w-full h-12 px-4 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 transition-all font-bold text-lg"
                            />
                            {errors.quantity && <p className="text-xs text-red-500 mt-1 font-bold">{errors.quantity.message}</p>}
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isPending}
                            className={`w-full px-6 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/5 hover:-translate-y-0.5 ${config.submitColor} disabled:opacity-50 disabled:hover:translate-y-0`}
                        >
                            {isPending ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <Icon size={20} />
                                    <span>{config.submitText}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
