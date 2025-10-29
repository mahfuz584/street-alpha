import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import UserDashboard from "./UserDashboard";
import { fetchGet } from "./utils";

const DashboardWrapper = async () => {
  const { user } = await getServerSession(authOptions);

  if (!user) return <div>Please log in to view your dashboard.</div>;

  const { data: tickers } = await fetchGet(
    "/followings",
    {},
    user.accessToken,
    "https://streetalpha.codixel.tech/api",
    0
  );

  const newsForYouPromise = fetchGet(
    "/news_by_symbols",
    {
      tickers: tickers?.data?.map((t) => t.symbol),
      quantity: 8,
      offset: 0,
    },
    0
  );
  const newsPromise = fetchGet("/news");
  const summaryPromise = fetchGet("/summary/SPY/1D");

  return (
    <UserDashboard
      user={user}
      newsPromise={newsPromise}
      summaryPromise={summaryPromise}
      followings={tickers?.data || []}
      newsForYouPromise={newsForYouPromise}
    />
  );
};

export default DashboardWrapper;
