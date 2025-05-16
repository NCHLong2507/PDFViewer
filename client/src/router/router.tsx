import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Authentication from "../pages/Authentication/Authentication";
import LoginContainer from "../components/LoginContainer";
import SignupContainer from "../components/SignupContainer";
import VerifyEmail from "../pages/Authentication/VerifyEmail";
import SuccessVerifyEmail from "../pages/Authentication/SuccessVerifyPage";
import DocumentList from "../pages/Document/DocumentList";
import PageNotFound from "../pages/PageNotFound";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path:"/document",
        element: <DocumentList/>
      }
    ]
  },
  {
    path:"/auth",
    element: <Authentication/>,
    children: [
      {
        path: 'login', 
        element:<LoginContainer/> 
      }, 
      {
        path: 'signup', 
        element:<SignupContainer/> 
      }
    ]
  },
  {
    path:"/verifyemail",
    element: <VerifyEmail/>
  }, 
  {
    path: "/successverifyemail",
    element: <SuccessVerifyEmail/>
  }, 
  {
    path: "*",
    element: <PageNotFound />,
  }
]);

export default router;