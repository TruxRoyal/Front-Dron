import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Settings } from "lucide-react"
import "./sistema.css"

export default function InitialSettings() {
  const navigate = useNavigate()
  return (
    <div className="sistema-container bg-emerald-200">
      <div className="sistema-box">
        <div className="sistema-menu bg-white">
          <h1 className="menu-title text-black">Configuración</h1>
          <div className="menu-options">
            <Button
              className="w-full bg-emerald-400 hover:bg-emerald-500 hover:scale-105"
              onClick={() => navigate("/sistema")}
            >
              Dron
            </Button>
            <Button
              className="w-full bg-emerald-400 hover:bg-emerald-500 hover:scale-105"
              onClick={() => navigate("/aplicativo")}
            >
              Aplicativo
            </Button>
            <Button
              className="w-full bg-emerald-400 hover:bg-emerald-500 hover:scale-105"
              onClick={() => navigate("/avanzadas")}
            >
              Avanzadas
            </Button>
          </div>
        </div>
        <div className="sistema-panel bg-white flex flex-col items-center justify-center">
          <Settings size={64} className="text-emerald-600 mb-4" />
          <h2 className="text-2xl font-bold text-black">Configuración Inicial</h2>
          <p className="text-gray-500 mt-2">
            Selecciona una opción en el menú para comenzar
          </p>
        </div>
      </div>
    </div>
  )
}
