import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Logomark from '../../components/Logomark';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PageNotFound from '../PageNotFound';
import { Toaster } from "react-hot-toast";

export default function Authentication() {
  if (location.pathname === "/document") {
    return <PageNotFound />;
  }

  const {checkAuthorization} = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const authorized = await checkAuthorization();
      if (authorized) {
        navigate("/document/documentlist", { replace: true });
      }
    };

    checkAuth();
  }, []);
  return (
    <div className="bg-auth flex flex-row justify-between">
      <Toaster />
      <Logomark/>
      <Outlet/>
    </div>
  )
}