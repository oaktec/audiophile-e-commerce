import { FC, useState } from "react";

import api from "@/api/api";
import Categories from "@/components/common/Categories";
import { CATEGORIES } from "@/config/config";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { Link } from "../common/Link";
import { TypographyDescription } from "../common/Typography";
import {
  AnimatedProgressIcon,
  CartIcon,
  HamburgerIcon,
  MainLogo,
  UserIcon,
} from "../icons/Icons";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useToast } from "../ui/use-toast";

const Header: FC = () => {
  const { isLoggedIn, checkSession, user } = useUser();
  const navigate = useNavigate();

  const { toast } = useToast();

  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    api
      .post("/auth/logout")
      .then(() => {
        setDropDownOpen(false);
        checkSession().then(() => {
          navigate("/");
          toast({
            variant: "success",
            description: "User logged out",
          });
        });
      })
      .catch((err) =>
        toast({
          variant: "destructive",
          description: err.message,
        }),
      )
      .finally(() => {
        setLoggingOut(false);
      });
  };

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
            <DropdownMenu
              modal={false}
              open={dropDownOpen}
              onOpenChange={() => {
                setDropDownOpen(!dropDownOpen);
              }}
            >
              <DropdownMenuTrigger>
                <UserIcon interactive />
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={32} className="z-[70] px-8 py-4">
                <div className="flex w-full flex-col items-center gap-4">
                  {isLoggedIn ? (
                    <>
                      <TypographyDescription className="text-black opacity-100">
                        Logged in as {user?.email}
                      </TypographyDescription>
                      <Button onClick={handleLogout} disabled={loggingOut}>
                        {loggingOut ? <AnimatedProgressIcon /> : "Log out"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link variant="button" href="/login">
                        Login
                      </Link>
                      <div className="flex flex-col">
                        <TypographyDescription className="text-black opacity-100">
                          New Customer?
                        </TypographyDescription>
                        <Link href="/signup">Register</Link>
                      </div>
                    </>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/cart">
              <CartIcon interactive />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
