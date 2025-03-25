"use client";

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import {
  ChevronLeft,
  ChevronRight,
  File
} from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { useState } from "react";
import { Button } from "./ui/button";



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
      <div className="relative w-full max-w-3xl min-h-[calc(100vh-8rem)] bg-white rounded-md shadow">
        {urlString.length > 0 ? (
          <>
            {/* PDF Renderer */}
            <PdfRenderer url={urlString[currentIndex]} />

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 left-[-24px] transform -translate-y-1/2 bg-[#8D6C9F] rounded-full z-10">
              <Button
                onClick={handlePrev}
                className="rounded-full border-[#8D6C9F] border bg-[#8D6C9F] hover:bg-white"
              >
                <ChevronLeft className="text-white font-bold" />
              </Button>
            </div>

            <div className="absolute top-1/2 right-[-24px] transform -translate-y-1/2 rounded-full bg-[#8D6C9F] z-10">
              <Button
                onClick={handleNext}
                className="rounded-full border-[#8D6C9F] border opacity-100 bg-[#8D6C9F] hover:bg-[#8D6C9F]"
              >
                <ChevronRight className="text-white font-bold" />
              </Button>
            </div>

            {/* Pagination Indicator */}
            <div className="text-semibold text-[#8D6C9F] absolute bottom-4 left-1/2 transform -translate-x-1/2">
              {currentIndex + 1} | {urlString.length}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-zinc-400 m-6 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50 shadow-inner">
            <div className="flex flex-col items-center">
              <File className="h-16 w-16 mb-4 opacity-70" />
              <p className="text-xl font-medium">No files in workspace</p>
              <p className="text-sm mt-2">Upload a PDF to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceRenderer;
