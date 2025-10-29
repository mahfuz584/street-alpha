"use client";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
const DashboardMenu = ({ collapsed, isSpecialPage }) => {
  const { data: session } = useSession();
  const user = session?.user;
  // console.log("users:", user);

  //handle logout
  const handleLogout = () => {
    if (user.accessToken) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/signout`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }
        )
        .then((response) => {
          console.log("successfully logout", response.data);
          signOut({ callbackUrl: "/" });
        })
        .catch((error) => {
          console.log("Not Logout", error);
        });
    }
  };

  return (
    <div
      className={`${
        collapsed || isSpecialPage
          ? "dashboard-collapsed"
          : "dashboard-container"
      } border-b border-[0.75px] border-[#DFDFE4]`}
    >
      <div className="navbar bg-[#F9F9F9] border-b-[0.75px] border-[#DFDFE4] py-[20px]">
        <div className="flex ml-auto items-center gap-2">
          <div className="dropdown dropdown-end">
            {/* <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost border-0 bg-transparent shadow-none btn-circle"
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="21"
                  viewBox="0 0 18 21"
                  fill="none"
                >
                  <path
                    d="M16.7955 14.6582C15.4851 13.5506 14.7337 11.9316 14.7337 10.2164V7.80014C14.7337 4.75028 12.4681 2.22564 9.53356 1.8027V0.866682C9.53356 0.387407 9.14529 0 8.66688 0C8.18847 0 7.8002 0.387407 7.8002 0.866682V1.8027C4.86475 2.22564 2.60011 4.75028 2.60011 7.80014V10.2164C2.60011 11.9316 1.84869 13.5506 0.53047 14.6651C0.193331 14.9537 6.10352e-05 15.3732 6.10352e-05 15.8169C6.10352e-05 16.6533 0.680406 17.3336 1.51675 17.3336H15.817C16.6534 17.3336 17.3337 16.6533 17.3337 15.8169C17.3337 15.3732 17.1404 14.9537 16.7955 14.6582Z"
                    fill="#555555"
                  />
                  <path
                    d="M8.66692 20.8004C10.2365 20.8004 11.5495 19.6815 11.8511 18.2003H5.48273C5.78433 19.6815 7.09736 20.8004 8.66692 20.8004Z"
                    fill="#555555"
                  />
                </svg>
                <span className="badge badge-sm indicator-item p-[4px] rounded-[50%]">
                  11
                </span>
              </div>
            </div> */}
            <div
              tabIndex={0}
              className="card card-compact dropdown-content bg-white  z-1 mt-3 w-[180px] shadow"
            >
              <div className="card-body p-0 gap-0">
                <Link
                  href="#"
                  className=" border-b border-[rgba(0,0,0,.08)] block overflow-hidden text-ellipsis whitespace-nowrap px-2 py-[6px] text-[16px] font-medium hover:bg-[#070707] hover:text-[#fff] ]"
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
                  illo iusto consequuntur nemo voluptatibus atque doloremque
                  consectetur minus optio corrupti?
                </Link>
                <Link
                  href="#"
                  className=" border-b border-[rgba(0,0,0,.08)] block overflow-hidden text-ellipsis whitespace-nowrap px-2 py-[6px] text-[16px] font-medium hover:bg-[#070707] hover:text-[#fff] "
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
                  illo iusto consequuntur nemo voluptatibus atque doloremque
                  consectetur minus optio corrupti?
                </Link>
                <Link
                  href="#"
                  className="border-b-0 border-[rgba(0,0,0,.08)] block overflow-hidden text-ellipsis whitespace-nowrap px-2 py-[6px] text-[16px] font-medium hover:bg-[#070707] hover:text-[#fff] "
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
                  illo iusto consequuntur nemo voluptatibus atque doloremque
                  consectetur minus optio corrupti?
                </Link>
              </div>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost border-0 shadow-none bg-transparent btn-circle hover:border-0 hover:cursor-pointer hover:shadow-none avatar"
            >
              <div className="w-full max-w-[40px] rounded-full">
                <img
                  alt="User Image"
                  src={
                    user?.image || "/assets/images/dashboard-icons/user-bg.png"
                  }
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu p-0 menu-sm dropdown-content bg-[#fff] rounded-box z-9 mt-3 w-52  shadow"
            >
              <li>
                <div className="text-[16px] hover:bg-[#070707] hover:text-[#fff] font-medium text-center text-[#070707] capitalize">
                  {user ? user?.name : "Vini"}
                </div>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-[16px] hover:bg-[#070707] hover:text-[#fff]  font-semibold text-[#070707] text-center"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMenu;
