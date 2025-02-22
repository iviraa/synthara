import Link from "next/link";
import WidthWrapper from "./WidthWrapper";
import { buttonVariants } from "./ui/button";
import {
  getKindeServerSession,
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";

const Navbar = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <WidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-bold text-[#8D6C9F]  ">
            <span>synthara</span>
          </Link>

          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                href="/workspace"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Workspace
              </Link>

              {isUserAuthenticated ? (
                <Link
                  href="/library"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Library
                </Link>
              ) : (
                <LoginLink
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Sign in
                </LoginLink>
              )}

              {isUserAuthenticated ? (
                <LogoutLink
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Logout
                </LogoutLink>
              ) : (
                <RegisterLink
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Join now
                </RegisterLink>
              )}
            </>
          </div>
        </div>
      </WidthWrapper>
    </nav>
  );
};

export default Navbar;
