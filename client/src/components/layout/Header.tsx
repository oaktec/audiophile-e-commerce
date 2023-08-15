import { FC } from "react";

import Logo from "@/assets/shared/desktop/logo.svg";
import { Link } from "../common/Link";
import { CartIcon, HamburgerIcon, UserIcon } from "../icons/Icons";

const Header: FC = () => {
  return (
    <header className="w-full bg-dark-background">
      <div className="container flex items-center justify-between border-b border-white border-opacity-10 px-6 py-8">
        <HamburgerIcon className="lg:hidden" interactive />
        <img src={Logo} alt="logo" />
        <div className="hidden items-center space-x-9 lg:flex">
          <Link href="#" variant="navbar">
            Home
          </Link>
          <Link href="#" variant="navbar">
            Headphones
          </Link>
          <Link href="#" variant="navbar">
            Speakers
          </Link>
          <Link href="#" variant="navbar">
            Earphones
          </Link>
        </div>
        <div className="flex space-x-9">
          <UserIcon interactive />
          <CartIcon interactive />
        </div>
      </div>
    </header>
  );
};

export default Header;
