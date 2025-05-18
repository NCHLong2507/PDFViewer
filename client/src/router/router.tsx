import { createBrowserRouter, Navigate } from "react-router-dom";
import Authentication from "../pages/Authentication/Authentication";
import LoginContainer from "../components/LoginContainer";
import SignupContainer from "../components/SignupContainer";
import VerifyEmail from "../pages/Authentication/VerifyEmail";
import SuccessVerifyEmail from "../pages/Authentication/SuccessVerifyPage";
import DocumentList from "../components/DocumentList";
import PageNotFound from "../pages/PageNotFound";
import Document from "../pages/Document/Document";
const router = createBrowserRouter([
  {
    path: "/document",
    element: <Document />,
    children: [
      {
        path: "documentlist",
        element: <DocumentList />,
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
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
