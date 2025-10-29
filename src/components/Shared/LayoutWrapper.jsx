"use client";
import Footer from "@/components/Shared/Footer";
import Navbar from "@/components/Shared/Navbar";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const hideFooterRoutes = ["/signin", "/dashboard", "/reset-password"];
  const hideNavRoutes = ["/dashboard", "/reset-password"];
  const shouldHideFooter = hideFooterRoutes.some((route) =>
    pathname.startsWith(route.replace("/:*", ""))
  );
  const shouldHideNav = hideNavRoutes.some((route) =>
    pathname.startsWith(route.replace("/:*", ""))
  );

  return (
    <>
      {!shouldHideNav && <Navbar />}
      {children}
      {!shouldHideFooter && <Footer />}
    </>
  );
}
