"use client";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();

  const isAuthed = status === "authenticated";
  const isHome = pathname === "/";

  const handleLogout = async () => {
    try {
      const token = user?.accessToken;
      if (token) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/signout`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (err) {
      console.log(
        "Signout API failed (continuing to signOut):",
        err?.message || err
      );
    } finally {
      // Always sign out from NextAuth so UI state resets
      await signOut({ callbackUrl: "/" });
    }
  };
  const handleClick = () => {
    if (!isAuthed) return router.push("/signin");
    if (isHome) return router.push("/dashboard");
    return handleLogout();
  };

  const buttonLabel = !isAuthed ? "Sign In" : isHome ? "Dashboard" : "Logout";

  return (
    <nav>
      <div className="sa-container">
        <div className="py-[12px] w-full flex justify-between items-center">
          <Link className="w-full max-w-[66px]" href="/">
            <img
              alt="logo"
              src="/assets/images/logo-light.png"
              height={55}
              width={66}
            />
          </Link>

          <button
            onClick={handleClick}
            className="px-[15px] py-[10px] border-0 shadow-none btn btn-primary bg-[#070707] rounded-[4px] grid grid-cols-[auto_13px] items-center gap-[5px]"
          >
            <span className="text-[#F1F4F2] text-[14px]">{buttonLabel}</span>
            <span className="btn-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="15"
                viewBox="0 0 14 15"
                fill="none"
              >
                <path
                  d="M6.50528 9.70897C6.45421 9.76 6.4137 9.82059 6.38605 9.88727C6.3584 9.95396 6.34416 10.0254 6.34413 10.0976C6.34411 10.1698 6.3583 10.2413 6.3859 10.308C6.4135 10.3747 6.45397 10.4353 6.505 10.4864C6.60806 10.5895 6.74786 10.6475 6.89365 10.6475C6.96584 10.6476 7.03733 10.6334 7.10404 10.6058C7.17074 10.5782 7.23136 10.5377 7.28242 10.4867L9.69299 8.07225C9.76814 7.99712 9.82775 7.90792 9.86842 7.80975C9.90909 7.71158 9.93002 7.60637 9.93002 7.5001C9.93002 7.39384 9.90909 7.28863 9.86842 7.19046C9.82775 7.09229 9.76814 7.00309 9.69299 6.92796L7.27912 4.51355C7.17405 4.42121 7.03773 4.3724 6.89793 4.37708C6.75813 4.38175 6.62537 4.43956 6.52671 4.53871C6.42805 4.63786 6.3709 4.77091 6.36692 4.91073C6.36294 5.05055 6.41242 5.18663 6.50528 5.29124L8.16289 6.9505H0.749801C0.604037 6.9505 0.464243 7.0084 0.361172 7.11147C0.2581 7.21455 0.200195 7.35434 0.200195 7.5001C0.200195 7.64587 0.2581 7.78566 0.361172 7.88874C0.464243 7.99181 0.604037 8.04971 0.749801 8.04971H8.16289L6.50528 9.70897Z"
                  fill="#F1F4F2"
                />
                <path
                  d="M11.9542 0.50296H4.92366C4.32954 0.50296 3.84644 1.0064 3.84644 1.62526V4.96796C3.84644 5.11372 3.90434 5.25352 4.00741 5.35659C4.11048 5.45966 4.25028 5.51757 4.39604 5.51757C4.54181 5.51757 4.6816 5.45966 4.78467 5.35659C4.88774 5.25352 4.94565 5.11372 4.94565 4.96796V1.62526C4.94536 1.61738 4.94666 1.60953 4.94949 1.60217H11.9295C11.9323 1.60953 11.9336 1.61738 11.9333 1.62526V13.3747C11.9336 13.3826 11.9323 13.3905 11.9295 13.3978H4.94949C4.94666 13.3905 4.94536 13.3826 4.94565 13.3747V10.032C4.94565 9.88627 4.88774 9.74647 4.78467 9.6434C4.6816 9.54033 4.54181 9.48243 4.39604 9.48243C4.25028 9.48243 4.11048 9.54033 4.00741 9.6434C3.90434 9.74647 3.84644 9.88627 3.84644 10.032V13.3747C3.84644 13.9936 4.32954 14.497 4.92366 14.497H11.9542C12.5483 14.497 13.0315 13.9936 13.0315 13.3747V1.62526C13.0315 1.0064 12.5483 0.50296 11.9542 0.50296Z"
                  fill="#F1F4F2"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
