import Image from "next/image";
import Link from "next/link";
import TitleComponent from "./TitleComponent";
import ListItemComponent from "./ListItemComponent";

const AnalyticsCard = ({ analyticData }) => {
  const { id, ticker, positives, risks, prediction } = analyticData;

  return (
    <Link
      href={`/dashboard/analytics/${id}`}
      className="w-full h-full flex flex-col justify-between rounded-[4px] border border-[#EFEFEF] bg-white shadow-md px-6 py-5"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-[50px] h-[50px]">
          <Image
            src="/assets/images/dashboard-company/demoIcon.svg"
            alt="company"
            fill
            className="rounded object-cover object-center"
          />
        </div>
        <div>
          <div className="text-black text-base font-medium">NVDA</div>
          <div className="text-[#555] text-sm">{ticker}</div>
        </div>
      </div>
      <div className="mb-5">
        <TitleComponent
          title="Positives"
          color="text-[#2E7D32]"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="11"
              viewBox="0 0 14 11"
              fill="none"
            >
              <path
                d="M12.1371 0.259277L5.00394 6.58025L1.98726 3.50521L-0.00830078 5.29136L4.8653 10.2593L13.9917 2.17949L12.1371 0.259277Z"
                fill="#2E7D32"
              />
            </svg>
          }
        />
        <ul className="flex flex-col gap-2">
          {positives.map((item, idx) => (
            <ListItemComponent key={idx} iconColor="#2E7D32" text={item} />
          ))}
        </ul>
      </div>

      <div className="mb-5">
        <TitleComponent
          title="Risks"
          color="text-[#FB2B3A]"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="10"
              viewBox="0 0 11 10"
              fill="none"
            >
              <g clipPath="url(#clip0_806_1359)">
                <path
                  d="M1.38186 9.74286H8.90489C9.25241 9.74286 9.56833 9.56515 9.74999 9.26502C9.9277 8.96884 9.93955 8.60552 9.77763 8.29749L5.78905 0.652043C5.66268 0.411148 5.41783 0.257133 5.1414 0.257133C4.86891 0.257133 4.62012 0.407199 4.49375 0.652043L0.505159 8.29749C0.343246 8.60552 0.355094 8.96884 0.536752 9.26502C0.718411 9.56515 1.03434 9.74286 1.38186 9.74286ZM4.70045 3.51922H5.58235C5.72925 3.51922 5.8433 3.64732 5.8263 3.79323L5.5616 6.06639C5.54718 6.19021 5.4423 6.28359 5.31764 6.28359H4.96515C4.8405 6.28359 4.73561 6.19021 4.7212 6.06639L4.45649 3.79323C4.4395 3.64732 4.55355 3.51922 4.70045 3.51922ZM5.1414 6.97463C5.57792 6.97463 5.93508 7.33179 5.93508 7.76831C5.93508 8.20484 5.57792 8.562 5.1414 8.562C4.70487 8.562 4.34772 8.20484 4.34772 7.76831C4.34772 7.33179 4.70487 6.97463 5.1414 6.97463Z"
                  fill="#FB2B3A"
                />
              </g>
              <defs>
                <clipPath id="clip0_806_1359">
                  <rect
                    width="10"
                    height="10"
                    fill="white"
                    transform="translate(0.141602)"
                  />
                </clipPath>
              </defs>
            </svg>
          }
        />
        <ul className="flex flex-col gap-2">
          {risks.map((item, idx) => (
            <ListItemComponent key={idx} iconColor="#FB2B3A" text={item} />
          ))}
        </ul>
      </div>

      <div className="bg-[#F5F5F5] border border-[#D9D9D9] rounded p-4">
        <TitleComponent
          title="Forecast & Guidance"
          color="text-black"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
            >
              <defs>
                <clipPath id="clip0_805_261">
                  <rect
                    width="16.0945"
                    height="14.5185"
                    fill="white"
                    transform="translate(0.338867 0.666626)"
                  />
                </clipPath>
                <mask
                  id="mask0_805_261"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="17"
                  height="16"
                >
                  <path
                    d="M0.338867 0.666626H16.4334V15.1851H0.338867V0.666626Z"
                    fill="white"
                  />
                </mask>
              </defs>
              <g clipPath="url(#clip0_805_261)">
                <g mask="url(#mask0_805_261)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.2369 3.86853C16.4988 4.10477 16.4988 4.48779 16.2369 4.72404L9.8662 10.4709C9.60433 10.7072 9.1797 10.7072 8.91783 10.4709L6.039 7.87401L1.48366 11.9833C1.22177 12.2195 0.797169 12.2195 0.535282 11.9833C0.273395 11.7471 0.273395 11.364 0.535282 11.1278L5.56481 6.59075C5.8267 6.35451 6.2513 6.35451 6.51319 6.59075L9.39202 9.18769L15.2886 3.86853C15.5504 3.63229 15.9751 3.63229 16.2369 3.86853Z"
                    fill="#070707"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.0684 4.29628C11.0684 3.96219 11.3686 3.69135 11.739 3.69135H15.7626C16.133 3.69135 16.4332 3.96219 16.4332 4.29628V7.92591C16.4332 8.26002 16.133 8.53085 15.7626 8.53085C15.3922 8.53085 15.092 8.26002 15.092 7.92591V4.90122H11.739C11.3686 4.90122 11.0684 4.63038 11.0684 4.29628Z"
                    fill="#070707"
                  />
                </g>
              </g>
            </svg>
          }
        />
        <ul className="flex flex-col gap-2 mt-2">
          {prediction.map((item, idx) => (
            <ListItemComponent key={idx} iconColor="#070707" text={item} />
          ))}
        </ul>
      </div>
    </Link>
  );
};

export default AnalyticsCard;
