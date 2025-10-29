import Link from "next/link";
import textBlocks from "@/pageData/HeroData";
import dynamic from "next/dynamic";
import { globeConfig } from "@/pageData/globeConfig";
import { sampleArcs } from "@/pageData/sampleArcs";
const World = dynamic(() => import("../ui/globe").then((m) => m.World), {
  ssr: false,
});

const HeroSection = () => {
  return (
    <>
      <div className="sa-container">
        <div className="lg:pt-[35px] pt-[60px] w-full  mx-auto flex flex-col justify-between md:gap-[25px] gap-[15px]">
          <h1 className="[leading-trim:both] [text-edge:cap] 2xl:text-[60px] leading-none tracking-normal xl:tracking-[-3.6px] xl:text-[54px] lg:text-[44px] md:text-[36px] text-[32px] text-center font-semibold">
            Wall Street Alpha to Main Street
          </h1>
          <p className="text-[16px] text-[#555] mx-auto max-w-[669px] tracking-normal xl:tracking-[-0.48px] leading-[1.6] text-center">
            Empowering everyday investors with AI-driven market insights.
            Leverage quantitative strategies and real-time news analytics
            previously reserved for institutional investors.
          </p>
          <div className="btn-container flex gap-[15px] items-center justify-center">
            <Link href={"/dashboard"}>
              <button className="p-[7px] lg:p-[10px] bg-[#070707] rounded-[4px] grid grid-cols-[auto_5px] items-center gap-[5px]">
                <span className="btn-lbl text-[#F1F4F2] text-[12px] sm:text-[14px] md:text-[16px]">
                  Unlock Alpha Now
                </span>
                <span className="btn-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="13"
                    viewBox="0 0 8 13"
                    fill="none"
                  >
                    <path
                      d="M1.80078 2.93758C1.80078 2.53815 2.1402 2.21416 2.55983 2.21416H2.84106C3.2607 2.21416 3.60012 2.53815 3.60012 2.93758V3.20501C3.60012 3.60443 3.2607 3.92843 2.84106 3.92843H2.55983C2.1402 3.92843 1.80078 3.60443 1.80078 3.20501V2.93758Z"
                      fill="#F1F4F2"
                    />
                    <path
                      d="M5.39922 8.08047C5.39922 7.68105 5.05892 7.35705 4.64016 7.35705H4.35893C3.93929 7.35705 3.599 7.68105 3.599 8.08047V8.3479C3.599 8.74733 3.93929 9.07132 4.35893 9.07132H4.64016C5.05892 9.07132 5.39922 8.74733 5.39922 8.3479V8.08047Z"
                      fill="#F1F4F2"
                    />
                    <path
                      d="M7.19994 6.36629C7.19994 5.96686 6.85964 5.64286 6.44 5.64286H6.15877C5.74001 5.64286 5.39972 5.96686 5.39972 6.36629V6.63371C5.39972 7.03314 5.74001 7.35714 6.15877 7.35714H6.44C6.85964 7.35714 7.19994 7.03314 7.19994 6.63371V6.36629Z"
                      fill="#F1F4F2"
                    />
                    <path
                      d="M3.60012 9.79467C3.60012 9.39524 3.2607 9.07124 2.84106 9.07124H2.55983C2.1402 9.07124 1.80078 9.39524 1.80078 9.79467V10.0621C1.80078 10.4615 2.1402 10.7855 2.55983 10.7855H2.84106C3.2607 10.7855 3.60012 10.4615 3.60012 10.0621V9.79467Z"
                      fill="#F1F4F2"
                    />
                    <path
                      d="M1.80022 11.5092C1.80022 11.1098 1.45992 10.7858 1.04028 10.7858H0.759053C0.340296 10.7858 0 11.1098 0 11.5092V11.7766C0 12.176 0.340296 12.5 0.759053 12.5H1.04028C1.45992 12.5 1.80022 12.176 1.80022 11.7766V11.5092Z"
                      fill="#F1F4F2"
                    />
                    <path
                      d="M1.80022 1.22339C1.80022 0.823967 1.45992 0.499969 1.04028 0.499969H0.759053C0.340296 0.499969 0 0.823967 0 1.22339V1.49082C0 1.89024 0.340296 2.21424 0.759053 2.21424H1.04028C1.45992 2.21424 1.80022 1.89024 1.80022 1.49082V1.22339Z"
                      fill="#F1F4F2"
                    />
                    <path
                      d="M5.39922 4.6521C5.39922 4.25267 5.05892 3.92867 4.64016 3.92867H4.35893C3.93929 3.92867 3.599 4.25267 3.599 4.6521V4.91952C3.599 5.31895 3.93929 5.64295 4.35893 5.64295H4.64016C5.05892 5.64295 5.39922 5.31895 5.39922 4.91952V4.6521Z"
                      fill="#F1F4F2"
                    />
                  </svg>
                </span>
              </button>
            </Link>
            <Link href={"/dashboard"}>
              <button className="p-[7px] lg:p-[10px] border border-[#070707] rounded-[4px] text-[#070707] text-[12px] sm:text-[14px] md:text-[16px]">
                Get AI-Powered Insights
              </button>
            </Link>
          </div>
        </div>
        <div className="globe-area flex justify-center max-w-[610px] 2xl:max-w-[790px] mx-auto w-full relative overflow-hidden min-h-[390px] 2xl:min-h-[490px] px-4">
          <div className="globe-container absolute w-full  z-10">
            <World data={sampleArcs} globeConfig={globeConfig} />
            <div className="text-block-container w-full flex flex-col gap-[10px]">
              {textBlocks.map((block) => (
                <div
                  key={block.id}
                  id={block.id}
                  className={`${"globe-" + block.id} absolute z-[3] ${
                    block.top
                  } ${block.left || ""} ${
                    block.right || ""
                  }  w-full max-w-[200px] rounded-[10px] xl:py-[12px] py-[6px] px-[8px] text-[12px] leading-[1.5] text-[#555] bg-white shadow-[0px_9px_30px_-16px_#A4A4A4]`}
                >
                  {block.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
