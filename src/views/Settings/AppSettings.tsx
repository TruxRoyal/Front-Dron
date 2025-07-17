import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import "./sistema.css"
import { useNavigate } from "react-router-dom"

export default function AppSettingsView() {
  const [notifications, setNotifications] = useState(true)
  const [sounds, setSounds] = useState(true)
  const navigate = useNavigate()

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
          <h2 className="panel-title text-black">Idioma de la App</h2>
          <div className="param-list">
            <div className="flex justify-center gap-4 mb-8">
              <Button variant="outline">Inglés</Button>
              <Button className="bg-emerald-400 hover:bg-emerald-500">Español</Button>
            </div>

            <h2 className="panel-title text-black mt-6">Tema Visual</h2>
            <div className="flex justify-center gap-4 mb-8">
              <Button className="bg-emerald-400 hover:bg-emerald-500">Claro</Button>
              <Button variant="outline">Oscuro</Button>
            </div>

            <div className="param-item">
              <label className="label text-black">Notificaciones</label>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="param-item">
              <label className="label text-black">Sonidos de sistema</label>
              <Switch checked={sounds} onCheckedChange={setSounds} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}