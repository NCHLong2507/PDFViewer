import { createBrowserRouter, Navigate } from "react-router-dom";
import Authentication from "../pages/Authentication";
import LoginContainer from "../components/Authentication/Login/LoginContainer";
import SignupContainer from "../components/Authentication/Signup/SignupContainer";
import VerifyEmail from "../pages/VerifyEmail";
import SuccessVerifyEmail from "../pages/SuccessVerifyPage";
import DocumentList from "../components/DocumentList/DocumentList";
import DocumentDetailed from "../components/DocumentDetail/DocumentDetail";
import PageNotFound from "../pages/PageNotFound";
import NoPermissionPage from "../pages/NoPermissionPage";
import Document from "../pages/Document";
import TokenExpiredPage from "../pages/InvitationTokenExpired";
import VerifyTokenExpired from "../pages/VerifyTokenExpired";
const router = createBrowserRouter([
  {
    path: "/document",
    element: <Document />,
    children: [
      {
        index: true,
        element: <Navigate to="documentlist" replace />,
      },
      {
        path: "documentlist",
        element: <DocumentList />,
      },
      {
        path: "documentdetailed",
        element: <DocumentDetailed />,
      },
      {
        path: "nopermission",
        element: <NoPermissionPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Authentication />,
    children: [
      {
        path: "login",
        element: <LoginContainer />,
      },
      {
        path: "signup",
        element: <SignupContainer />,
      },
    ],
  },
  {
    path: "/verifyemail",
    element: <VerifyEmail />,
  },
  {
    path: "/successverifyemail",
    element: <SuccessVerifyEmail />,
  },
  {
    path: "/invalidToken",
    element: <TokenExpiredPage />,
  },
  {
    path: "/invalidVerifyToken",
    element: <VerifyTokenExpired />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
