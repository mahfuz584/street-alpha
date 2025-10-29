import React from "react";
import Link from "next/link";

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="pb-[16px]">
      <div className="sa-container">
        <div className="w-full md:py-[25px] py-[15px]">
          <img
            className="max-w-[100%]"
            src="/assets/images/streets-alpha-text.svg"
            alt=""
          />
        </div>
        <div className="w-full bg-[#070707] rounded-[10px]">
          <div className="w-full flex flex-wrap py-[34px] sm:px-[45px] px-[25px] text-[#F1F4F2] juctify-between 2xl:gap-[100px] lg:gap-[60px] gap-[40px] lg:flex-row flex-col border-b-[0.5px] border-[#DFDFE4]">
            <div className="w-full max-w-[295px] mx-auto">
              <p className="text pb-[16px]">Stay ahead with weekly insights</p>

              <div className="bg-[#fff] border-[0.5px] border-[#DFDFE4] rounded-[4px]">
                <div className="flex items-center gap-[5px] py-[5px] pr-[3px] rounded-[4px] border-[0.5px] border-[#DFDFE4]">
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full rounded-[4px] bg-[#fff] py-[5px] px-[10px] placeholder:text-[#A1A1A1] placeholder:text-[14px] text-[14px] text-[#070707] border-none outline-none"
                  />
                  <button className="py-[8px] px-[15px] bg-[#070707] rounded-[4px] text-[#F1F4F2] text-[14px] leading-[1.5] flex items-center gap-[5px] justify-center hover:bg-[#1f1f1f]">
                    Subscribe
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
                </div>
              </div>
            </div>

            <div className="w-full flex-1">
              <div className="flex flex-wrap sm:flex-row flex-col gap-[20px] sm:justify-between items-center">
                <Link href="">Features</Link>
                <Link href="">About</Link>
                <Link href="/signin">Sign in</Link>
                <Link href="">Term & Conditions</Link>
                <Link
                  href="mailto:hello@streetsalpha.ai"
                  className="flex gap-[5px] items-center"
                >
                  hello@streetsalpha.ai
                  <span className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M8.33624 2.84003L1.17628 10L0 8.82373L7.15913 1.66376H0.849348V0H10V9.15065H8.33624V2.84003Z"
                        fill="#F1F4F2"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full flex-wrap-reverse flex gap-x-[45px] gap-y-[15px] items-center sm:justify-between justify-center py-[13px] sm:px-[45px] px-[20px]">
            <p className="text-[14px] leading-[1.5] text-[#DFDFE4]">
              &copy; {year}, Streets Alpha. All rights reserved
            </p>

            <ul className="flex items-center gap-[10px] list-none">
              <li>
                <Link href="" target="_blank">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_131_434)">
                        <path
                          d="M12.5 0C10.0277 0 7.61099 0.733112 5.55538 2.10663C3.49976 3.48015 1.89761 5.43238 0.951511 7.71646C0.00541602 10.0005 -0.242126 12.5139 0.24019 14.9386C0.722505 17.3634 1.91301 19.5907 3.66117 21.3388C5.40933 23.087 7.63661 24.2775 10.0614 24.7598C12.4861 25.2421 14.9995 24.9946 17.2835 24.0485C19.5676 23.1024 21.5199 21.5002 22.8934 19.4446C24.2669 17.389 25 14.9723 25 12.5C25 9.18479 23.683 6.00537 21.3388 3.66117C18.9946 1.31696 15.8152 0 12.5 0ZM8.86514 19.0789H6.13816V10.2944H8.86514V19.0789ZM7.50001 9.0954C7.18617 9.09669 6.87899 9.00492 6.6173 8.83167C6.35561 8.65842 6.15115 8.41148 6.02978 8.12206C5.9084 7.83264 5.87556 7.51373 5.93539 7.20565C5.99522 6.89756 6.14505 6.61413 6.36593 6.39118C6.58681 6.16823 6.86883 6.01577 7.17635 5.95307C7.48386 5.89036 7.80306 5.92024 8.0936 6.03891C8.38414 6.15758 8.63298 6.35973 8.80866 6.61979C8.98433 6.87985 9.07897 7.18616 9.0806 7.5C9.08148 7.92084 8.9157 8.3249 8.61952 8.62386C8.32333 8.92282 7.92083 9.09235 7.50001 9.0954ZM19.079 19.0789H16.3536V14.8026C16.3536 13.7829 16.3339 12.4753 14.9359 12.4753C13.5378 12.4753 13.2911 13.5839 13.2911 14.7286V19.0789H10.5757V10.2944H13.1924V11.4918H13.2303C13.5938 10.801 14.4836 10.0724 15.8109 10.0724C18.5707 10.0724 19.079 11.8914 19.079 14.2533V19.0789Z"
                          fill="#F1F4F2"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_131_434">
                          <rect width="25" height="25" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </Link>
              </li>

              <li>
                <Link href="" target="_blank">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_131_439)">
                      <path
                        d="M12.5 0C5.59668 0 0 5.59668 0 12.5C0 19.4033 5.59668 25 12.5 25C19.4033 25 25 19.4033 25 12.5C25 5.59668 19.4033 0 12.5 0Z"
                        fill="white"
                      />
                      <path
                        d="M13.8676 11.3689L19.2187 5.14868H17.9506L13.3042 10.5496L9.59322 5.14868H5.31299L10.9248 13.3158L5.31299 19.8387H6.5811L11.4878 14.1351L15.4069 19.8387H19.6871L13.8672 11.3689H13.8676ZM7.03801 6.10331H8.98575L17.9512 18.9275H16.0035L7.03801 6.10331Z"
                        fill="#070707"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_131_439">
                        <rect width="25" height="25" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
