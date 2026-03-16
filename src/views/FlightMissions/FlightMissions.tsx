import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

const img1 = require("./imagenes/img1.jpg")
const img2 = require("./imagenes/img2.jpg")

const images = [
  { src: img1, name: "Misión vuelo 1", date: "24-08-2023" },
  { src: img2, name: "Misión vuelo 2", date: "25-08-2023" },
  { src: img2, name: "Misión vuelo 3", date: "26-08-2023" },
  { src: img1, name: "Misión vuelo 4", date: "27-08-2023" },
  { src: img1, name: "Misión vuelo 5", date: "28-08-2023" },
  { src: img2, name: "Misión vuelo 6", date: "29-08-2023" },
]

export default function FlightMissionsView() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [tabValue, setTabValue] = React.useState("")

  return (
    <div className="w-full min-h-screen bg-green-100 p-6">
      <div className="bg-green-200 rounded-2xl shadow-lg p-6 max-w-screen-xl mx-auto">
        <div className="relative flex items-center justify-between mb-6">
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between bg-white rounded shadow"
                >
                  {value ? images.find((img) => img.date === value)?.date : "Recorrido"}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar por fecha..." />
                  <CommandList>
                    <CommandEmpty>No encontrado.</CommandEmpty>
                    <CommandGroup>
                      {images.map((img, index) => (
                        <CommandItem
                          key={index}
                          value={img.date}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === img.date ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {img.date}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Tabs value={tabValue} onValueChange={setTabValue}>
              <TabsList className="bg-white rounded-lg p-1 shadow">
                <TabsTrigger value="Imagenes" className="px-4 py-2">
                  Imágenes
                </TabsTrigger>
                <TabsTrigger value="Video" className="px-4 py-2">
                  Video
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="w-[200px]"></div>
        </div>

        <Tabs value={tabValue} onValueChange={setTabValue}>
          <TabsContent value="Imagenes">
            <div className="grid grid-cols-3 gap-4">
              {images
                .filter((img) => (value ? img.date === value : true))
                .map((img, index) => (
                  <div
                    key={index}
                    className="rounded-2xl shadow overflow-hidden flex flex-col"
                  >
                    <img
                      src={img.src}
                      alt={`Cultivo ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="bg-green-600 text-white text-center py-2">
                      <p className="font-semibold">{img.name}</p>
                      <p className="text-sm">{img.date}</p>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="Video">
            <h2 className="text-center text-lg font-semibold text-gray-700 mt-6">
              Aquí van videos
            </h2>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center items-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <div className="flex justify-center mt-4">
          <Link
            to="/flightreport"
            className="px-4 py-2 bg-green-600 text-white rounded shadow"
          >
            Siguiente
          </Link>
        </div>
      </div>
    </div>
  )
}
