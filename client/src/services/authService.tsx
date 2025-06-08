import api from "../api/axios";

const authService = {
  login: (email: string, password: string) => {
    return api.post("/auth/login", { email, password });
  },
  logout: () => {
    return api.post("/auth/logout");
  },
  signup: (link: string, name: string, email: string, password: string) => {
    return api.post(link, {
      name,
      email,
      password,
    });
  },
  googleLogin: (link: string, token: string) => {
    return api.get(link, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  checkAuthorization: (invitation_token:string|null) => {
    const link = invitation_token ? `/auth/authorize?invitation_token=${invitation_token}`:  `/auth/authorize`;
    return api.get(link);
  },
  refresh: () => {
    return api.get("/auth/refresh");
  }
};

export default authService;
