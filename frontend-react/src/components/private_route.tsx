import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../lib/providers/auth-provider";

const PrivateRoutes = () => {
  let { email } = useAuth();
  console.log("email: ", email);
  return email ? <Outlet /> : <Navigate to="/auth-page" />;
};

export default PrivateRoutes;
