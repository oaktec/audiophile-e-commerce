import Categories from "@/components/common/Categories";
import { CATEGORIES } from "@/config/config";
import { useUser } from "@/hooks/useUser";
import { FC } from "react";
import { Link } from "../../common/Link";
import { CartIcon, HamburgerIcon, MainLogo } from "../../icons/Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import UserDropDown from "./UserDropDown";

const Header: FC = () => {
  const { hasCart } = useUser();

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
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger disabled={!hasCart}>
                <CartIcon
                  interactive
                  className={
                    !hasCart
                      ? "cursor-not-allowed opacity-20 hover:text-white"
                      : ""
                  }
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={32}
                className="z-[70] px-8 py-4"
              ></DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
