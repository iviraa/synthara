"use client";

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
} from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useToast } from "@/hooks/use-toast";

import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import SimpleBar from "simplebar-react";
import PdfFullscreen from "./PdfFullscreen";
import PdfRenderer from "./PdfRenderer";

interface WorkspaceRendererProps {
  urlString: string[];
}

const WorkspaceRenderer = ({ urlString }: WorkspaceRendererProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigate left
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? urlString.length - 1 : prevIndex - 1
    );
  };

  // Navigate right
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === urlString.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-3xl">
        {/* PDF Renderer */}
        <PdfRenderer url={urlString[currentIndex]} />

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 left-[-24px] transform -translate-y-1/2 bg-[#8D6C9F] rounded-full z-10">
          <Button onClick={handlePrev} className=" rounded-full border-[#8D6C9F] border bg-[#8D6C9F] hover:bg-white ">
            <ChevronLeft className=" text-white font-bold" />
          </Button>
        </div>

        <div className="absolute top-1/2 right-[-24px] transform -translate-y-1/2 rounded-full bg-[#8D6C9F] z-10 ">
          <Button onClick={handleNext} className=" rounded-full border-[#8D6C9F] border opacity-100 bg-[#8D6C9F] hover:bg-[#8D6C9F]">
            <ChevronRight className=" text-white font-bold" />
          </Button>
        </div>
      </div>

      {/* Pagination Indicator */}
      <div className="text-semibold text-[#8D6C9F]">
        {currentIndex + 1} | {urlString.length}
      </div>
    </div>
  );
};

export default WorkspaceRenderer;
