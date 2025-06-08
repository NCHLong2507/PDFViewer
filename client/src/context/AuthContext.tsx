import { createContext, useState, useContext } from "react";
import api from "../api/axios";
import type { User } from "../interface/user";
import { clearCache } from "../utils/indexedDbHelper";
import authService from "../services/authService";

interface AuthContextType {
  userInfor: User | undefined;
  setUserInfor: React.Dispatch<React.SetStateAction<User | undefined>>;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    user?: User;
    message?: string;
    statusCode?: number;
  }>;
  logout: () => Promise<{
    success: boolean;
    user?: User;
    error?: string;
  } | void>;
  signup: (
    data: { name: string; email: string; password: string },
    invitation_token: string | null
  ) => Promise<{
    success: boolean;
    user_id?: string;
    message?: string;
    statusCode?: number;
  }>;
  isAuthenticated: boolean;
  checkAuthorization: (
    invitation_token: string | null
  ) => Promise<{ status: boolean; directURL: string }>;
  googleLogin: (
    token: string,
    invitation_token: string | null
  ) => Promise<{
    success: boolean;
    user?: User;
    directURL?: string;
    message?: string;
    statusCode?: number;
  }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userInfor, setUserInfor] = useState<User | undefined>(undefined);

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login(email, password);
      const { user } = res.data;
      if (!user) {
        console.error("Missing token or user_data in response:", res.data);
        throw new Error("Invalid response data");
      }
      return {
        success: true,
        user: user,
      };
    } catch (err) {
      const error = err as any;
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
        statusCode: error.response?.data?.statusCode || 500,
      };
    }
  };
  const logout = async () => {
    setUserInfor(undefined);
    try {
      await authService.logout();
      await clearCache();
    } catch (err) {
      const error = err as any;
      console.log(error);
    }
  };
  const googleLogin = async (
    token: string,
    invitation_token: string | null = null
  ) => {
    try {
      const link = invitation_token
        ? `/auth/google/authentication?invitation_token=${invitation_token}`
        : `/auth/google/authentication`;
      const result = await authService.googleLogin(link, token);
      const { user, directURL } = result.data;
      if (!user) {
        console.error("Missing token or user_data in response:", result.data);
        throw new Error("Invalid response data");
      }
      return {
        success: true,
        user: user,
        directURL,
      };
    } catch (err) {
      const error = err as any;
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
        statusCode: error.response?.data?.statusCode || 500,
      };
    }
  };
  const signup = async (
    data: {
      name: string;
      email: string;
      password: string;
    },
    invitation_token: string | null = null
  ) => {
    try {
      const { name, email, password } = data;
      const link = invitation_token
        ? `/auth/signup?invitation_token=${invitation_token}`
        : `/auth/signup`;
      const result = await authService.signup(link, name, email, password);
      localStorage.setItem("email", email);
      return {
        user_id: result.data.id as string,
        success: true,
      };
    } catch (err) {
      console.log(err);
      const error = err as any;
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
        statusCode: error.response?.data?.statusCode || 500,
      };
    }
  };

  const checkAuthorization = async (
    invitation_token: string | null
  ): Promise<{ status: boolean; directURL: string }> => {
    try {
      const result = await authService.checkAuthorization(invitation_token);
      if (result && result.data.status === "success") {
        setUserInfor(result.data.user);
        return {
          status: true,
          directURL: result.data.directURL,
        };
      } else {
        setUserInfor(undefined);
      }
    } catch (err: any) {
      const originalRequest = err.config;
      if (err.response?.status === 401) {
        try {
          await authService.refresh();
          const retry = await api(originalRequest);
          if (retry && retry.data.status === "success") {
            setUserInfor(retry.data.user);
            return {
              status: true,
              directURL: retry.data.directURL,
            };
          }
        } catch (err) {
          console.log(err);
          await logout();
          return {
            status: false,
            directURL: "",
          };
        }
      }
    }
    return {
      status: false,
      directURL: "",
    };
  };
  return (
    <AuthContext.Provider
      value={{
        setUserInfor,
        userInfor,
        login,
        logout,
        signup,
        isAuthenticated: !!userInfor && userInfor != null,
        checkAuthorization,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
