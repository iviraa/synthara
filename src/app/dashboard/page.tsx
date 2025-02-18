import DashboardComponent from "@/components/DashboardComponent";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!(await user) || !(await user).email)
    redirect("/auth-callback?origin=dashboard");

  const dbUser = await db.user.findFirst({
    where: { id: (await user).id },
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  return <DashboardComponent />;
};

export default Dashboard;
