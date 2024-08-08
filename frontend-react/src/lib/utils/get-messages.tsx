import { Messages } from "../types";
import fetchData from "./make-requests";
import AuthToken from "../access-token";

export async function getMessages(recipientId: string): Promise<Messages[]> {
  const apiUrl: string = import.meta.env.VITE_SERVER_URL;
  const accessToken: string = AuthToken();
  const response: Messages[] = await fetchData(
    `${apiUrl}/get-user-messages/${recipientId}/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(accessToken),
      },
    }
  );

  return response;
}
