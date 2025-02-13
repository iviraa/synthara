import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Dashboard = () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user) redirect("/auth-callback?origin=dashboard");

  return <div></div>;
};

export default Dashboard;
