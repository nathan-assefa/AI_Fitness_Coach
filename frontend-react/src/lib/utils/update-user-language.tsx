import AuthToken from "../access-token";
import { User } from "../types";
import fetchData from "./make-requests";

export async function updateUserData(language: string): Promise<User> {
  const apiUrl: string = import.meta.env.VITE_SERVER_URL;
  const accessToken: string = AuthToken();
  try {
    return fetchData(`${apiUrl}/update-user-data/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(accessToken),
      },
      data: { language },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
