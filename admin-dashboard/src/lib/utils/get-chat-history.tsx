import AuthToken from "../access-token";
import { Messages } from "../../lib/types";

export async function getChatHistory(user_id: string): Promise<Messages[]> {
  const apiUrl: string = import.meta.env.VITE_SERVER_URL;
  const accessToken: string = AuthToken();
  console.log("ininin");

  try {
    const response = await fetch(`${apiUrl}/messages-history/${user_id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(accessToken),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Messages[] = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
}
