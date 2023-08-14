import { FC } from "react";

import Logo from "@/assets/shared/desktop/logo.svg";
import { CartIcon, HamburgerIcon } from "../icons/Icons";

const Header: FC = () => {
  return (
    <header className="w-full bg-dark-background">
      <div className="container flex items-center justify-between border-b border-white border-opacity-10 px-6 py-8">
        <HamburgerIcon className="cursor-pointer fill-white hover:fill-accent lg:hidden" />
        <img src={Logo} alt="logo" />
        <CartIcon className="cursor-pointer fill-white hover:fill-accent" />
      </div>
    </header>
  );
};

export default Header;
