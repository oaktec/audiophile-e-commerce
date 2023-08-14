import { FC } from "react";

import CartIcon from "@/assets/shared/desktop/icon-cart.svg";
import Logo from "@/assets/shared/desktop/logo.svg";
import HamburgerIcon from "@/assets/shared/tablet/icon-hamburger.svg";

const Header: FC = () => {
  return (
    <header className="w-full bg-dark-background">
      <div className="container flex items-center justify-between border-b border-white border-opacity-10 px-6 py-8">
        <img className="lg:hidden" src={HamburgerIcon} alt="logo" />
        <img src={Logo} alt="logo" />
        <img src={CartIcon} alt="cart" />
      </div>
    </header>
  );
};

export default Header;
