import { User } from "../types/User";
import axiosInstance from "../instance/axiosInstance";

export const loginUser = async (
  username: string,
  password: string,
  role: string
): Promise<User> => {
  const response = await axiosInstance.post<User>("/auth/signin", {
    username,
    password,
    role,
  });
  return response.data;
};
