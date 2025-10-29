import TabContent from "../../../../components/dashboard/TabContent";

const UserDashboard = ({
  user,
  followings,
  newsPromise,
  summaryPromise,
  newsForYouPromise,
}) => {
  const { name } = user;

  return (
    <>
      <h1 className="text-[#070707] text-[22px] xl:text-[26px] font-medium mb-[14px]">
        Welcome {name || "Vini "}
      </h1>
      <TabContent
        followings={followings}
        newsPromise={newsPromise}
        summaryPromise={summaryPromise}
        newsForYouPromise={newsForYouPromise}
      />
    </>
  );
};

export default UserDashboard;
