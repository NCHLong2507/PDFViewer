export interface Collaborator {
  user: {
    _id: string;
    name: string;
    email: string;
    picture: string;
  };
  role: string;
}
