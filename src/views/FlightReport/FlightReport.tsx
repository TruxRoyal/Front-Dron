import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const img1 = require("./imagenes/img1.jpg")

export default function FlightreportView() {
  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl p-8 shadow-lg max-w-screen-xl mx-auto">
        <div className="flex justify-center mb-8">
          <h2 className="text-3xl font-bold tracking-wide">
            Detalle de la imagen
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="text-white mb-3">
              <p className="font-semibold text-lg">Mision_Vuelo_034.jpg</p>
              <p className="text-sm opacity-90">
                Capturada el 15/01/2025 • 8.1 MB
              </p>
            </div>
            <Card className="bg-white p-4 w-full shadow-md rounded-xl">
              <CardContent className="p-0 relative flex justify-center">
                <img
                  src={img1}
                  alt="Detalle del cultivo"
                  className="w-[650px] max-w-full h-auto rounded-lg object-cover"
                />
                <Button
                  size="icon"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white shadow-md backdrop-blur"
                >
                  <ChevronLeftIcon className="text-gray-700" />
                </Button>
                <Button
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white shadow-md backdrop-blur"
                >
                  <ChevronRightIcon className="text-gray-700" />
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1">
            <Tabs defaultValue="vuelo" className="w-full">
              <TabsList className="grid grid-cols-3 bg-white rounded-lg shadow mb-4">
                <TabsTrigger value="vuelo">Vuelo</TabsTrigger>
                <TabsTrigger value="cultivo">Cultivo</TabsTrigger>
                <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
              </TabsList>
              <TabsContent value="vuelo">
                <Card className="bg-white shadow-md rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      Información de vuelo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-600 space-y-1 text-sm">
                    <p>
                      <span className="font-medium">ID:</span> 001
                    </p>
                    <p>
                      <span className="font-medium">Sensor:</span> UNOO
                    </p>
                    <p>
                      <span className="font-medium">Resolución:</span> 1080
                    </p>
                    <p>
                      <span className="font-medium">Tamaño:</span> 8.1 MB
                    </p>
                    <p>
                      <span className="font-medium">Calidad:</span> Alta
                    </p>
                    <p>
                      <span className="font-medium">Waypoint:</span> 12
                    </p>
                    <p>
                      <span className="font-medium">Fecha y hora:</span>{" "}
                      15/01/2025 14:30
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="cultivo">
                <Card className="bg-white shadow-md rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      Información del cultivo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-600 space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Tipo:</span> Fresas
                    </p>
                    <p>
                      <span className="font-medium">Estado:</span> En
                      crecimiento
                    </p>
                    <p>
                      <span className="font-medium">Área cubierta:</span> 1.2
                      ha
                    </p>
                    <p>
                      <span className="font-medium">Temperatura:</span> 24°C
                    </p>
                    <p>
                      <span className="font-medium">Humedad:</span> 68%
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ubicacion">
                <Card className="bg-white shadow-md rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      Ubicación
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-600 space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Latitud:</span> 4.60971°
                    </p>
                    <p>
                      <span className="font-medium">Longitud:</span> -74.08175°
                    </p>
                    <p>
                      <span className="font-medium">Altitud:</span> 50 m
                    </p>
                    <p>
                      <span className="font-medium">Velocidad máxima:</span> 18
                      m/s
                    </p>
                    <p>
                      <span className="font-medium">Tiempo de vuelo:</span> 12
                      min
                    </p>
                    <p>
                      <span className="font-medium">Batería:</span> 35%
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
