import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { initTRPC } from "@trpc/server";
const t = initTRPC.create();

const middleware = t.middleware;

const isAuthed = middleware(async (opts) => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  const userId = (await user).id;
  const userEmail = (await user).email;

  if (!userId || !userEmail) {
    throw new Error("UNAUTHORIZED");
  }

  return opts.next({ ctx: { userId: userId, user } }); // forward the context along
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthed);
