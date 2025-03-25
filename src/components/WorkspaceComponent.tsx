"use client";

import { trpc } from "@/app/_trpc/client";
import { Loader2, Plus, Search, ChevronDown, Trash2 } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import WidthWrapper from "./WidthWrapper";
import { cn } from "@/lib/utils";

const SAMPLE_IMAGE_URL = "https://picsum.photos/seed/synthara-new/600/800";

const WorkspaceComponent = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "date">("date");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceImageUrl, setNewWorkspaceImageUrl] =
    useState(SAMPLE_IMAGE_URL);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(
    null
  );

  const utils = trpc.useContext();
  const { toast } = useToast();
  const router = useRouter();

  const { data, isLoading } = trpc.getUserWorkspaces.useQuery();
  const [workspaces, setWorkspaces] = useState(data || []);

  useEffect(() => {
    if (data) setWorkspaces(data);
  }, [data]);

  const { mutate: createWorkspace, isPending: isCreating } =
    trpc.createWorkspace.useMutation({
      onSuccess: (newWorkspace) => {
        setWorkspaces((prev) => [...prev, newWorkspace]);
        setIsDialogOpen(false);
        setNewWorkspaceName("");
        setNewWorkspaceImageUrl(SAMPLE_IMAGE_URL);
        utils.getUserWorkspaces.invalidate();
        toast({
          title: "Workspace created",
          description: "Your new workspace is ready.",
        });
        router.push(`/workspace/${newWorkspace.id}`);
      },
      onError: () => {
        toast({
          title: "Could not create workspace",
          description: "Please try again.",
          variant: "destructive",
        });
      },
    });

  const { mutate: deleteWorkspace, isPending: isDeleting } =
    trpc.deleteWorkspace.useMutation({
      onSuccess: () => {
        setWorkspaces((prev) =>
          prev.filter((workspace) => workspace.id !== workspaceToDelete)
        );
        setIsDeleteDialogOpen(false);
        setWorkspaceToDelete(null);
        utils.getUserWorkspaces.invalidate();
        toast({
          title: "Workspace deleted",
          description: "The workspace has been removed.",
        });
      },
      onError: () => {
        toast({
          title: "Could not delete workspace",
          description: "Please try again.",
          variant: "destructive",
        });
      },
    });

  const filteredAndSortedWorkspaces = workspaces
    .filter((workspace) =>
      workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === "name"
        ? a.name.localeCompare(b.name)
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <main className="min-h-screen bg-canvas pb-24 pt-12">
      <WidthWrapper>
        <header className="flex flex-col gap-6 pb-10">
          <p className="text-caption uppercase tracking-[0.18em] text-slate">
            Your workspaces
          </p>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <h1 className="max-w-[18ch] text-[40px] font-light leading-[1.05] tracking-[-0.04em] text-ink-black sm:text-heading">
              Pick up where
              <br />
              your reading left off.
            </h1>
            <Button onClick={() => setIsDialogOpen(true)} size="lg">
              <Plus className="size-4" strokeWidth={1.75} />
              New workspace
            </Button>
          </div>
        </header>

        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate"
              strokeWidth={1.5}
            />
            <Input
              type="text"
              placeholder="Search workspaces"
              className="h-11 rounded-full border-ink-black/10 bg-snow/70 pl-11 text-body-sm placeholder:text-slate focus-visible:ring-ink-black/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort by {sortBy === "name" ? "name" : "date"}
                <ChevronDown className="size-4" strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("date")}>
                Date created
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={320} borderRadius={30} />
            ))}
          </div>
        ) : filteredAndSortedWorkspaces.length === 0 ? (
          <EmptyState onCreate={() => setIsDialogOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <button
              onClick={() => setIsDialogOpen(true)}
              className={cn(
                "frost-card group flex aspect-[3/4] flex-col items-center justify-center gap-3",
                "border border-dashed border-ink-black/15 bg-snow/40 text-graphite",
                "transition-all duration-200 hover:border-ink-black/40 hover:text-ink-black"
              )}
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-ink-black/[0.04] transition-colors duration-200 group-hover:bg-ink-black/[0.08]">
                <Plus className="size-5" strokeWidth={1.5} />
              </span>
              <span className="text-body-sm font-medium">New workspace</span>
            </button>

            {filteredAndSortedWorkspaces.map((workspace) => (
              <article
                key={workspace.id}
                className="group relative flex flex-col gap-3"
              >
                <Link
                  href={`/workspace/${workspace.id}`}
                  className="frost-card relative block aspect-[3/4] overflow-hidden p-2"
                >
                  {workspace.imageUrl ? (
                    <Image
                      src={workspace.imageUrl}
                      alt={workspace.name}
                      fill
                      sizes="(min-width: 1280px) 280px, (min-width: 640px) 33vw, 100vw"
                      className="rounded-image object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="rounded-image flex h-full w-full items-center justify-center bg-fog">
                      <span
                        aria-hidden
                        className="block size-8 rotate-45 rounded-[3px] bg-spectrum"
                      />
                    </div>
                  )}
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setWorkspaceToDelete(workspace.id);
                    setIsDeleteDialogOpen(true);
                  }}
                  aria-label={`Delete ${workspace.name}`}
                  className={cn(
                    "absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-snow/90 text-graphite shadow-soft backdrop-blur-frost transition-all duration-200",
                    "opacity-0 group-hover:opacity-100",
                    "hover:bg-snow hover:text-ink-black"
                  )}
                >
                  <Trash2 className="size-4" strokeWidth={1.5} />
                </button>

                <div className="flex flex-col gap-0.5 px-1">
                  <h3 className="text-body font-medium text-ink-black">
                    {workspace.name}
                  </h3>
                  <p className="text-caption text-slate">
                    {format(new Date(workspace.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </WidthWrapper>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-[24px] border-none bg-snow p-8 shadow-soft">
          <DialogHeader>
            <DialogTitle className="text-heading-sm font-medium text-ink-black">
              New workspace
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-body-sm text-graphite">
                Workspace name
              </label>
              <Input
                type="text"
                placeholder="e.g. Quantum thermodynamics"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="h-11 rounded-full border-ink-black/10 bg-canvas px-4 text-body-sm placeholder:text-slate focus-visible:ring-ink-black/30"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-body-sm text-graphite">Cover image</label>
              <Input
                type="url"
                placeholder="https://"
                value={newWorkspaceImageUrl}
                onChange={(e) => setNewWorkspaceImageUrl(e.target.value)}
                className="h-11 rounded-full border-ink-black/10 bg-canvas px-4 text-body-sm placeholder:text-slate focus-visible:ring-ink-black/30"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2 sm:justify-end">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                createWorkspace({
                  name: newWorkspaceName,
                  imageUrl: newWorkspaceImageUrl,
                })
              }
              disabled={
                !newWorkspaceName.trim() ||
                !newWorkspaceImageUrl.trim() ||
                isCreating
              }
            >
              {isCreating ? (
                <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-[24px] border-none bg-snow p-8 shadow-soft">
          <DialogHeader>
            <DialogTitle className="text-heading-sm font-medium text-ink-black">
              Delete workspace?
            </DialogTitle>
          </DialogHeader>

          <p className="mt-2 text-body-sm text-graphite">
            This will remove the workspace and its files from your library. The
            action cannot be undone.
          </p>

          <DialogFooter className="mt-6 gap-2 sm:justify-end">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                workspaceToDelete && deleteWorkspace({ id: workspaceToDelete })
              }
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="frost-card mx-auto flex max-w-2xl flex-col items-center gap-4 px-12 py-20 text-center">
      <span
        aria-hidden
        className="block size-8 rotate-45 rounded-[3px] bg-spectrum opacity-90"
      />
      <h3 className="text-heading-sm font-medium text-ink-black">
        Your shelf is empty.
      </h3>
      <p className="max-w-[36ch] text-body text-graphite">
        Spin up a workspace, drop in a few PDFs, and start asking questions of
        the corpus you build.
      </p>
      <Button onClick={onCreate} size="lg" className="mt-2">
        Create your first workspace
      </Button>
    </div>
  );
}

export default WorkspaceComponent;
