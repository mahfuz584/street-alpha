"use client";

const SocialSignIn = ({ isSignIn }) => {
  const handleSocialLogin = (provider) => {
    window.location.href = `/backend/auth/redirect/${provider}`;
  };
  return (
    <div className=" flex flex-col w-full xl:gap-[10px] gap-[7px]">
      <button
        onClick={() => {
          handleSocialLogin("google");
        }}
        className="w-full grid grid-cols-[13px_1fr] justify-center gap-[auto] items-center px-[20px] xl:py-[10px] py-[7px] rounded-[35px] bg-[#fff] border-[0.5px] border-[#DFDFE4] text-center"
      >
        <span className="inline-flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
          >
            <path
              d="M2.88122 7.85623L2.42868 9.5456L0.774681 9.58059C0.280377 8.66376 0 7.6148 0 6.5001C0 5.42219 0.262146 4.4057 0.726817 3.51066H0.727173L2.1997 3.78063L2.84475 5.24432C2.70974 5.63792 2.63616 6.06044 2.63616 6.5001C2.63621 6.97726 2.72264 7.43444 2.88122 7.85623Z"
              fill="#FBBB00"
            />
            <path
              d="M12.8867 5.28565C12.9613 5.67887 13.0002 6.08496 13.0002 6.49999C13.0002 6.96537 12.9513 7.41933 12.8581 7.85721C12.5417 9.34728 11.7148 10.6484 10.5694 11.5692L10.5691 11.5688L8.71434 11.4742L8.45184 9.83552C9.21187 9.38979 9.80584 8.69225 10.1187 7.85721H6.64282V5.28565H10.1694H12.8867Z"
              fill="#518EF8"
            />
            <path
              d="M10.5682 11.5688L10.5686 11.5691C9.45459 12.4645 8.0395 13.0002 6.49908 13.0002C4.0236 13.0002 1.87136 11.6166 0.773438 9.58045L2.87997 7.85608C3.42892 9.32114 4.84221 10.3641 6.49908 10.3641C7.21124 10.3641 7.87844 10.1715 8.45095 9.83546L10.5682 11.5688Z"
              fill="#28B446"
            />
            <path
              d="M10.6492 1.49625L8.54338 3.22025C7.95086 2.84989 7.25045 2.63594 6.50007 2.63594C4.80569 2.63594 3.36597 3.7267 2.84452 5.24429L0.726918 3.51064H0.726562C1.80841 1.42482 3.98779 -0.000247955 6.50007 -0.000247955C8.07728 -0.000247955 9.52343 0.561573 10.6492 1.49625Z"
              fill="#F14336"
            />
          </svg>
        </span>
        <span className="md:text-[16px] text-[14px] leading-normal text-[#070707] tracking-normal xl:tracking-[-0.96px]">
          {isSignIn ? " Sign in with Google" : " Sign up with Google"}
        </span>
      </button>
      <button
        onClick={() => {
          handleSocialLogin("facebook");
        }}
        className="w-full grid grid-cols-[13px_1fr] gap-[auto] justify-center items-center px-[20px]  xl:py-[10px] py-[7px] rounded-[35px] bg-[#fff] border-[0.5px] border-[#DFDFE4] text-center"
      >
        <span className="inline-flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="17"
            viewBox="0 0 8 17"
            fill="none"
          >
            <path
              d="M5.19244 16.2021V9.17604H7.54987L7.90355 6.43703H5.19244V4.68858C5.19244 3.89582 5.41168 3.35556 6.54978 3.35556L7.99897 3.35497V0.905104C7.74835 0.872535 6.88808 0.797867 5.8868 0.797867C3.79598 0.797867 2.36457 2.07408 2.36457 4.41731V6.43703H0V9.17604H2.36457V16.2021H5.19244Z"
              fill="#518EF8"
            />
          </svg>
        </span>
        <span className="md:text-[16px] text-[14px] leading-normal text-[#070707] text-center tracking-normal xl:tracking-[-0.96px]">
          {isSignIn ? " Sign in with Facebook" : " Sign up with Facebook"}
        </span>
      </button>
    </div>
  );
};

export default SocialSignIn;
