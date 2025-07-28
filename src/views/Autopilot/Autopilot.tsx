import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function AutopilotView() {
  return (
    <div className="w-full bg-emerald-100 p-4">
      <h2 className="text-2xl font-bold text-emerald-700 mb-4 text-center">Mapa Ruta</h2>
      <div className="grid grid-cols-12 gap-4 max-w-screen-xl mx-auto">

        {/* Waypoint Card Izquierda */}
        <div className="col-span-3">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Waypoint 1</CardTitle>
              <CardDescription>Altitud, Acción y Velocidad</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-1">Distancia: 2.4 KM</p>
              <p className="text-sm mb-1">Velocidad: 15 m/s</p>
            </CardContent>
          </Card>
        </div>

        {/* Panel central para editar waypoint */}
        <div className="col-span-5">
          <Card className="bg-emerald-50">
            <CardHeader>
              <CardTitle>Editar Waypoint</CardTitle>
              <CardDescription>Configura los parámetros del punto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm gap-1.5">
                <Label htmlFor="waypoint">Nombre</Label>
                <Input type="text" id="waypoint" placeholder="Waypoint 1" />
              </div>

              <div>
                <Label className="mb-1">Altitud</Label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>

              <div>
                <Label className="mb-1">Velocidad</Label>
                <Slider defaultValue={[30]} max={100} step={1} />
              </div>

              <div>
                <Label className="mb-1">Acción</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <Button className="bg-black text-white hover:bg-gray-800">Foto</Button>
                  <Button className="bg-black text-white hover:bg-gray-800">Video</Button>
                  <Button className="bg-black text-white hover:bg-gray-800">Panorámica</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen e iniciar misión */}
        <div className="col-span-4">
          <Card className="bg-emerald-200">
            <CardContent className="flex flex-col justify-between h-full p-4">
              <div className="text-sm text-emerald-900 mb-4">
                <p><strong className="text-emerald-700">Tiempo estimado:</strong> 12:45 min</p>
                <p><strong className="text-emerald-700">Distancia:</strong> 2.4 KM</p>
                <p><strong className="text-emerald-700">Batería requerida:</strong> 35%</p>
              </div>
              <Button className="w-full mt-auto bg-red-600 hover:bg-red-700 text-white font-semibold">
                Iniciar misión
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Aquí podrías colocar el mapa */}
      <div className="mt-8 w-full bg-emerald-50 h-64 rounded-lg border border-emerald-200 flex items-center justify-center text-emerald-600 font-semibold">
        Área para el mapa y ruta del dron
      </div>
    </div>
  );
}
