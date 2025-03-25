import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";
import { INFINITE_QUERY_LIMIT } from "@/config/inifinite-query";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!(await user).id || !(await user).email)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: { id: (await user).id },
    });

    if (!dbUser) {
      const userId = (await user).id;
      const userEmail = (await user).email;

      if (!userEmail) {
        throw new Error("User email is null or undefined.");
      }

      await db.user.create({
        data: {
          id: userId,
          email: userEmail,
        },
      });
    }

    return { success: true };
  }),
  getUserWorkspaces: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await db.workspace.findMany({
      where: {
        userId,
      },
    });
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId, user } = ctx;

    return await db.file.findMany({
      where: {
        userId,
      },
    });
  }),
  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      return file;
    }),
  createWorkspace: privateProcedure
    .input(
      z.object({
        name: z.string().min(1, "Workspace name is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const workspace = await db.workspace.create({
        data: {
          name: input.name,
          userId,
        },
      });

      return workspace;
    }),
  getWorkspaceMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        workspaceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { workspaceId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const workspace = await db.workspace.findFirst({
        where: {
          id: workspaceId,
          userId,
        },
      });
      if (!workspace) throw new TRPCError({ code: "NOT_FOUND" });

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          workspaceId,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),

  getFileStatus: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });

      if (!file) {
        return { status: "PENDING" as const };
      }

      return { status: file.uploadStatus };
    }),
  getWorkspaceStatus: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const files = await db.file.findMany({
        where: {
          workspaceId: input.id,
          userId: ctx.userId,
        },
        select: {
          id: true,
          name: true,
          uploadStatus: true,
          url: true,
          key: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      console.log("Files found:", files);

      console.log("Fetching messages for workspace:", input.id);

      if (!files.length) {
        return { status: "PENDING" as const };
      }

      const allUploaded = files.every(
        (file) => file.uploadStatus === "SUCCESS"
      );

      console.log("saatus:", allUploaded);

      return { status: allUploaded ? "SUCCESS" : "FAILED" };
    }),
  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      await db.file.delete({
        where: {
          id: input.id,
        },
      });

      return file;
    }),
});

export type AppRouter = typeof appRouter;
