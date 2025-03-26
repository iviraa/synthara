"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { data, isSuccess } = trpc.authCallback.useQuery();

  if (isSuccess && data.success) {
    router.push(origin ? `/${origin}` : "/workspace");
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="frost-card flex flex-col items-center gap-3 px-12 py-10 text-center">
        <Loader2
          className="size-6 animate-spin text-ink-black"
          strokeWidth={1.5}
        />
        <h3 className="text-heading-sm font-medium text-ink-black">
          Setting up your workspace
        </h3>
        <p className="max-w-[36ch] text-body-sm text-graphite">
          One moment. We are pulling your library together.
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-graphite">
          Loading...
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
