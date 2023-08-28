import Categories from "@/components/common/Categories";
import { CATEGORIES } from "@/config/config";
import { FC } from "react";
import { Link } from "../../common/Link";
import { HamburgerIcon, MainLogo } from "../../icons/Icons";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import CartDropDown from "./CartDropDown";
import UserDropDown from "./UserDropDown";

const Header: FC = () => {
  return (
    <header className="fixed z-[60] w-full bg-dark-background">
      <div className="container">
        <div className="mx-6 flex items-center justify-between border-b border-white border-opacity-10 py-8 sm:mx-10">
          <Sheet>
            <SheetTrigger asChild>
              <button className="lg:hidden">
                <HamburgerIcon interactive />
              </button>
            </SheetTrigger>
            <SheetContent side="top" className="top-[89px]">
              <Categories type="menu" />
            </SheetContent>
          </Sheet>
          <Link href="/">
            <MainLogo />
          </Link>
          <div className="hidden items-center space-x-9 lg:flex">
            <Link href="/" variant="navbar">
              Home
            </Link>
            {CATEGORIES.map((category) => (
              <Link
                href={`/category/${category}`}
                variant="navbar"
                key={category}
              >
                {category}
              </Link>
            ))}
          </div>
          <div className="flex space-x-9">
            <UserDropDown />
            <CartDropDown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
