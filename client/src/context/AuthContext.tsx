import { createContext, useState, useContext, useEffect } from "react";
import api from '../api/axios';

interface AuthContextType {
  userInfor: any | null;
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const parsedUser = JSON.parse(userData);
          setUserInfor(parsedUser);
        } 
      } catch(err) {
        console.error("Error while loading...",err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    checkAuth();
},[]);

  const login = async (email:string,password:string) => {
    try {
      const res = await api.post('/auth/login',{
        email,
        password,
      });
      const {user} = res.data;
      if (!user || !user.token) {
        console.error('Missing token or user_data in response:', res.data);
        throw new Error('Invalid response data');
      }
      const token = user.token;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token',token);
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
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserInfor(null);
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
      const token = localStorage.getItem('token');
      if (!token) return false;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const result = await api.get('/auth/authorize'); 
      if (result && result.data.status === 'success') {
        return true;
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUserInfor(null);
      } 
    } catch (err: any) {
      console.log(err.response?.message);
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