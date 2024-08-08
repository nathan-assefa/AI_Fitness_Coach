import AuthToken from "../access-token";
import { Messages } from "../types";

export async function getTrainerChatHistory(
  user_id: string
): Promise<Messages[]> {
  const apiUrl: string = import.meta.env.VITE_SERVER_URL;
  console.log(user_id);
  try {
    const url = `${apiUrl}/trainer-char-history/`;
    const accessToken: string = AuthToken();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(accessToken),
      },
      body: JSON.stringify({
        user_id: user_id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send trainer opinion");
    }

    const data: Messages[] = await response.json();
    console.log(data);
    console.log("successs");
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching trainer chat history:", error.message);
      throw error;
    }
    throw new Error("Unexpected error occurred");
  }
}
