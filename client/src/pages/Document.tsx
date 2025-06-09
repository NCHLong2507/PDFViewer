import NavBar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageNotFound from "./PageNotFound";
export default function Document() {
  const location = useLocation();

  if (location.pathname === "/document") {
    return <PageNotFound />;
  }

  const { checkAuthorization } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const authorized = await checkAuthorization(null);
      if (!authorized.status && !authorized.directURL) {
        navigate("/auth/login", { replace: true });
      }
    };

    checkAuth();
  }, []);

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
