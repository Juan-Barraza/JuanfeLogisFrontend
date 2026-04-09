import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Scan, Box } from 'lucide-react'

export default function QRScanner() {
    const navigate = useNavigate()
    const scannerRef = useRef<Html5QrcodeScanner | null>(null)
    const [isScanning, setIsScanning] = useState(true)

    useEffect(() => {
        // Only initialize if we are supposed to be scanning.
        if (!isScanning) return

        // Create Scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                // UI Settings
                showTorchButtonIfSupported: true,
            },
            /* verbose= */ false
        )

        scannerRef.current = scanner

        scanner.render(
            (decodedText) => {
                // Success callback
                try {
                    // Stop scanning
                    setIsScanning(false)
                    if (scannerRef.current) {
                        // Pause or clear the scanner.
                        scannerRef.current.clear().catch(console.error)
                    }

                    // Provide feedback
                    toast.success('QR Escaneado Correctamente', {
                        description: 'Redirigiendo a los detalles...'
                    })

                    if (navigator.vibrate) {
                        navigator.vibrate(200) // Vibrate on mobile
                    }

                    // Parse the scanned text (which might be a full URL like http://localhost/boxes/uuid-1234)
                    let targetPath = decodedText

                    try {
                        const url = new URL(decodedText)
                        // If it's a URL, extract just the pathname or relevant segment.
                        // We are looking for something like /boxes/123-abc
                        const match = url.pathname.match(/\/boxes\/[a-zA-Z0-9-]+/)
                        if (match) {
                            targetPath = match[0]
                        } else {
                            targetPath = url.pathname
                        }
                    } catch (e) {
                        // Not a valid URL, maybe it's just 'boxes/123-abc'
                        if (decodedText.includes('boxes/')) {
                            targetPath = '/' + decodedText.substring(decodedText.indexOf('boxes/'))
                        }
                    }

                    // Execute Router Navigation instead of full reload
                    navigate(targetPath)

                } catch (err) {
                    console.error("Navigation error:", err)
                    toast.error('Ocurrió un error al navegar al código.')
                    setIsScanning(true) // Restart scanning on fail
                }
            },
            (error) => {
                // Warning callback, fires constantly when no QR is found.
                console.log(error)
                // We ignore it silently for UX.
            }
        )

        // Cleanup function when component unmounts
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(e => console.error("Failed to clear scanner on unmount.", e))
            }
        }
    }, [isScanning, navigate])

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <div className="flex flex-col items-center text-center space-y-4 mb-8">
                    <div className="w-16 h-16 bg-accent/10 rounded-3xl flex items-center justify-center text-accent">
                        <Scan size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                            Escáner de Bodega
                        </h3>
                        <p className="text-sm font-medium text-slate-500 max-w-sm mt-2">
                            Apunta con la cámara de este dispositivo al código QR impreso en una caja para gestionar su inventario.
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl bg-black shadow-inner border border-slate-200 dark:border-slate-800 relative">
                    {/* The div that html5-qrcode targets */}
                    <div id="reader" className="w-full text-white [&>img]:hidden [&_a]:hidden [&_div]:!text-sm"></div>

                    {!isScanning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10">
                            <Box size={48} className="text-accent mb-4 animate-bounce" />
                            <p className="text-white font-bold tracking-widest uppercase">Procesando Caja...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom styling override for the tricky html5-qrcode injected elements */}
            <style>{`
                #reader__scan_region {
                    background: transparent;
                }
                #reader__dashboard_section_csr button {
                    background-color: var(--accent);
                    color: black;
                    border: none;
                    border-radius: 9999px;
                    padding: 8px 16px;
                    font-weight: 700;
                    font-size: 0.875rem;
                    cursor: pointer;
                    margin-top: 10px;
                }
                #reader__dashboard_section_swaplink {
                    color: var(--accent);
                    text-decoration: underline;
                }
                #reader__camera_selection {
                    padding: 8px 12px;
                    border-radius: 8px;
                    border: 1px solid #334155;
                    background: #1e293b;
                    color: white;
                    margin-bottom: 10px;
                    font-size: 0.875rem;
                }
                #reader { border: none !important; }
            `}</style>
        </div>
    )
}
