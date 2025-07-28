import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { BatteryFull, Wifi, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Link } from "react-router-dom"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import "./Dashboard.css"

export default function Dashboard() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <div className="w-full flex p-4">
      <div className="w-2/3 pr-4">
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-md"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Card>
                    <CardContent className="aspect-square flex items-center justify-center p-6">
                      <span className="text-3xl font-semibold">{index + 1}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="button">
          <Button asChild className="Button">
            <Link to="/flightmissions">Ver más</Link>
          </Button>
        </div>
      </div>
      <div className="w-1/3 flex flex-col text-white">
        <h1 className="text-3xl font-bold text-emerald-600 mb-4 text-center">
          Estado del Dron
        </h1>

        <div className="bg-emerald-600 p-4 rounded-xl flex items-center gap-4 mb-4">
          <BatteryFull size={32} />
          <div>
            <strong>Batería</strong>
            <div>20%</div>
            <Progress value={33} className="h-2 bg-emerald-100" />
          </div>
          <Wifi size={32} />
          <div>
            <strong>CF</strong>
            <div>Casa</div>
          </div>
        </div>
        <div className="bg-emerald-600 p-4 rounded-xl flex items-center gap-4">
          <MapPin size={32} />
          <div>
            <strong>GPS</strong>
            <div>Ubicación fija</div>
          </div>
        </div>
      </div>
    </div>
  )
}

