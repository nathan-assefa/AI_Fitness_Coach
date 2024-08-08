import AuthToken from "../access-token";
export interface Message {
  id: number;
  created_at: string;
  updated_at: string;
  sender: number;
  recipient: number;
  content: string;
}

export async function sendTrainerOpinion(
  user_id: string,
  trainerOpinion: string
): Promise<Message[]> {
  const apiUrl: string = import.meta.env.VITE_SERVER_URL;
  try {
    const url = `${apiUrl}/trainer-opinion/`;
    const accessToken: string = AuthToken();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(accessToken),
      },
      body: JSON.stringify({
        user_id: user_id,
        trainer_opinion: trainerOpinion,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send trainer opinion");
    }

    const data: Message[] = await response.json();
    console.log("Trainer opinion sent successfully");
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending trainer opinion:", error.message);
      throw error;
    }
    throw new Error("Unexpected error occurred");
  }
}
