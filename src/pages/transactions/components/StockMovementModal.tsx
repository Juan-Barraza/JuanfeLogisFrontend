import { useEffect, useState, useMemo } from 'react'
import { useForm as useHookForm } from 'react-hook-form'
import { Loader2, X, Box, Tag, Plus, Minus, RotateCcw, Link2 } from 'lucide-react'
import { useAddBoxStock, useRemoveBoxStock, useReturnBoxStock, useBoxes, useBox } from '@/hooks/useBoxes'
import { useProducts } from '@/hooks/useProducts'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'
import { DISPOSITIONS } from '@/pages/products/components/ProductModal';
import type { TransactionRequest } from '@/types/transaction.types'

export type MovementType = 'entrada' | 'salida' | 'devolucion'

interface StockMovementModalProps {
    isOpen: boolean
    onClose: () => void
    type: MovementType
}

interface StockForm extends TransactionRequest {
    box_id: string
}

// Ids seleccionados para cruzar la información entre buscadores
interface SelectedState {
    productId: string
    productLabel: string
    boxId: string
    boxLabel: string
}

export default function StockMovementModal({ isOpen, onClose, type }: StockMovementModalProps) {
    const [selected, setSelected] = useState<SelectedState>({
        productId: '', productLabel: '',
        boxId: '', boxLabel: '',
    })

    // ── Buscadores independientes ──
    const [productSearch, setProductSearch] = useState('')
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)
    const debouncedProductSearch = useDebounce(productSearch, 400)

    const [boxSearch, setBoxSearch] = useState('')
    const [isBoxDropdownOpen, setIsBoxDropdownOpen] = useState(false)
    const debouncedBoxSearch = useDebounce(boxSearch, 400)

    // ── Form ──
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useHookForm<StockForm>({
        defaultValues: { quantity: 1 }
    })

    // ── Queries ──
    // Productos — siempre busca por tipo
    const { data: productsData } = useProducts(1, 30, { type: debouncedProductSearch })
    // Cajas — filtra por nombre Y opcionalmente por producto seleccionado
    const { data: boxesData } = useBoxes(1, 30, debouncedBoxSearch, '', selected.productId)
    // Detalle de caja seleccionada — para filtrar productos de esa caja
    const { data: selectedBoxDetail } = useBox(selected.boxId)
    // Mapeamos el ID del producto seleccionado para saber en qué cajas está
    // (usamos box_stocks que vive dentro del detalle de la caja, sin endpoint extra)

    const addMutation = useAddBoxStock()
    const removeMutation = useRemoveBoxStock()
    const returnMutation = useReturnBoxStock()
    const isPending = addMutation.isPending || removeMutation.isPending || returnMutation.isPending

    // Reset al abrir
    useEffect(() => {
        if (isOpen) {
            setSelected({ productId: '', productLabel: '', boxId: '', boxLabel: '' })
            setProductSearch('')
            setBoxSearch('')
            reset({ quantity: 1, box_id: '', product_id: '' })
        }
    }, [isOpen, reset])

    // ── Handlers ──
    const handleProductSelect = (id: string, label: string) => {
        setSelected(s => ({ ...s, productId: id, productLabel: label }))
        setValue('product_id', id)
        setProductSearch(label)
        setIsProductDropdownOpen(false)
    }

    const handleBoxSelect = (id: string, label: string) => {
        setSelected(s => ({ ...s, boxId: id, boxLabel: label }))
        setValue('box_id', id)
        setBoxSearch(label)
        setIsBoxDropdownOpen(false)
    }

    const handleClearProduct = () => {
        setSelected(s => ({ ...s, productId: '', productLabel: '' }))
        setValue('product_id', '')
        setProductSearch('')
    }

    const handleClearBox = () => {
        setSelected(s => ({ ...s, boxId: '', boxLabel: '' }))
        setValue('box_id', '')
        setBoxSearch('')
    }

    // ── Listas filtradas cruzadas ──

    // Lista de productos:
    // - Si hay una CAJA seleccionada → solo muestra los productos que están en esa caja
    // - Si no hay caja → muestra todos los de la búsqueda normal
    const filteredProducts = useMemo(() => {
        if (selected.boxId && selectedBoxDetail?.products) {
            const boxProductIds = new Set(selectedBoxDetail.products.map(p => p.product_id))
            const base = productsData?.data ?? []
            // Si hay texto de búsqueda, filtra sobre los de la caja
            if (debouncedProductSearch) {
                return base.filter(p =>
                    boxProductIds.has(p.id) &&
                    (p.product_type_name.toLowerCase().includes(debouncedProductSearch.toLowerCase()) ||
                        p.donor_name?.toLowerCase().includes(debouncedProductSearch.toLowerCase()))
                )
            }
            // Sin búsqueda: convierte los productos de la caja a formato compatible
            return selectedBoxDetail.products.map(p => ({
                id: p.product_id,
                product_type_name: p.product_type_name,
                donor_name: p.donor_name,
                size: '',
                description: '',
                physical_condition: p.physical_condition,
            }))
        }
        return productsData?.data ?? []
    }, [selected.boxId, selectedBoxDetail, productsData, debouncedProductSearch])

    // Lista de cajas filtradas — el backend ya filtra por productId si está seleccionado
    const filteredBoxes = useMemo(() => {
        return boxesData?.data ?? []
    }, [boxesData])

    // ── Early return AFTER all hooks (Rules of Hooks) ──
    if (!isOpen) return null
    // ── Submit ──
    const onSubmit = async (data: StockForm) => {
        try {
            const payload = {
                product_id: data.product_id,
                quantity: Number(data.quantity),
                destination: data.disposition,
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
    const bothSelected = selected.productId && selected.boxId

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
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

                {/* Hint cruzado */}
                {(selected.productId || selected.boxId) && !bothSelected && (
                    <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-2.5 bg-accent/5 border border-accent/20 rounded-xl">
                        <Link2 size={14} className="text-accent shrink-0" />
                        <p className="text-xs font-bold text-accent">
                            {selected.boxId
                                ? 'Los productos disponibles se filtraron a los de esa caja'
                                : 'Selecciona primero la caja para filtrar sus productos, o elige producto y luego caja'}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    <div className="space-y-4">

                        {/* ── PRODUCTO ─────────────────────────────── */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Tag size={14} />
                                Producto
                                {selected.boxId && (
                                    <span className="ml-auto text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                                        Filtrando por caja
                                    </span>
                                )}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={productSearch}
                                    onChange={(e) => {
                                        setProductSearch(e.target.value)
                                        setIsProductDropdownOpen(true)
                                        if (!e.target.value) handleClearProduct()
                                    }}
                                    onFocus={() => setIsProductDropdownOpen(true)}
                                    onBlur={() => setTimeout(() => setIsProductDropdownOpen(false), 200)}
                                    placeholder={
                                        selected.boxId
                                            ? 'Buscar entre los productos de esta caja...'
                                            : 'Buscar producto por categoría...'
                                    }
                                    className="w-full h-12 px-4 pr-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                                    autoComplete="off"
                                />
                                {selected.productId && (
                                    <button
                                        type="button"
                                        onClick={handleClearProduct}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                                        title="Limpiar selección"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Dropdown productos */}
                            {isProductDropdownOpen && (productSearch || selected.boxId) && filteredProducts.length > 0 && (
                                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
                                    {filteredProducts.map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => handleProductSelect(
                                                p.id,
                                                `${p.product_type_name} - ${p.donor_name} (${p.size || 'Talla única'})`
                                            )}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                                        >
                                            <p className="font-bold text-slate-900 dark:text-white capitalize">
                                                {p.product_type_name}
                                            </p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                                                Donante: {p.donor_name}
                                                {p.size ? ` • Talla: ${p.size}` : ''}
                                                {p.physical_condition ? ` • ${p.physical_condition}` : ''}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Sin resultados */}
                            {isProductDropdownOpen && productSearch && filteredProducts.length === 0 && (
                                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-4 text-center">
                                    <p className="text-sm text-slate-400 font-medium">
                                        {selected.boxId
                                            ? 'Esta caja no contiene productos que coincidan'
                                            : 'No se encontraron productos'}
                                    </p>
                                </div>
                            )}

                            <input type="hidden" {...register('product_id', { required: 'El producto es requerido' })} />
                            {errors.product_id && (
                                <p className="text-xs text-red-500 mt-1 font-bold">{errors.product_id.message}</p>
                            )}
                        </div>

                        {/* ── CAJA ─────────────────────────────────── */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Box size={14} />
                                Caja Destino / Origen
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={boxSearch}
                                    onChange={(e) => {
                                        setBoxSearch(e.target.value)
                                        setIsBoxDropdownOpen(true)
                                        if (!e.target.value) handleClearBox()
                                    }}
                                    onFocus={() => setIsBoxDropdownOpen(true)}
                                    onBlur={() => setTimeout(() => setIsBoxDropdownOpen(false), 200)}
                                    placeholder={
                                        selected.productId
                                            ? 'Buscar o ver cajas que contienen este producto...'
                                            : 'Buscar caja por nombre...'
                                    }
                                    className="w-full h-12 px-4 pr-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                                    autoComplete="off"
                                />
                                {selected.boxId && (
                                    <button
                                        type="button"
                                        onClick={handleClearBox}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                                        title="Limpiar selección"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Dropdown cajas: muestra si hay texto O si hay producto seleccionado y el campo está en foco */}
                            {isBoxDropdownOpen && (boxSearch || selected.productId) && filteredBoxes.length > 0 && (
                                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
                                    {filteredBoxes.map((b) => (
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

                            {isBoxDropdownOpen && (boxSearch || selected.productId) && filteredBoxes.length === 0 && (
                                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-4 text-center">
                                    <p className="text-sm text-slate-400 font-medium">
                                        {selected.productId
                                            ? 'Ninguna caja contiene ese producto actualmente'
                                            : 'No se encontraron cajas'}
                                    </p>
                                </div>
                            )}

                            <input type="hidden" {...register('box_id', { required: 'La caja es requerida' })} />
                            {errors.box_id && (
                                <p className="text-xs text-red-500 mt-1 font-bold">{errors.box_id.message}</p>
                            )}
                        </div>

                        {type != 'salida' ? "" : (

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Disposición</label>
                                <select
                                    {...register('disposition')}
                                    className="w-full h-11 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                >
                                    {DISPOSITIONS.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        )

                        }

                        {/* ── CANTIDAD ──────────────────────────────── */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Cantidad</label>
                            <input
                                {...register('quantity', {
                                    required: 'La cantidad es requerida',
                                    min: { value: 1, message: 'La cantidad mínima es 1' }
                                })}
                                type="number"
                                min="1"
                                className="w-full h-12 px-4 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 transition-all font-bold text-lg"
                            />
                            {errors.quantity && (
                                <p className="text-xs text-red-500 mt-1 font-bold">{errors.quantity.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-2">
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
