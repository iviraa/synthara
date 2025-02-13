import WidthWrapper from "@/component/WidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <WidthWrapper className="mb-12 mt-20 sm:mt-40 flex flex-col items-center justify-center text-center">
      <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transtion-all hover:border-gray-300 hover:bg-white/50">
        <p className="text-sm font-semibold text-gray-700">Use synthara.ai</p>
      </div>
      <h1 className="max-w-5xl text-5xl font-bold sm:text-6xl lg:text-7xl">
        Let your <span className="text-orange-400">research</span> talk to you.
      </h1>
      <p className="mt-5 max-w-prose sm:text-lg text-zinc-700">
        Beyond search. Beyond summaries. Synthara synthesizes research, expands
        perspectives, and unlocks the depths of discovery.
      </p>

      <Link
        className={buttonVariants({
          size: "lg",
          className: "mt-10",
        })}
        href="/dashboard"
        target="_blank"
      >
        Get started <ArrowRight className="ml-2 h-5 w-5" />
      </Link>
    </WidthWrapper>
  );
}
