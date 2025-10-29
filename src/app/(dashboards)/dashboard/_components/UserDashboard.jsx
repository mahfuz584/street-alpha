import TabContent from "../../../../components/dashboard/TabContent";

const UserDashboard = ({
  user,
  newsForYou,
  news,
  summary,
  followings,
}) => {
  const { name } = user;

  return (
    <>
      <h1 className="text-[#070707] text-[22px] xl:text-[26px] font-medium mb-[14px]">
        Welcome {name || "Vini "}
      </h1>
      <TabContent
        user={user}
        news={news}
        summary={summary}
        followings={followings}
        newsForYou={newsForYou}
      />
    </>
  );
};

export default UserDashboard;
