import Link from "next/link";
import WidthWrapper from "./WidthWrapper";
import { buttonVariants } from "./ui/button";
import {
  getKindeServerSession,
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { cn } from "@/lib/utils";

const Navbar = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  return (
    <nav className="frost-header sticky inset-x-0 top-0 z-30 w-full">
      <WidthWrapper>
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-medium text-ink-black"
          >
            <span
              aria-hidden
              className="block size-3 rotate-45 rounded-[2px] bg-spectrum"
            />
            <span className="text-body-sm tracking-tight">synthara</span>
          </Link>

          <div className="hidden items-center gap-1 sm:flex">
            {isUserAuthenticated ? (
              <>
                <Link
                  href="/workspace"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "px-4"
                  )}
                >
                  Workspace
                </Link>
                <Link
                  href="/library"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "px-4"
                  )}
                >
                  Library
                </Link>

                <span aria-hidden className="mx-2 h-4 w-px bg-ink-black/10" />

                <LogoutLink
                  className={buttonVariants({ variant: "default", size: "sm" })}
                >
                  Sign out
                </LogoutLink>
              </>
            ) : (
              <>
                <Link
                  href="/#how-it-works"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "px-4"
                  )}
                >
                  How it works
                </Link>
                <LoginLink
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "px-4"
                  )}
                >
                  Sign in
                </LoginLink>

                <span aria-hidden className="mx-2 h-4 w-px bg-ink-black/10" />

                <RegisterLink
                  className={buttonVariants({ variant: "default", size: "sm" })}
                >
                  Get Synthara
                </RegisterLink>
              </>
            )}
          </div>
        </div>
      </WidthWrapper>
    </nav>
  );
};

export default Navbar;
