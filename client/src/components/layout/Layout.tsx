import { cn } from "@/lib/utils";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  bgColor?: string;
}

const Layout: FC<LayoutProps> = ({ bgColor }) => {
  return (
    <div className="flex min-h-screen flex-col font-manrope">
      <Header />
      <main className={cn("flex-1", bgColor || "")}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
