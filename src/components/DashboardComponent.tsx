"use client";

import { trpc } from "@/app/_trpc/client";
import { Ghost, Loader2, ChevronDown } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { Button } from "./ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const DashboardComponent = () => {
  const [deletelingFile, setDeletelingFile] = useState<string | null>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );

  const utils = trpc.useContext();

  const { data: workspaces, isLoading } = trpc.getUserFiles.useQuery();

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

  const selectedWorkspace = selectedWorkspaceId
    ? workspaces?.find((w) => w.id === selectedWorkspaceId)
    : null;

  // Get all files when no workspace is selected, otherwise get files from selected workspace
  const files = selectedWorkspaceId
    ? selectedWorkspace?.File || []
    : workspaces
        ?.flatMap((workspace) => workspace.File)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ) || [];

  return (
    <div className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              {selectedWorkspace?.name || "All Workspaces"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem
              onClick={() => setSelectedWorkspaceId(null)}
              className="cursor-pointer hover:bg-zinc-800 hover:text-white"
            >
              All Workspaces
            </DropdownMenuItem>
            {workspaces?.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => setSelectedWorkspaceId(workspace.id)}
                className="cursor-pointer hover:bg-zinc-800 hover:text-white"
              >
                {workspace.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <Skeleton height={100} count={3} className="my-2" />
      ) : files.length > 0 ? (
        <ul className="mt-8 space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center w-[40%]">
                <span className="font-medium truncate">{file.name}</span>
              </div>
              {!selectedWorkspaceId && (
                <div className="w-[30%] text-center px-4">
                  <span className="text-sm text-zinc-500">
                    {
                      workspaces?.find((w) =>
                        w.File.some((f) => f.id === file.id)
                      )?.name
                    }
                  </span>
                </div>
              )}
              <div className="flex items-center justify-end w-[30%] space-x-2">
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(file.createdAt).toLocaleDateString()}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => deleteFile({ id: file.id })}
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                >
                  {deletelingFile === file.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
                <Link
                  href={`/workspace/${file.workspaceId}`}
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
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">
            {selectedWorkspaceId
              ? "No files in this workspace"
              : "No files found"}
          </h3>
          <p>Upload a PDF to get started.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardComponent;
