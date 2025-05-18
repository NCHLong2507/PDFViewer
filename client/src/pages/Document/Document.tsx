import NavBar from "../../components/NavBar";
import { Outlet } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageNotFound from '../PageNotFound';
export default function Document () {
  if (location.pathname === "/document") {
    return <PageNotFound />;
  }

  const {checkAuthorization} = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const authorized = await checkAuthorization();
      if (!authorized) {
        navigate("/auth/login", { replace: true });
      }
    };

    checkAuth();
  }, []);

  return (
    <>
      <NavBar/>
      <Outlet/>
    </>
  )
}
