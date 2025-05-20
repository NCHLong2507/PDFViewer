import { createContext, useState, useContext } from "react";
import api from '../api/axios';



interface AuthContextType {
  userInfor:  any  | null;
  setUserInfor: React.Dispatch<React.SetStateAction<any | null>>;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: any; message?: string, statusCode?: number }>;
  logout: () => Promise<{ success: boolean; error?: string } | void>;
  signup: (data?: { name: string; email: string; password: string }) => Promise<{ success: boolean; user?: any; message?: string, statusCode?: number }>;
  isAuthenticated: boolean;
  checkAuthorization: () => Promise<boolean>;

}
interface User {
  name: string,
  email: string,
  _id: string
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfor,setUserInfor] = useState<User|null>(null);

  const login = async (email:string,password:string) => {
    try {
      const res = await api.post('/auth/login',{
        email,
        password,
      });
      const {user} = res.data;
      if (!user) {
        console.error('Missing token or user_data in response:', res.data);
        throw new Error('Invalid response data');
      }
      localStorage.setItem('user',JSON.stringify(user));
      return {
        success: true,
        user:user
      }
    } catch (err) {
      const error = err as any;
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        statusCode: error.response?.data?.statusCode || 500
      };
    }

  }
  const logout = async () => {
    setUserInfor(null);
    localStorage.removeItem('user');
    try {
      await api.post('/auth/logout');
    } catch (err) {
      const error = err as any;
      console.log(error);
    }
  }

  const signup = async (data?: {name:string,email:string,password:string}) => {
    try {
      if (!data) {
        await api.post('/auth/signup',undefined,{withCredentials:true}); 
      } else {
        const { name, email, password } = data;
        await api.post('/auth/signup', {
          name,
          email,
          password,
        });
      }
      return {
        success: true,
      };
    } catch(err) {
      const error = err as any;
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed',
        statusCode: error.response?.data?.statusCode || 500
      };
    }
  }

  const checkAuthorization = async (): Promise<boolean> => {
    try {
      const result = await api.get('/auth/authorize'); 
      if (result && result.data.status === 'success') {
        setUserInfor(result.data.user);
        return true;
      } else {
        localStorage.removeItem('user');
        setUserInfor(null);
      } 
    } catch (err: any) {
      console.log(err.response);
    }
    return false;
  }
  return ( 
    <AuthContext.Provider 
      value = {{
        setUserInfor,
        userInfor,
        login,
        logout,
        signup,
        isAuthenticated: !!userInfor && userInfor != null,
        checkAuthorization
      }}
    >
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}