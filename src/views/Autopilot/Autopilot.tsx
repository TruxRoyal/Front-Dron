import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"

export default function FlightPathView() {
  return (
    <div className="grid grid-cols-4 gap-4 p-6 bg-emerald-50 min-h-screen">
      <div className="col-span-1 space-y-4">
        <Card className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 text-red-500"
          >
            <TrashIcon />
          </Button>
          <CardHeader>
            <CardTitle>Waypoint 1</CardTitle>
            <CardDescription>Altitud, Acción y Velocidad</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Distancia: 2.4 KM</p>
            <p className="text-sm">Velocidad: 15 m/s</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waypoints</CardTitle>
            <CardDescription>Listado de puntos</CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>

        <Card className="p-4 bg-emerald-100">
          <p><strong>Tiempo estimado:</strong> 12:45 min</p>
          <p><strong>Distancia:</strong> 2.4 KM</p>
          <p><strong>Batería requerida:</strong> 35%</p>
          <Button className="w-full mt-3 bg-red-600 text-white">
            Iniciar misión
          </Button>
        </Card>
      </div>

      <div className="col-span-3">
        <Card className="h-96 flex items-center justify-center">
          <p>Área para el mapa y ruta del dron</p>
        </Card>

        <div className="grid grid-cols-[1fr_auto] gap-4 mt-4 items-start">
          <Card>
            <CardHeader>
              <CardTitle>Editar Waypoint</CardTitle>
              <CardDescription>Configura los parámetros</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                type="text"
                placeholder="Nombre"
                className="w-full mb-3 border rounded p-2"
              />
              <label className="text-sm">Altitud</label>
              <input type="range" className="w-full mb-3" />
              <label className="text-sm">Velocidad</label>
              <input type="range" className="w-full" />
            </CardContent>
          </Card>

          <Card className="w-fit">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Acción</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button className="bg-emerald-300 px-3 py-1 text-sm">Foto</Button>
              <Button className="bg-emerald-300 px-3 py-1 text-sm">Video</Button>
              <Button className="bg-emerald-300 px-3 py-1 text-sm">Panorámica</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
