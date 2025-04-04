"use client";

import { trpc } from "@/app/_trpc/client";
import {
  Ghost,
  Loader2,
  Plus,
  Search,
  ChevronDown,
  ImageIcon,
  ImageUpIcon,
  Trash2,
} from "lucide-react";
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
import { motion } from "framer-motion";
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

const WorkspaceComponent = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceImageUrl, setNewWorkspaceImageUrl] = useState("");
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
        setNewWorkspaceImageUrl("");
        toast({
          title: "Workspace created!",
          description: "Your new workspace is ready.",
        });
        router.push(`/workspace/${newWorkspace.id}`);
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Could not create workspace.",
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
        toast({
          title: "Workspace deleted",
          description: "The workspace has been deleted successfully.",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Could not delete workspace.",
          variant: "destructive",
        });
      },
    });

  const handleDeleteClick = (workspaceId: string) => {
    setWorkspaceToDelete(workspaceId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (workspaceToDelete) {
      deleteWorkspace({ id: workspaceToDelete });
    }
  };

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
    <div className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center">
        <h1 className="font-bold text-5xl text-gray-900">My Workspaces</h1>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 mt-4 px-4 space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search workspaces..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Sort by <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy("name")}>
              Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("date")}>
              Date Created
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Workspaces List */}
      {workspaces.length ? (
        <div className="grid grid-cols-2 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Create New Workspace Button */}
          <div className="aspect-[3/4] text-zinc-400 hover:text-zinc-600 transition-colors">
            <button
              className="w-full h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center border-zinc-300 hover:border-gray-600 transition-colors hover:bg-gray-50"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-16 w-16" />
            </button>
            <h3 className="mt-4 font-semibold text-lg text-center text-gray-800">
              New
            </h3>
            <p className="text-sm text-gray-600 mt-1 invisible">Placeholder</p>
          </div>

          {/* Render Workspaces */}
          {filteredAndSortedWorkspaces.map((workspace) => (
            <motion.div
              key={workspace.id}
              className="group flex flex-col items-center cursor-pointer relative"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/80 hover:bg-red-100 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(workspace.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {workspace.imageUrl ? (
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <Link href={`/workspace/${workspace.id}`}>
                    <Image
                      src={workspace.imageUrl}
                      alt={workspace.name}
                      quality={100}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>
              ) : (
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                  <Link href={`/workspace/${workspace.id}`}>
                    <ImageIcon className="group-hover:scale-105 transition-transform duration-300 w-full h-full" />
                  </Link>
                </div>
              )}

              <h3 className="mt-4 font-semibold text-lg text-center text-gray-800">
                {workspace.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {format(new Date(workspace.createdAt), "MMM d, yyyy")}
              </p>
            </motion.div>
          ))}
        </div>
      ) : isLoading ? (
        <Skeleton height={100} count={3} className="my-2" />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-4">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p className="text-sm text-gray-500">
            Let&apos;s start your first research.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>Start</Button>
        </div>
      )}

      {/* Dialog for Creating a Workspace */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-6 rounded-lg shadow-lg max-w-sm">
          <DialogHeader>
            <DialogTitle>Create a new Workspace</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Workspace Name
              </label>
              <Input
                type="text"
                placeholder="Enter workspace name..."
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="w-full mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Image URL
              </label>
              <Input
                type="url"
                placeholder="Enter image URL..."
                value={newWorkspaceImageUrl}
                onChange={(e) => setNewWorkspaceImageUrl(e.target.value)}
                className="w-full mt-1"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between mt-6">
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
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="p-6 rounded-lg shadow-lg max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Workspace</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600 mt-2">
            Are you sure you want to delete this workspace? This action cannot
            be undone.
          </p>

          <DialogFooter className="flex justify-between mt-6">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkspaceComponent;
