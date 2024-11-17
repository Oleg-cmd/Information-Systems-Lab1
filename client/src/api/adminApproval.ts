import axiosInstance from "../instance/axiosInstance";
import { User } from "../types/types";

export const fetchPendingAdmins = async (): Promise<User[]> => {
  const response = await axiosInstance.get<User[]>("/auth/pendingAdmins");
  return response.data;
};

export const approveAdmin = async (
  id: number,
  approve: boolean
): Promise<void> => {
  await axiosInstance.put(`/auth/${id}/approve`, null, {
    params: { approve },
  });
};
