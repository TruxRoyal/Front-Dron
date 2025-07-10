import { Card } from "@/components/ui/card";
import { SlashIcon } from "lucide-react";
import { Link } from "react-router-dom";
import "./FlightMissions.css";
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

export default function FlightMissionsView() {
  return (
    <div className="w-full min-h-screen bg-emerald-50 p-4">
      <div className="bg-emerald-800 text-white rounded-lg p-6 max-w-screen-xl mx-auto">
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
