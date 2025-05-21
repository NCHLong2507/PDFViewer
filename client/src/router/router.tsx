import { createBrowserRouter } from "react-router-dom";
import Authentication from "../pages/Authentication/Authentication";
import LoginContainer from "../components/LoginContainer";
import SignupContainer from "../components/SignupContainer";
import VerifyEmail from "../pages/Authentication/VerifyEmail";
import SuccessVerifyEmail from "../pages/Authentication/SuccessVerifyPage";
import DocumentList from "../components/DocumentList";
import DocumentDetailed from "../components/DocumentDetailed";
import PageNotFound from "../pages/PageNotFound";
import NoPermissionPage from "../pages/Document/NoPermissionPage";
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
      {
        path: "documentdetailed",
        element: <DocumentDetailed />,
      },
      {
        path: "nopermission",
        element: <NoPermissionPage/>
      }
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
