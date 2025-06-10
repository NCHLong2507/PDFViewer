import NavBar from "../components/Header/Header";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Document() {

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
