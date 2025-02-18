import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    fileid: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { fileid } = params;

  const { getUser } = getKindeServerSession();
  const user = getUser();

  const userId = (await user).id

  if (!(await user) || !(await user).email)
    redirect("/auth-callback/?origin=dashboard/${fileid}");

  const file = await db.file.findFirst({
      where: {
          id: fileid,
          userId: userId
      }
  })

  if(!file) notFound();



  return <div>page</div>;
};

export default Page;
