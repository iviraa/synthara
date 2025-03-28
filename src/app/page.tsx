import WidthWrapper from "@/components/WidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  return (
    <>
      <WidthWrapper className="mb-12 mt-20 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transtion-all hover:border-gray-300 hover:bg-white/50">
          <p className="text-sm font-semibold text-gray-700">Use synthara.ai</p>
        </div>
        <h1 className="max-w-5xl text-5xl font-bold sm:text-6xl lg:text-7xl">
          Let your <span className="text-[#8D6C9F]">research</span> talk to you.
        </h1>
        <p className="mt-5 max-w-prose sm:text-lg text-zinc-700">
          Beyond search. Beyond summaries. Synthara synthesizes research,
          expands perspectives, and unlocks the depths of discovery.
        </p>

        {isUserAuthenticated ? (
          <Link
            className={buttonVariants({
              size: "lg",
              className: "mt-10",
            })}
            href="/workspace"
          >
            Get started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        ) : (
          <LoginLink
            className={buttonVariants({
              size: "lg",
              className: "mt-10",
            })}
          >
            Get started <ArrowRight className="ml-2 h-5 w-5" />
          </LoginLink>
        )}
      </WidthWrapper>
      <div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 "
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ED7899] to-[#8D6C9F] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <Image
                    src="/dashboard.png"
                    alt="preview"
                    width={1366}
                    height={816}
                    quality={100}
                    className="rounded-md bg-white p-2 sm:p=8 md:p-20 shadow-2xl ring-1 ring-gray-900/10 "
                  ></Image>
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 "
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ED7899] to-[#8D6C9F] opacity-70 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mmt-2 font-bold text-4xl text-gray-900 sm:text-5xl">
              Design your workspace
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Working on a paper has never been easier than with Synthara.
            </p>
          </div>
        </div>

        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-top-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-bold text-[#8D6C9F]">Step 1</span>
              <span className="text-xl font-semibold">
                Sign up for an account
              </span>
              <span className="mt-2 text-zinc-700">
                Start out with a free plan or choose our{" "}
                <Link
                  href={"/pricing"}
                  className="text-[#8D6C9F] font-bold underline-offset-2"
                >
                  pro plan.
                </Link>
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-top-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-bold text-[#8D6C9F]">Step 2</span>
              <span className="text-xl font-semibold">
                Upload your documents.
              </span>
              <span className="mt-2 text-zinc-700">
                Synthara will process your files and make it ready for
                intelligent insights.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-top-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-bold text-[#8D6C9F]">Step 3</span>
              <span className="text-xl font-semibold">
                Start asking questions
              </span>
              <span className="mt-2 text-zinc-700">
                It&apos;s that simple. Try out{" "}
                <span className="font-bold text-[#8D6C9F]">Synthara</span> today
                - it really takes you less than a minute.
              </span>
            </div>
          </li>
        </ol>

        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="/file-upload-preview.jpg"
                alt="uploading preview"
                width={1419}
                height={732}
                quality={100}
                className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
