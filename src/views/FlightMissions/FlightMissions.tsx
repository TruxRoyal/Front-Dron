import { Card } from "@/components/ui/card";
import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { SlashIcon } from "lucide-react";
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom";
import "./FlightMissions.css";
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const img1 = require("./imagenes/img1.jpg");
const img2 = require("./imagenes/img2.jpg");

const images = [
  { src: img1, date: "24-08-2023" },
  { src: img2, date: "24-08-2023" },
  { src: img2, date: "24-08-2023" },
  { src: img1, date: "24-08-2023" },
  { src: img1, date: "24-08-2023" },
  { src: img2, date: "24-08-2023" },
];

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
]

export default function FlightMissionsView() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  return (
    


    <div className="w-full min-h-screen bg-emerald-50 p-4">
      <div className="bg-emerald-800 text-white rounded-lg p-6 max-w-screen-xl mx-auto">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value
                ? frameworks.find((framework) => framework.value === value)?.label
                : "Buscar Recorrido"}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Buscar Por Fecha..." />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === framework.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {framework.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex justify-center mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-white">
                  Imágenes
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-white">
                  Videos
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="gallery-grid">
          {images.map((img, index) => (
            <Card key={index} className="image-card">
              <img
                src={img.src}
                alt={`Cultivo ${index + 1}`}
                className="card-image"
              />
              <span className="image-date">{img.date}</span>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="/flightreport" />
              </PaginationItem>
              <PaginationItem>
                <Link
                  to="/flightreport"
                  className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Siguiente
                </Link>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
