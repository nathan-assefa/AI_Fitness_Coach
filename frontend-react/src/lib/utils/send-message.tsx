import AuthToken from "../access-token";
import { Messages } from "../types";
import fetchData from "./make-requests";

export function sendMessage(
  recipientId: string | undefined,
  content: string
): Promise<Messages> {
  const apiUrl: string = import.meta.env.VITE_SERVER_URL;

  const accessToken: string = AuthToken();

  return fetchData(`${apiUrl}/send_message/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(accessToken),
    },
    data: { recipient: recipientId, content: content },
  });
}
