import axios, { AxiosResponse } from "axios";
import { RegisterFormData, Todo, User } from "../types";

const BASE_URL = "https://todoapp-g2sh.onrender.com/";

export const API_URLS = {
  login: `${BASE_URL}auth/login`,
  register: `${BASE_URL}auth/register`,
  getTodosByUserId: `${BASE_URL}todos/getTodosByUserId`,
  checkTokenExpiration: `${BASE_URL}auth/checktokenexpiration`,
  deleteTodo: `${BASE_URL}todos/`,
  getTodo: `${BASE_URL}todos/`,
  updateTodo: `${BASE_URL}todos/`,
  deleteAllTodos: `${BASE_URL}todos/`,
  createTodo: `${BASE_URL}todos/`,
  getUser: `${BASE_URL}users/`,
  updateProfile: `${BASE_URL}users/`,
  forgotPassword: `${BASE_URL}auth/forgotpassword`,
  resetPassword: `${BASE_URL}auth/resetpassword`,
};

export const register = (
  formData: RegisterFormData
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(API_URLS.register, formData);
  } catch (error) {
    throw error;
  }
};

export const login = (formData: FormData): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(API_URLS.login, formData);
  } catch (error) {
    throw error;
  }
};

export const getTodosByUserId = (): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(API_URLS.getTodosByUserId);
  } catch (error) {
    throw error;
  }
};

export const checkTokenExpiration = (): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(API_URLS.checkTokenExpiration);
  } catch (error) {
    throw error;
  }
};

export const deleteTodo = (id: string): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.delete(`${API_URLS.deleteTodo}${id}`);
  } catch (error) {
    throw error;
  }
};

export const getTodo = (
  id: string | null
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getTodo}${id}`);
  } catch (error) {
    throw error;
  }
};

export const updateTodo = (
  id: string | null | undefined,
  updatedTodo: Todo
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.put(`${API_URLS.updateTodo}${id}`, updatedTodo);
  } catch (error) {
    throw error;
  }
};

export const deleteAllTodos = (): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.delete(API_URLS.deleteAllTodos);
  } catch (error) {
    throw error;
  }
};

export const createTodo = (
  name: string,
  description: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(API_URLS.createTodo, { name, description });
  } catch (error) {
    throw error;
  }
};

export const getUser = (user_id: string): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.get(`${API_URLS.getUser}${user_id}`);
  } catch (error) {
    throw error;
  }
};

export const updateProfile = (
  user_id: string,
  user: User
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.put(`${API_URLS.updateProfile}${user_id}`, user);
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = (
  email: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(API_URLS.forgotPassword, { email });
  } catch (error) {
    throw error;
  }
};

export const resetPassword = (
  newPassword: string,
  token: string
): Promise<AxiosResponse<any, any>> => {
  try {
    return axios.post(API_URLS.resetPassword, { newPassword, token });
  } catch (error) {
    throw error;
  }
};
