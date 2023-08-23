import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "../common/Link";

interface FormLayoutProps {
  children: React.ReactNode;
}

const FormLayout: FC<FormLayoutProps> = () => {
  return (
    <div className="container mt-[89px] px-6 py-4 sm:px-10 sm:py-12">
      <Link variant="go-back" href="/" className="mb-6">
        Go Back
      </Link>
      <Outlet />
    </div>
  );
};

export default FormLayout;
