import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TabContent from "@/components/dashboard/TabContent";
import { getServerSession } from "next-auth";
import { fetchGet } from "./utils";

const DashboardWrapper = async () => {
  const { user } = await getServerSession(authOptions);

  if (!user) return <p>Please log in to view your dashboard.</p>;


  const { data: tickers } = await fetchGet(
    "/followings",
    {},
    user.accessToken,
    "https://streetalpha.codixel.tech/api",
    0
  );


  const [newsForYouResult, newsResult, summaryResult] = await Promise.allSettled([
    fetchGet(
      "/news_by_symbols",
      {
        tickers: tickers?.data?.map((t) => t.symbol),
        quantity: 8,
        offset: 0,
      },
      0
    ),
    fetchGet("/news"),
    fetchGet("/summary/SPY/1D"),
  ]);


  const newsForYou = newsForYouResult.status === 'fulfilled' && newsForYouResult.value;
  const news = newsResult.status === 'fulfilled' && newsResult.value;
  const summary = summaryResult.status === 'fulfilled' && summaryResult.value;


  if (newsForYouResult.status === 'rejected') {
    console.error('News for you fetch failed:', newsForYouResult.reason);
  }
  if (newsResult.status === 'rejected') {
    console.error('News fetch failed:', newsResult.reason);
  }
  if (summaryResult.status === 'rejected') {
    console.error('Summary fetch failed:', summaryResult.reason);
  }

  if (!newsForYou || !news || !summary) {
    return <p>Failed to load dashboard data. Please try again later.</p>;
  }

  return (
    <>
      <h1 className="text-[#070707] text-[22px] xl:text-[26px] font-medium mb-[14px]">
        Welcome {user?.name || "Vini "}
      </h1>
      <TabContent
        user={user}
        news={news}
        summary={summary}
        followings={tickers?.data || []}
        newsForYou={newsForYou}
      />
    </>
  );
};

export default DashboardWrapper;
