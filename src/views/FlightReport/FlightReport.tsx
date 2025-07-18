import { Card, CardContent } from "@/components/ui/card"
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const img1 = require("./imagenes/img1.jpg")

export default function FlightreportView() {
  return (
    <div className="w-full min-h-screen bg-emerald-50 p-4">
      <div className="bg-emerald-800 text-white rounded-lg p-6 max-w-screen-xl mx-auto">
        <div className="flex justify-center mb-6">
          <h2 className="text-2xl font-bold">Detalle de la imagen</h2>
        </div>

        <div className="relative flex justify-center">
          <Card className="bg-white p-4 max-w-4xl w-full">
            <CardContent className="p-0">
              <img
                src={img1}
                alt="Detalle del cultivo"
                className="w-full h-auto rounded-lg object-cover"
              />
            </CardContent>
          </Card>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-4"
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-4"
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
