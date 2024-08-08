import AuthToken from "../access-token";
import { User } from "../types";
import fetchData from "./make-requests";

export async function updateUserPlan({
  recipientId,
  plan,
}: {
  recipientId: string | undefined;
  plan: string;
}): Promise<User> {
  const apiUrl: string = import.meta.env.VITE_SERVER_URL;
  const accessToken: string = AuthToken();

  try {
    return fetchData(`${apiUrl}/set-user-plan/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(accessToken),
      },
      data: { recipient: recipientId, content: plan },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
