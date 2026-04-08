import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, X, Box, User, Tag, Plus, Search } from 'lucide-react'
import { useCreateProduct, useUpdateProduct, useProducts } from '@/hooks/useProducts'
import { useAddBoxStock, useBoxes } from '@/hooks/useBoxes'
import { useDonors, useProductTypes } from '@/hooks/useSettings'
import type { Product, ProductRequest, ProductDisposition } from '@/types/product.types'
import { toast } from 'sonner'
import BoxModal from '@/pages/boxes/components/BoxModal'

interface ProductModalProps {
    isOpen: boolean
    onClose: () => void
    productToEdit?: Product | null
    initialBoxId?: string
    initialMode?: 'new' | 'existing'
    initialSelectedProduct?: Product | null
}

interface ProductForm extends ProductRequest {
    box_id: string
    quantity: number
}

const DISPOSITIONS: ProductDisposition[] = ['Closet Laboral', 'Bazar', 'Tienda Juanfe']

export default function ProductModal({ isOpen, onClose, productToEdit, initialBoxId, initialMode, initialSelectedProduct }: ProductModalProps) {
    const [mode, setMode] = useState<'new' | 'existing'>('new')
    const [isBoxModalOpen, setIsBoxModalOpen] = useState(false)
    const [boxSearch] = useState('')
    const [donorSearch, setDonorSearch] = useState('')
    const [isDonorDropdownOpen, setIsDonorDropdownOpen] = useState(false)

    // Existing Product mode states
    const [productSearch, setProductSearch] = useState('')
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductForm>({
        defaultValues: {
            quantity: 1,
            box_id: initialBoxId || '',
            size: '',
            physical_condition: 'Excelente'
        }
    })

    const { data: boxesData } = useBoxes(1, 50, boxSearch)
    const { data: donorsData } = useDonors(1, 20, donorSearch)
    const { data: productTypes } = useProductTypes()
    const { data: productsSearchData } = useProducts(1, 10, { type: productSearch })

    const createMutation = useCreateProduct()
    const updateMutation = useUpdateProduct()
    const addStockMutation = useAddBoxStock()

    const isPending = createMutation.isPending || updateMutation.isPending || addStockMutation.isPending

    useEffect(() => {
        if (productToEdit && isOpen) {
            setMode('new')
            setDonorSearch(productToEdit.donor_name || '')
            reset({
                product_type_id: productToEdit.product_type_id,
                donor_id: productToEdit.donor_id,
                size: productToEdit.size,
                donation_price: productToEdit.donation_price,
                sale_price: productToEdit.sale_price,
                physical_condition: productToEdit.physical_condition,
                disposition: productToEdit.disposition,
                box_id: initialBoxId || '',
                quantity: 1
            })
        } else if (isOpen) {
            setMode(initialMode || (initialSelectedProduct ? 'existing' : 'new'))
            setProductSearch('')
            setSelectedProduct(initialSelectedProduct || null)
            setDonorSearch('')
            reset({
                quantity: 1,
                box_id: initialBoxId || '',
                size: '',
                physical_condition: 'Excelente',
                disposition: 'Bazar'
            })
        }
    }, [productToEdit, reset, isOpen, initialBoxId, initialMode])

    if (!isOpen) return null

    const handleDonorSelect = (id: string, name: string) => {
        setValue('donor_id', id)
        setDonorSearch(name)
        setIsDonorDropdownOpen(false)
    }

    const onSubmit = async (data: ProductForm) => {
        const { box_id, quantity, ...productData } = data

        // Ensure numeric fields are numbers
        const payload: ProductRequest = {
            ...productData,
            product_type_id: Number(productData.product_type_id),
            donation_price: Number(productData.donation_price),
            sale_price: Number(productData.sale_price)
        }

        try {
            if (productToEdit) {
                await updateMutation.mutateAsync({ id: productToEdit.id, data: payload })
                toast.success('Producto actualizado correctamente')
                onClose()
            } else {
                if (!box_id) {
                    toast.error('Debes seleccionar una caja para el producto')
                    return
                }

                let targetProductId = ''

                if (mode === 'existing') {
                    if (!selectedProduct) {
                        toast.error('Seleccione un producto existente')
                        return
                    }
                    targetProductId = selectedProduct.id
                } else {
                    const newProduct = await createMutation.mutateAsync(payload)
                    targetProductId = newProduct.id
                }

                await addStockMutation.mutateAsync({
                    boxId: box_id,
                    data: {
                        product_id: targetProductId,
                        quantity: Number(quantity)
                    }
                })

                toast.success(mode === 'existing' ? 'Stock agregado correctamente' : 'Producto creado y agregado al stock')
                onClose()
            }
        } catch (error: any) {
            toast.error('Error en la operación', {
                description: error.response?.data?.error || 'Por favor intenta de nuevo'
            })
        }
    }

    return (
        <>
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">

                    {/* Header */}
                    <div className="px-6 py-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent/10 rounded-xl text-accent">
                                <Tag size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {productToEdit ? 'Editar Producto' : 'Registrar Nuevo Producto'}
                                </h3>
                                <p className="text-sm text-slate-500">Completa los detalles del artículo</p>
                            </div>
                        </div>

                        {!productToEdit && (
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setMode('new')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'new' ? 'bg-white dark:bg-slate-700 text-accent shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Nuevo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('existing')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'existing' ? 'bg-white dark:bg-slate-700 text-accent shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Existente
                                </button>
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-8 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/30">
                        <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                            {/* Existing Product Searcher */}
                            {mode === 'existing' && !productToEdit && (
                                <div className="space-y-4">
                                    <div className="space-y-2 relative">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <Search size={14} /> Buscar Producto Existente
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={productSearch}
                                                onChange={(e) => {
                                                    setProductSearch(e.target.value)
                                                    setIsProductDropdownOpen(true)
                                                }}
                                                onFocus={() => setIsProductDropdownOpen(true)}
                                                onBlur={() => setTimeout(() => setIsProductDropdownOpen(false), 200)}
                                                placeholder="Buscar por tipo (ej: Pantalón)..."
                                                className="w-full h-11 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent/20 transition-all font-medium text-sm"
                                                autoComplete="off"
                                            />
                                            {isProductDropdownOpen && productSearch && productsSearchData?.data && (
                                                <div className="absolute z-30 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-56 overflow-y-auto scrollbar-hide">
                                                    {productsSearchData.data.map((prod: Product) => (
                                                        <button
                                                            key={prod.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedProduct(prod)
                                                                setProductSearch('')
                                                                setIsProductDropdownOpen(false)
                                                            }}
                                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 group"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                                                                        {prod.product_type_name}
                                                                    </p>
                                                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                                                        {prod.donor_name} • Talla {prod.size}
                                                                    </p>
                                                                </div>
                                                                <span className="text-[10px] font-mono text-slate-400">{prod.id.substring(0, 8)}</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                    {productsSearchData.data.length === 0 && (
                                                        <div className="px-4 py-6 text-center text-xs text-slate-400 italic">No se encontraron productos</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Selected Product Preview */}
                                    {selectedProduct && (
                                        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                                                    <Tag size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{selectedProduct.product_type_name}</p>
                                                    <p className="text-xs text-slate-500 font-medium">Donante: {selectedProduct.donor_name} | Talla: {selectedProduct.size}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedProduct(null)}
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Classification Section (Only for New or Edit) */}
                            {(mode === 'new' || productToEdit) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <Tag size={14} /> Tipo de Producto
                                        </label>
                                        <select
                                            {...register('product_type_id', { required: mode === 'new' })}
                                            className="w-full h-11 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent/20 transition-all font-medium text-sm"
                                        >
                                            <option value="">Seleccionar tipo...</option>
                                            {productTypes?.map(pt => (
                                                <option key={pt.id} value={pt.id}>{pt.name}</option>
                                            ))}
                                        </select>
                                        {errors.product_type_id && <p className="text-xs text-red-500 mt-1 font-bold">{errors.product_type_id.message}</p>}
                                    </div>

                                    <div className="space-y-2 relative">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <User size={14} /> Donante
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={donorSearch}
                                                onChange={(e) => {
                                                    setDonorSearch(e.target.value)
                                                    setIsDonorDropdownOpen(true)
                                                    if (!e.target.value) setValue('donor_id', '')
                                                }}
                                                onFocus={() => setIsDonorDropdownOpen(true)}
                                                onBlur={() => setTimeout(() => setIsDonorDropdownOpen(false), 200)}
                                                placeholder="Buscar donante por nombre..."
                                                className="w-full h-11 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent/20 transition-all font-medium text-sm"
                                                autoComplete="off"
                                            />
                                            {isDonorDropdownOpen && donorSearch && donorsData?.data && (
                                                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                                                    {donorsData.data.map((donor) => (
                                                        <button
                                                            key={donor.id}
                                                            type="button"
                                                            onClick={() => handleDonorSelect(donor.id, donor.name)}
                                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 group"
                                                        >
                                                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                                                                {donor.name}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">
                                                                {donor.type}
                                                            </p>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <input type="hidden" {...register('donor_id', { required: mode === 'new' })} />
                                        {errors.donor_id && <p className="text-xs text-red-500 mt-1 font-bold">{errors.donor_id.message}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Box & Stock Section (Only for creation) */}
                            {!productToEdit && (
                                <div className="p-5 bg-accent/5 border border-accent/10 rounded-2xl space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-accent flex items-center gap-2 uppercase tracking-wider">
                                            <Box size={14} /> Asignación de Stock
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setIsBoxModalOpen(true)}
                                            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                                        >
                                            <Plus size={12} /> Nueva Caja
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <select
                                                {...register('box_id', { required: !productToEdit })}
                                                className="w-full h-11 px-4 rounded-xl border-accent/20 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-accent/40"
                                            >
                                                <option value="">Seleccionar caja destino...</option>
                                                {boxesData?.data.map(box => (
                                                    <option key={box.id} value={box.id}>{box.name} ({box.location_name})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="relative">
                                                <input
                                                    {...register('quantity', { required: true, min: 1 })}
                                                    type="number"
                                                    placeholder="Cantidad"
                                                    className="w-full h-11 pl-10 pr-4 rounded-xl border-accent/20 bg-white dark:bg-slate-800"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Details & Pricing Selection (Only for New or Edit) */}
                            {(mode === 'new' || productToEdit) && (
                                <>
                                    {/* Details Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Talla / Tamaño</label>
                                            <input
                                                {...register('size')}
                                                type="text"
                                                placeholder="Ej: L, M, 42..."
                                                className="w-full h-11 px-4 rounded-xl border-slate-200 dark:border-slate-700"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Condición Física</label>
                                            <select
                                                {...register('physical_condition')}
                                                className="w-full h-11 px-4 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                            >
                                                <option value="Excelente">Excelente</option>
                                                <option value="Bueno">Bueno</option>
                                                <option value="Regular">Regular</option>
                                                <option value="Mal estado">Mal estado</option>
                                            </select>
                                        </div>
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
                                    </div>

                                    {/* Pricing Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Precio de Donación (COP)</label>
                                            <div className="relative">
                                                <input
                                                    {...register('donation_price', { required: mode === 'new' })}
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full h-11 pl-8 pr-4 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-accent/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Precio de Venta (COP)</label>
                                            <div className="relative">
                                                <input
                                                    {...register('sale_price', { required: mode === 'new' })}
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full h-11 pl-8 pr-4 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-accent/20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                        </form>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4 bg-white dark:bg-slate-900 sticky bottom-0 z-10">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            Cerrar
                        </button>
                        <button
                            type="submit"
                            form="product-form"
                            disabled={isPending}
                            className={`
                                min-w-[160px] h-11 px-8 rounded-xl font-bold text-sm shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2
                                ${isPending ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'btn-primary'}
                            `}
                        >
                            {isPending && <Loader2 size={18} className="animate-spin" />}
                            {productToEdit ? 'Guardar Cambios' : 'Registrar Producto'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Nested Box Modal */}
            <BoxModal
                isOpen={isBoxModalOpen}
                onClose={() => setIsBoxModalOpen(false)}
            />
        </>
    )
}
