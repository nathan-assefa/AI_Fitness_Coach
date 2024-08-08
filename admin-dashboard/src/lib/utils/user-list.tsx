import AuthToken from "../access-token";
import { UserListResponse } from "../../lib/types";

export async function getUsersList(): Promise<UserListResponse> {
  const apiUrl: string = import.meta.env.VITE_SERVER_URL;
  const accessToken: string = AuthToken();

  try {
    const response = await fetch(`${apiUrl}/users-list/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(accessToken),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UserListResponse = await response.json();
    return data;
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
}
