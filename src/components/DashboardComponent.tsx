"use client";

import { trpc } from "@/app/_trpc/client";
import UploadButton from "./UploadButton";
import { Ghost, Loader2 } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { Button } from "./ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const DashboardComponent = () => {
  const [deletelingFile, setDeletelingFile] = useState<string | null>(null);

  const utils = trpc.useContext();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setDeletelingFile(id);
    },
    onSettled() {
      setDeletelingFile(null);
    },
  });

  return (
    <div className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>
        <UploadButton />
      </div>
      {files && files?.length !== 0 ? (
        <ul className="space-y-2">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
              >
                <span className="font-medium truncate mx-4 flex-grow">
                  {file.name}
                </span>
                <span className="text-sm text-gray-500 mx-2 whitespace-nowrap">
                  {new Date(file.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => deleteFile({ id: file.id })}
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    {deletelingFile === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin " />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Link
                    href={`/dashboard/${file.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Preview ${file.name}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} count={3} className="my-2" />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardComponent;
