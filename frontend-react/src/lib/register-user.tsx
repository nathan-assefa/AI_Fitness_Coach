import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserSignUpData } from "./types";
import { toast } from "sonner";

const apiUrl: string = import.meta.env.VITE_SERVER_URL;

export const RegisterUser = async () => {
  const navigate = useNavigate();
  const { mutate, isLoading, isError } = useMutation(
    async ({
      first_name,
      last_name,
      email,
      password,
      phone_number,
      agreed_to_terms,
    }: UserSignUpData) => {
      const url = `${apiUrl}/register/`;
      const headers = {
        "Content-Type": "application/json",
      };
      const data = {
        first_name,
        last_name,
        email,
        password,
        phone_number,
        agreed_to_terms,
      };

      try {
        const response = await axios.post(url, data, { headers });
        toast.success("Successfully signed in.");
        navigate("/");

        return response.data;
      } catch (error) {
        toast.error("Something wend wrong");
        console.log(error);
        throw error;
      }
    }
  );
  return { mutate, isLoading, isError };
};
