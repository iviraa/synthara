"use client";

import { trpc } from "@/app/_trpc/client";
import { Loader2, ChevronDown, FileText, Trash2, ArrowUpRight } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import WidthWrapper from "./WidthWrapper";

const DashboardComponent = () => {
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
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
      setDeletingFile(id);
    },
    onSettled() {
      setDeletingFile(null);
    },
  });

  const selectedWorkspace = selectedWorkspaceId
    ? workspaces?.find((w) => w.id === selectedWorkspaceId)
    : null;

  const files = selectedWorkspaceId
    ? selectedWorkspace?.File || []
    : workspaces
        ?.flatMap((workspace) =>
          workspace.File.map((file) => ({ ...file, workspaceName: workspace.name }))
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ) || [];

  return (
    <main className="min-h-screen bg-canvas pb-24 pt-12">
      <WidthWrapper>
        <header className="flex flex-col gap-6 pb-10">
          <p className="text-caption uppercase tracking-[0.18em] text-slate">
            Library
          </p>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <h1 className="max-w-[18ch] text-[40px] font-light leading-[1.05] tracking-[-0.04em] text-ink-black sm:text-heading">
              Every paper you have asked about,
              <br />
              in one shelf.
            </h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {selectedWorkspace?.name || "All workspaces"}
                  <ChevronDown className="size-4" strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuItem onClick={() => setSelectedWorkspaceId(null)}>
                  All workspaces
                </DropdownMenuItem>
                {workspaces?.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onClick={() => setSelectedWorkspaceId(workspace.id)}
                  >
                    {workspace.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={72} borderRadius={20} />
            ))}
          </div>
        ) : files.length > 0 ? (
          <ul className="frost-card divide-y divide-ink-black/[0.06] overflow-hidden p-0">
            {files.map((file) => {
              const workspaceName =
                "workspaceName" in file
                  ? (file as typeof file & { workspaceName?: string })
                      .workspaceName
                  : workspaces?.find((w) =>
                      w.File.some((f) => f.id === file.id)
                    )?.name;

              return (
                <li
                  key={file.id}
                  className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-6 py-4 transition-colors duration-200 hover:bg-ink-black/[0.02] sm:grid-cols-[auto_1fr_auto_auto_auto]"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-black/[0.04]">
                    <FileText
                      className="size-4 text-ink-black"
                      strokeWidth={1.5}
                    />
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-body font-medium text-ink-black">
                      {file.name}
                    </p>
                    <p className="text-caption text-slate sm:hidden">
                      {workspaceName}
                    </p>
                  </div>

                  <p className="hidden text-body-sm text-graphite sm:block">
                    {workspaceName}
                  </p>

                  <p className="hidden text-body-sm text-slate sm:block">
                    {format(new Date(file.createdAt), "MMM d, yyyy")}
                  </p>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteFile({ id: file.id })}
                      aria-label={`Delete ${file.name}`}
                      className="text-graphite hover:text-spectrum-red"
                    >
                      {deletingFile === file.id ? (
                        <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
                      ) : (
                        <Trash2 className="size-4" strokeWidth={1.5} />
                      )}
                    </Button>
                    <Link
                      href={`/workspace/${file.workspaceId}`}
                      aria-label={`Open ${file.name}`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-graphite hover:text-ink-black"
                      >
                        <ArrowUpRight
                          className="size-4"
                          strokeWidth={1.5}
                        />
                      </Button>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="frost-card mx-auto flex max-w-2xl flex-col items-center gap-4 px-12 py-20 text-center">
            <span
              aria-hidden
              className="block size-8 rotate-45 rounded-[3px] bg-spectrum opacity-90"
            />
            <h3 className="text-heading-sm font-medium text-ink-black">
              {selectedWorkspaceId
                ? "Nothing in this workspace yet"
                : "Your library is empty"}
            </h3>
            <p className="max-w-[36ch] text-body text-graphite">
              Open a workspace and drop in a PDF to start your first
              conversation.
            </p>
            <Link href="/workspace">
              <Button size="lg" className="mt-2">
                Go to workspaces
              </Button>
            </Link>
          </div>
        )}
      </WidthWrapper>
    </main>
  );
};

export default DashboardComponent;
