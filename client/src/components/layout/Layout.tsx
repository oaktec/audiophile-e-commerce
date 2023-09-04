import { cn } from "@/lib/utils";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import FormLayout from "./FormLayout";
import Header from "./header/Header";

interface LayoutProps {
  isForm?: boolean;
}

const Layout: FC<LayoutProps> = ({ isForm }) => {
  return (
    <div className="flex min-h-[100dvh] flex-col font-manrope">
      <Header />
      <main className={cn("flex-1", isForm ? "bg-gray-100" : "")}>
        {isForm ? (
          <FormLayout>
            <Outlet />
          </FormLayout>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
