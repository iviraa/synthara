"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Upload, Cloud, File, Loader2 } from "lucide-react";

import Dropzone from "react-dropzone";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";

import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const UploadDropzone = ({
  onUploadComplete,
  workspaceId,
}: {
  onUploadComplete: () => void;
  workspaceId: string;
}) => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { toast } = useToast();
  const { startUpload } = useUploadThing("pdfUploader");

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      if (file.uploadStatus === "SUCCESS") {
        onUploadComplete();
        window.location.reload();
      } else if (file.uploadStatus === "FAILED") {
        toast({
          title: "Upload failed",
          description: "Please try again later.",
          variant: "destructive",
        });
      } else {
        setTimeout(() => {
          startPolling({ key: file.key });
        }, 1000);
      }
    },
    retry: true,
    retryDelay: 1000,
  });

  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);
    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();
        const res = await startUpload(acceptedFile, { workspaceId });

        if (!res) {
          clearInterval(progressInterval);
          setIsUploading(false);
          return toast({
            title: "Something went wrong",
            description: "Please try again later.",
            variant: "destructive",
          });
        }

        const [fileResponse] = res;
        const key = fileResponse?.key;
        if (!key) {
          clearInterval(progressInterval);
          setIsUploading(false);
          return toast({
            title: "Something went wrong",
            description: "Please try again later.",
            variant: "destructive",
          });
        }

        clearInterval(progressInterval);
        setUploadProgress(100);
        startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="rounded-[24px] border border-dashed border-ink-black/15 bg-canvas p-2 transition-colors duration-200 hover:border-ink-black/30"
        >
          <label
            htmlFor="dropzone-file"
            className="flex h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-[20px] bg-snow/70 px-6 text-center"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-ink-black/[0.04]">
              <Cloud className="size-5 text-ink-black" strokeWidth={1.5} />
            </span>
            <p className="text-body text-ink-black">
              <span className="font-medium">Click to upload</span>{" "}
              <span className="text-graphite">or drag and drop</span>
            </p>
            <p className="text-caption text-slate">PDF, up to 16 MB</p>

            {acceptedFiles && acceptedFiles[0] ? (
              <div className="mt-2 flex items-center gap-2 rounded-full bg-ink-black/[0.04] px-3 py-1.5 text-body-sm">
                <File className="size-3.5 text-ink-black" strokeWidth={1.5} />
                <span className="max-w-[20ch] truncate text-ink-black">
                  {acceptedFiles[0].name}
                </span>
              </div>
            ) : null}

            {isUploading ? (
              <div className="mt-3 flex w-full max-w-xs flex-col gap-2">
                <Progress value={uploadProgress} className="h-[3px]" />
                <div className="flex items-center justify-between text-caption">
                  <span className="text-slate">
                    {uploadProgress === 100 ? "Indexing the document" : "Uploading"}
                  </span>
                  <span className="text-graphite">{uploadProgress}%</span>
                </div>
                {uploadProgress === 100 ? (
                  <div className="flex items-center justify-center gap-1.5 text-caption text-graphite">
                    <Loader2 className="size-3 animate-spin" strokeWidth={1.5} />
                    Building the vector index
                  </div>
                ) : null}
              </div>
            ) : null}

            <input
              {...getInputProps()}
              type="file"
              id="dropzone-file"
              className="hidden"
            />
          </label>
        </div>
      )}
    </Dropzone>
  );
};

interface UploadButtonProps {
  workspaceId: string;
}

const UploadButton = ({ workspaceId }: UploadButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) setIsOpen(v);
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Upload className="size-4" strokeWidth={1.5} />
          Upload PDF
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-[24px] border-none bg-snow p-8 shadow-soft">
        <DialogHeader>
          <DialogTitle className="text-heading-sm font-medium text-ink-black">
            Add a PDF
          </DialogTitle>
        </DialogHeader>
        <UploadDropzone
          onUploadComplete={() => setIsOpen(false)}
          workspaceId={workspaceId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
