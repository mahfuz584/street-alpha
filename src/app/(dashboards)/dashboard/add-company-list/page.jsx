import CompanyFollowWrapper from "@/components/dashboard/CompanyFollowWrapper";
import axios from "axios";

const AddCompanyList = async () => {
  let tickers = [];

  try {
    const response = await axios.get("http://54.210.247.12:5000/tickers");
    tickers = response?.data;
  } catch (error) {
    console.log("Error fetching tickers:", error);
  }

  console.log("Fetched tickers:", tickers);

  return (
    <>
      <CompanyFollowWrapper tickers={tickers} />
    </>
  );
};

export default AddCompanyList;
