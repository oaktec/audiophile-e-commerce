import api from "@/api/api";
import { Link } from "@/components/common/Link";
import { TypographyDescription } from "@/components/common/Typography";
import { AnimatedProgressIcon, UserIcon } from "@/components/icons/Icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDropDown: FC = () => {
  const [userDropDownOpen, setUserDropDownOpen] = useState(false);
  const { isLoggedIn, checkSession, user } = useUser();
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    setLoggingOut(true);
    api
      .post("/auth/logout")
      .then(() => {
        setUserDropDownOpen(false);
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
    <DropdownMenu
      modal={false}
      open={userDropDownOpen}
      onOpenChange={() => {
        setUserDropDownOpen(!userDropDownOpen);
      }}
    >
      <DropdownMenuTrigger>
        <UserIcon interactive />
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={32} className="z-[70] px-8 py-4">
        <div className="flex w-full flex-col items-center gap-4">
          {isLoggedIn ? (
            <>
              <TypographyDescription className="text-xs text-black opacity-100">
                Logged in as {user?.email}
              </TypographyDescription>
              <Link
                variant="plain"
                className="text-black underline"
                href="/orders"
              >
                Your Orders
              </Link>
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
  );
};

export default UserDropDown;
