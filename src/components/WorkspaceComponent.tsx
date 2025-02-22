"use client";

import { trpc } from "@/app/_trpc/client";
import {
  Ghost,
  Loader2,
  Plus,
  PlusCircle,
  PlusCircleIcon,
  PlusIcon,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { Button } from "./ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Router } from "next/router";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Search, ChevronDown, User, Bell, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";

const WorkspaceComponent = () => {
  const [deletelingFile, setDeletelingFile] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");

  const utils = trpc.useContext();

  const { data, isLoading } = trpc.getUserWorkspaces.useQuery();

  useEffect(() => {
    if (data) {
      setWorkspaces(data);
    }
  }, [data]);

  const [workspaces, setWorkspaces] = useState(data || []);

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
  console.log(workspaces);

  const filteredAndSortedWorkspaces = workspaces
    .filter((workspace) =>
      workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "date")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return 0;
    });

  return (
    <div className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Workspaces</h1>
      </div>
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
      {workspaces && workspaces?.length !== 0 ? (
        <div className="space-y-2 grid grid-cols-2 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
          <div className="aspect-[3/4] text-zinc-400 hover:text-zinc-600 transition-colors ">
            <button className=" w-full h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center my-2  border-zinc-300 hover:border-gray-600 transition-colors hover:bg-gray-50">
              <Plus className="h-16 w-16 mb-4" />
            </button>
            <div className=" mx-auto mt-4 font-semibold text-lg text-center ">New</div>
          </div>
          {filteredAndSortedWorkspaces.map((workspace) => (
            <motion.div
              key={workspace.id}
              className="group flex flex-col items-center cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <Link href={`/workspace/${workspace.id}`}>
                  <Image
                    src={workspace.imageUrl ?? "/placeholder.svg"}
                    alt={workspace.name}
                    quality={100}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>

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
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s start your first research.</p>
        </div>
      )}
    </div>
  );
};

export default WorkspaceComponent;
