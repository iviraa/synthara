import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!(await user) || !(await user).email)
    redirect("/auth-callback?origin=dashboard");

  return <div>{(await user).email}</div>;
};

export default Dashboard;
