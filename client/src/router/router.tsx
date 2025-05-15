import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Authentication from "../pages/Authentication/Authentication";
import LoginContainer from "../components/LoginContainer";
import SignupContainer from "../components/SignupContainer";
import VerifyEmail from "../pages/Authentication/VerifyEmail";
import SuccessVerifyEmail from "../pages/Authentication/SuccessVerifyPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
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
  }
]);

export default router;