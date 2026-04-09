import { useState } from 'react'
import { Package, DollarSign, BarChart3 } from 'lucide-react'
import StockDashboard from './components/StockDashboard'
import FinancialDashboard from './components/FinancialDashboard'

type Tab = 'stock' | 'financial'

const tabs: { key: Tab; label: string; icon: typeof Package }[] = [
    { key: 'stock', label: 'Stock / Logístico', icon: Package },
    { key: 'financial', label: 'Financiero', icon: DollarSign },
]

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<Tab>('stock')

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <BarChart3 className="text-accent" size={24} />
                        </div>
                        Dashboard
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Análisis general del inventario y finanzas
                    </p>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-fit">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.key
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`
                                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200
                                ${isActive
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }
                            `}
                        >
                            <Icon size={16} className={isActive ? 'text-accent' : ''} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            {activeTab === 'stock' ? <StockDashboard /> : <FinancialDashboard />}
        </div>
    )
}