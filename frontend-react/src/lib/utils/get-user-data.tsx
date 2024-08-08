import AuthToken from "../access-token";
import { User } from "../types";
import fetchData from "./make-requests";

const url: string = import.meta.env.VITE_SERVER_URL;
const accessToken: string = AuthToken();

export function getUserData(): Promise<User> {
  return fetchData(`${url}/get-user-data/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(accessToken),
    },
  });
}
