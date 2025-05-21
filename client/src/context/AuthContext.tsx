import { createContext, useState, useContext } from "react";
import api from '../api/axios';
import type {User} from '../interface/user';

interface AuthContextType {
  userInfor:  User  | undefined;
  setUserInfor: React.Dispatch<React.SetStateAction<User | undefined>>;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; message?: string, statusCode?: number }>;
  logout: () => Promise<{ success: boolean; user?:User; error?: string } | void>;
  signup: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; user_id?: string; message?: string, statusCode?: number }>;
  isAuthenticated: boolean;
  checkAuthorization: () => Promise<boolean>;

}


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfor,setUserInfor] = useState<User|undefined>(undefined);

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
    setUserInfor(undefined);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      const error = err as any;
      console.log(error);
    }
  }

  const signup = async (data: {name:string,email:string,password:string}) => {
    try {
      const { name, email, password } = data;
      const result = await api.post('/auth/signup', {
        name,
        email,
        password,
      });
      localStorage.setItem('email',email);
      return {
        user_id:result.data.id as string,
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
        setUserInfor(undefined);
      } 
    } catch (err: any) {
      const originalRequest = err.config;
      if (err.response?.status === 401) {
        try {
          await api.get('/auth/refresh'); 
          const retry = await api(originalRequest); 
          console.log(retry)
          if (retry && retry.data.status === 'success') {
            setUserInfor(retry.data.user);
            console.log("A",userInfor)
            return true;
          }
        } catch {
          await logout();
          return false;
        }
      }
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