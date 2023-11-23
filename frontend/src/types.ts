export interface Todo {
  _id: string;
  name: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  profilePic: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

export interface Auth {
  token_type: string;
  access_token: string;
  user: User;
}
