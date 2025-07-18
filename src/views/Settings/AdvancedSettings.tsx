import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import "./sistema.css"
import { useNavigate } from "react-router-dom"

export default function AdvancedSettingsView() {
    const navigate = useNavigate()
  const [modoSeguro, setModoSeguro] = useState(true)
  const [rendimiento, setRendimiento] = useState(true)
  const [reinicio, setReinicio] = useState(true)

  return (
    <div className="sistema-container bg-emerald-200">
      <div className="sistema-box">
        <div className="sistema-menu bg-white">
          <h1 className="menu-title text-black">Configuración</h1>
          <div className="menu-options">
            <Button className="w-full bg-emerald-400 hover:bg-emerald-500 hover:scale-105" onClick={() => navigate("/sistema")} >Dron</Button>
            <Button className="w-full bg-emerald-400 hover:bg-emerald-500 hover:scale-105" onClick={() => navigate("/aplicativo")}>Aplicativo</Button>
            <Button className="w-full bg-emerald-400 hover:bg-emerald-500 hover:scale-105" onClick={() => navigate("/avanzadas")}>Avanzadas</Button>
          </div>
        </div>

        <div className="sistema-panel bg-white">
          <h2 className="panel-title text-black">Configuraciones Avanzadas</h2>
          <div className="param-list">
            <div className="param-item">
              <label className="label text-black">Modo Seguro</label>
              <Switch checked={modoSeguro} onCheckedChange={setModoSeguro} />
            </div>

            <div className="param-item">
              <label className="label text-black">Monitor de Rendimiento</label>
              <Switch checked={rendimiento} onCheckedChange={setRendimiento} />
            </div>

            <div className="param-item">
              <label className="label text-black">Reiniciar Ajustes</label>
              <Switch checked={reinicio} onCheckedChange={setReinicio} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}