
'use server';
import { API_ENDPOINTS } from "@/core/constants/api_endpoint";
import { SERVER_URL } from "@/index";
import axios from "axios";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobileNumber: string;
  password: string;
  role: string;
}

export const Register = async (
  data: RegisterPayload
) => {
  try {

    const response = await axios.post(
      `${SERVER_URL}${API_ENDPOINTS.auth.register}`,
      data
    );

    return response.data;

  } catch (error: any) {

    throw new Error(
      error?.response?.data?.message ||
      "Register Failed"
    );

  }
};