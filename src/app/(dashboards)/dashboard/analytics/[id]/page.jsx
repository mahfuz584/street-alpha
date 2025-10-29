import ChatBox from "@/components/dashboard/ChatBox";
import CustomRadarChart from "@/components/dashboard/CustomRadarChart";
import axios from "axios";
import Link from "next/link";
import FollowToggle from "./_components/FollowToggle";

const SingleInfoPage = async ({ params }) => {
  const awaitedParams = await params;

  const ticker = awaitedParams.id;

  let analyticData = null;
  try {
    const response = await axios.get(
      `http://54.210.247.12:5000/analyst/${ticker}`
    );
    analyticData = response?.data;
  } catch (error) {
    console.log("Failed to fetch news details:", error.message);
  }

  if (!analyticData) {
    return (
      <div className="text-center py-10 text-red-500">
        No analytic data found.
      </div>
    );
  }
  const {
    symbol,
    company_description,
    company_name,
    industry,
    market_cap,
    eps_growth,
    pe_ratio,
    positives_raised,
    concerns,
    streets_alpha_rating,
    ai_forecast,
  } = analyticData;

  return (
    <>
      {analyticData ? (
        <>
          <div className="w-full max-w-[1080px] mx-auto flex flex-col justify-center">
            <div className="pt-[29px] rounded-[8px] border-[0.5px] border-[#B3B3B3] mb-[32px]">
              <div className="flex items-center gap-[13px] pb-[34px] px-[20px]">
                <div className="w-full max-w-[70px] bg-[#8b8888] rounded-sm">
                  <img
                    src="/assets/images/dashboard-company/demoIcon.svg"
                    alt="logo"
                    className="w-full h-full object-cover object-center rounded-sm"
                  />
                </div>
                <div className="w-full flex items-start justify-between">
                  <h4 className="xl:text-[22px] text-[20px] text-[#070707] font-medium mb-[6px] mt-0 leading-normal">
                    {company_name || ""}
                    <br />
                    <span className="text-[14px] ">{symbol || ""}</span>
                  </h4>
                </div>
                <FollowToggle ticker={symbol} />
              </div>
              <div className="grid grid-cols-4 border-t-[1px] border-[#B3B3B3] ">
                <div className="w-ful border-e-[1px] border-[#B3B3B3]">
                  <div className="px-[20px] pt-[32px] pb-[40px]">
                    <div className="text-[18px] font-medium text-[#070707] mb-[13px] leading-none">
                      Market Cap
                    </div>
                    <div className="xl:text-[22px] text-[20px] font-medium text-[#070707] leading-[1.4]">
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact",
                        maximumFractionDigits: 2,
                      }).format(market_cap)}
                    </div>
                  </div>
                </div>
                <div className="w-ful border-e-[1px] border-[#B3B3B3]">
                  <div className="px-[20px] pt-[32px] pb-[40px]">
                    <div className="text-[18px] font-medium text-[#070707] mb-[13px] leading-none">
                      EPS Growth (FWD)
                    </div>
                    <div className="xl:text-[22px] text-[20px] font-medium text-[#070707] leading-[1.4]">
                      {eps_growth}
                    </div>
                  </div>
                </div>
                <div className="w-ful border-e-[1px] border-[#B3B3B3]">
                  <div className="px-[20px] pt-[32px] pb-[40px]">
                    <div className="text-[18px] font-medium text-[#070707] mb-[13px] leading-none">
                      P/E Ratio (TTM)
                    </div>
                    <div className="xl:text-[22px] text-[20px] font-medium text-[#070707] leading-[1.4]">
                      {pe_ratio}
                    </div>
                  </div>
                </div>
                <div className="w-ful border-e-[1px] border-[#B3B3B3]">
                  <div className="px-[20px] pt-[32px] pb-[40px]">
                    <div className="text-[18px] font-medium text-[#070707] mb-[13px] leading-none">
                      Industry
                    </div>
                    <div className="xl:text-[22px] text-[20px] font-medium text-[#070707] leading-[1.4]">
                      {industry}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-[40px] px-[20px] bg-[#F1F4F2] rounded-[8px] space-y-[22px]">
              <div className="text-sm text-[#070707] mb-[12px]">
                {company_description}
              </div>

              {positives_raised && (
                <div>
                  <div className="text-[18px] font-medium text-[#070707] mb-[10px]">
                    Positive Raised :
                  </div>
                  <ul className="px-[20px] list-disc">
                    {positives_raised.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="text-sm  text-[#070707] pb-[8px]"
                        >
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {concerns && (
                <div>
                  <div className="text-[18px] font-medium text-[#070707] mb-[10px]">
                    Concerns :
                  </div>
                  <ul className="px-[20px] list-disc">
                    {concerns.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="text-sm  text-[#070707] pb-[8px]"
                        >
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {streets_alpha_rating && (
                <div>
                  <div className="text-[18px] font-medium text-[#070707] mb-[10px]">
                    Ratings :
                  </div>
                  <ul className="px-[20px] list-disc">
                    {streets_alpha_rating.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="text-sm  text-[#070707] pb-[8px]"
                        >
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {ai_forecast && (
                <div>
                  <div className="text-[18px] font-medium text-[#070707] mb-[10px]">
                    AI Forecast :
                  </div>
                  <div className="bg-[#fffefe] border border-[#D9D9D9] text-sm  text-[#070707] rounded px-[14px] py-[11px]">
                    {ai_forecast}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-[30px]">
              <CustomRadarChart ticker={ticker} />
              <div>
                <Link
                  href={`/dashboard/analytics/graph/${symbol}`}
                  className=" max-w-[120px] w-full flex items-center justify-center gap-[8px] rounded-[26px] border-[1px] border-[#000] px-[10px] py-[5px]"
                >
                  <span className="inline-flex items-center w-full max-w-[13px] my-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_858_507)">
                        <path
                          d="M1.92969 6.09375C2.23695 6.09375 2.51506 5.97047 2.72057 5.7725L3.84797 6.33615C3.84232 6.38207 3.83398 6.4272 3.83398 6.47461C3.83398 7.10461 4.34656 7.61719 4.97656 7.61719C5.60657 7.61719 6.11914 7.10461 6.11914 6.47461C6.11914 6.29876 6.0759 6.13412 6.00459 5.98515L7.53397 4.45576C7.68295 4.52707 7.84759 4.57031 8.02344 4.57031C8.65344 4.57031 9.16602 4.05774 9.16602 3.42773C9.16602 3.30911 9.14271 3.19694 9.10899 3.08932L10.4378 2.09294C10.6191 2.21404 10.8364 2.28516 11.0703 2.28516C11.7003 2.28516 12.2129 1.77258 12.2129 1.14258C12.2129 0.512573 11.7003 0 11.0703 0C10.4403 0 9.92773 0.512573 9.92773 1.14258C9.92773 1.2612 9.95104 1.37337 9.98476 1.48099L8.65592 2.47737C8.47462 2.35627 8.25731 2.28516 8.02344 2.28516C7.39343 2.28516 6.88086 2.79773 6.88086 3.42773C6.88086 3.60358 6.9241 3.76823 6.99541 3.9172L5.46603 5.44659C5.31705 5.37527 5.15241 5.33203 4.97656 5.33203C4.6693 5.33203 4.39119 5.45531 4.18568 5.65328L3.05828 5.08963C3.06393 5.04371 3.07227 4.99858 3.07227 4.95117C3.07227 4.32117 2.55969 3.80859 1.92969 3.80859C1.29968 3.80859 0.787109 4.32117 0.787109 4.95117C0.787109 5.58118 1.29968 6.09375 1.92969 6.09375Z"
                          fill="#070707"
                        />
                        <path
                          d="M12.6191 12.2383H12.2129V4.18945C12.2129 3.97899 12.0425 3.80859 11.832 3.80859H10.3086C10.0981 3.80859 9.92773 3.97899 9.92773 4.18945V12.2383H9.16602V6.47461C9.16602 6.26414 8.99562 6.09375 8.78516 6.09375H7.26172C7.05125 6.09375 6.88086 6.26414 6.88086 6.47461V12.2383H6.11914V9.52148C6.11914 9.31102 5.94875 9.14062 5.73828 9.14062H4.21484C4.00438 9.14062 3.83398 9.31102 3.83398 9.52148V12.2383H3.07227V7.99805C3.07227 7.78758 2.90187 7.61719 2.69141 7.61719H1.16797C0.957504 7.61719 0.787109 7.78758 0.787109 7.99805V12.2383H0.380859C0.170395 12.2383 0 12.4087 0 12.6191C0 12.8296 0.170395 13 0.380859 13H12.6191C12.8296 13 13 12.8296 13 12.6191C13 12.4087 12.8296 12.2383 12.6191 12.2383Z"
                          fill="#070707"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_858_507">
                          <rect width="13" height="13" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  <span className="text-[16px] text-[#070707]">All Chart</span>
                </Link>
              </div>{" "}
              <ChatBox name={company_name} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#070707]"></div>
          </div>
        </>
      )}
    </>
  );
};

export default SingleInfoPage;
