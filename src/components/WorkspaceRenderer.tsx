"use client";

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

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

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? urlString.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === urlString.length - 1 ? 0 : prev + 1
    );
  };

  if (urlString.length === 0) {
    return (
      <div className="frost-card flex h-full flex-col items-center justify-center gap-3 px-12 py-20 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-ink-black/[0.04]">
          <FileText className="size-5 text-ink-black" strokeWidth={1.5} />
        </span>
        <h3 className="text-heading-sm font-medium text-ink-black">
          No documents in this workspace
        </h3>
        <p className="max-w-[36ch] text-body text-graphite">
          Upload a PDF using the button above to start your first
          conversation with the corpus.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="frost-card relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <PdfRenderer url={urlString[currentIndex]} />

        {urlString.length > 1 && (
          <>
            <Button
              onClick={handlePrev}
              variant="solid"
              size="icon"
              aria-label="Previous document"
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 shadow-soft"
            >
              <ChevronLeft className="size-4" strokeWidth={1.75} />
            </Button>
            <Button
              onClick={handleNext}
              variant="solid"
              size="icon"
              aria-label="Next document"
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 shadow-soft"
            >
              <ChevronRight className="size-4" strokeWidth={1.75} />
            </Button>
            <div className="soft-fill absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 text-caption">
              {currentIndex + 1} of {urlString.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkspaceRenderer;
