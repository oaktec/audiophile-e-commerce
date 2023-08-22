import { FC } from "react";

import Categories from "@/components/common/Categories";
import { CATEGORIES } from "@/config/config";
import { Link } from "../common/Link";
import { TypographyDescription } from "../common/Typography";
import { CartIcon, HamburgerIcon, MainLogo, UserIcon } from "../icons/Icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const Header: FC = () => {
  return (
    <header className="fixed z-[60] w-full bg-dark-background">
      <div className="container">
        <div className="mx-6 flex items-center justify-between border-b border-white border-opacity-10 py-8 sm:mx-10">
          <Sheet>
            <SheetTrigger asChild>
              <button>
                <HamburgerIcon className="lg:hidden" interactive />
              </button>
            </SheetTrigger>
            <SheetContent side="top" className="top-[89px]">
              <Categories type="menu" />
            </SheetContent>
          </Sheet>
          <Link href="/audiophile-e-commerce/">
            <MainLogo />
          </Link>
          <div className="hidden items-center space-x-9 lg:flex">
            <Link href="/audiophile-e-commerce/" variant="navbar">
              Home
            </Link>
            {CATEGORIES.map((category) => (
              <Link
                href={`/audiophile-e-commerce/category/${category}`}
                variant="navbar"
                key={category}
              >
                {category}
              </Link>
            ))}
          </div>
          <div className="flex space-x-9">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <UserIcon interactive />
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={32} className="z-[70] px-8 py-4">
                <div className="flex w-full flex-col items-center gap-4">
                  <Link variant="button" href="/audiophile-e-commerce/login">
                    Login
                  </Link>
                  <div className="flex flex-col">
                    <TypographyDescription className="text-black opacity-100">
                      New Customer?
                    </TypographyDescription>
                    <Link href="/audiophile-e-commerce/signup">Register</Link>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/audiophile-e-commerce/cart">
              <CartIcon interactive />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
