import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Logomark from "../../components/Authentication/Logomark";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PageNotFound from "../PageNotFound";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useLocation } from "react-router-dom";

import LoadingAnimation from "../../components/Common/LoadingAnimation";
export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
export default function Authentication() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const isLoading = useSelector((state: RootState) => state.editor.isLoading);
  const location = useLocation();
  if (location.pathname === "/document") {
    return <PageNotFound />;
  }
  const { checkAuthorization } = useAuth();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const invitationToken = searchParams.get("invitation_token");

  useEffect(() => {
    const checkAuth = async () => {
      const authorized = await checkAuthorization(invitationToken);
      if (authorized.directURL) {
        console.log("ABC")
        return navigate(authorized.directURL, { replace: true }); 
      }
      if (authorized.status) {
        navigate("/document/documentlist", { replace: true });
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isCheckingAuth) return null;
  return (
    <div className="bg-auth flex flex-row items-center justify-end">
      {isLoading && (
        <LoadingAnimation
          className="w-10 h-10 border-4 border-yellow-400"
          position="absolute top-4"
        />
      )}
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "#ffffff",
              color: "#3fc66b",
              border: "1.5px solid #3bc368",
              padding: "14px 16px",
              fontSize: "14px",
            },
            iconTheme: {
              primary: "#3fc66b",
              secondary: "#ffffff",
            },
          },
          error: {
            style: {
              background: "#ffffff",
              color: "#e74c3c",
              border: "1px solid #e74c3c",
            },
            iconTheme: {
              primary: "#e74c3c",
              secondary: "#ffffff",
            },
          },
        }}
      />
      <Logomark />
      <Outlet />
    </div>
  );
}
