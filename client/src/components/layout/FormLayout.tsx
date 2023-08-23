import { FC } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "../common/Link";

interface FormLayoutProps {
  children: React.ReactNode;
}

const FormLayout: FC<FormLayoutProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-[89px] px-6 py-4 sm:px-10 sm:py-12">
      <Link variant="go-back" onClick={() => navigate(-1)} className="mb-6">
        Go Back
      </Link>
      <Outlet />
    </div>
  );
};

export default FormLayout;
