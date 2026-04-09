import { useState } from 'react'
import { Settings2, Users, Warehouse, Tag, ScanLine } from 'lucide-react'
import DonorsTable from './components/donors/DonorsTable'
import LocationsTable from './components/locations/LocationsTable'
import ProductTypesTable from './components/product_types/ProductTypesTable'
import QRScanner from './components/scanner/QRScanner'

const TABS = [
    { id: 'donors', label: 'Donadores', icon: Users, color: 'text-blue-500' },
    { id: 'locations', label: 'Bodegas', icon: Warehouse, color: 'text-emerald-500' },
    { id: 'product-types', label: 'Tipos de Producto', icon: Tag, color: 'text-violet-500' },
    { id: 'scanner', label: 'Escáner QR', icon: ScanLine, color: 'text-accent' },
]

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState(TABS[0].id)

    return (
        <div className="space-y-3">

            {/* Page Header */}
            <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Settings2 size={18} className="text-accent" />
                </div>
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                        Configuración
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Donadores, bodegas y tipos de producto
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Sidebar — desktop only */}
                <aside className="hidden md:flex flex-col gap-1 w-52 flex-shrink-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-3 mb-1">
                        Catálogos
                    </p>
                    {TABS.map(tab => {
                        const isActive = activeTab === tab.id
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all
                                    ${isActive
                                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                                    }
                                `}
                            >
                                <Icon
                                    size={16}
                                    className={isActive ? tab.color : 'text-slate-400'}
                                />
                                {tab.label}
                            </button>
                        )
                    })}
                </aside>

                {/* Mobile pill nav */}
                <div className="md:hidden flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {TABS.map(tab => {
                        const isActive = activeTab === tab.id
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all
                                    ${isActive
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }
                                `}
                            >
                                <Icon size={13} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Content */}
                <div key={activeTab} className="flex-1 min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {activeTab === 'donors' && <DonorsTable />}
                    {activeTab === 'locations' && <LocationsTable />}
                    {activeTab === 'product-types' && <ProductTypesTable />}
                    {activeTab === 'scanner' && <QRScanner />}
                </div>
            </div>
        </div>
    )
}