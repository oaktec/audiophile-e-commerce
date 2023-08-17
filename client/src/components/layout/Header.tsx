import { FC } from "react";

import { CATEGORIES } from "@/config/config";
import { Link } from "../common/Link";
import { CartIcon, HamburgerIcon, MainLogo, UserIcon } from "../icons/Icons";

const Header: FC = () => {
  return (
    <header className="fixed z-50 w-full bg-dark-background">
      <div className="container flex items-center justify-between border-b border-white border-opacity-10 px-6 py-8 sm:px-10">
        <HamburgerIcon className="lg:hidden" interactive />
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
          <Link href="/audiophile-e-commerce/login">
            <UserIcon interactive />
          </Link>
          <Link href="/audiophile-e-commerce/cart">
            <CartIcon interactive />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
