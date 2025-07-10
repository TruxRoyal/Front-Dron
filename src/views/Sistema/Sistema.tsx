import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import "./sistema.css"

export default function SistemaView() {
  const [altitud, setAltitud] = useState(3)
  const [velocidad, setVelocidad] = useState(2)
  const [modoVuelo, setModoVuelo] = useState("Normal")
  const [gps, setGps] = useState("Deportivo")
  const [retorno, setRetorno] = useState(false)
  const [calibracion, setCalibracion] = useState(true)

  return (
    <div className="sistema-container bg-emerald-200">
      <div className="sistema-box">
        <div className="sistema-menu bg-white">
          <h1 className="menu-title text-black">Configuración</h1>
          <div className="menu-options">
            <div>
              <Button className="w-full bg-emerald-400 hover:bg-emerald-500">Dron</Button>
            </div>
            <div className="option text-black">
              <Button className="w-full bg-emerald-400 hover:bg-emerald-500">Aplicativo</Button>
            </div>
            <div className="option text-black">
              <Button className="w-full bg-emerald-400 hover:bg-emerald-500">Avanzadas</Button>
            </div>
          </div>
        </div>

        <div className="sistema-panel bg-white">
          <h2 className="panel-title text-black">Parámetros de Vuelo</h2>
          <div className="param-list">
            <div className="param-item">
              <label className="label text-black">Altitud Máxima</label>
              <div className="input-unit">
                <Input
                  type="number"
                  value={altitud}
                  onChange={(e) => setAltitud(Number(e.target.value))}
                  className="w-20 h-8"
                />
                <span className="unit text-sm text-black">m</span>
              </div>
            </div>

            <div className="param-item">
              <label className="label text-black">Velocidad Máxima</label>
              <div className="input-unit">
                <Input
                  type="number"
                  value={velocidad}
                  onChange={(e) => setVelocidad(Number(e.target.value))}
                  className="w-20 h-8"
                />
                <span className="unit text-sm text-black">m/s</span>
              </div>
            </div>

            <div className="param-item">
              <label className="label text-black">Modo de Vuelo</label>
              <Select value={modoVuelo} onValueChange={setModoVuelo}>
                <SelectTrigger className="w-40 h-8">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Automático">Automático</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="param-item">
              <label className="label text-black">Estabilidad GPS</label>
              <Select value={gps} onValueChange={setGps}>
                <SelectTrigger className="w-40 h-8">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Deportivo">Deportivo</SelectItem>
                  <SelectItem value="Preciso">Preciso</SelectItem>
                  <SelectItem value="Económico">Económico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="param-item">
              <label className="label text-black">Retorno Automático</label>
              <Switch checked={retorno} onCheckedChange={setRetorno} />
            </div>

            <div className="param-item">
              <label className="label text-black">Calibración Automático</label>
              <Switch checked={calibracion} onCheckedChange={setCalibracion} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
