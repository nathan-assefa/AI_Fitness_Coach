import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { User, UsersQueryResponse } from "./_models";
import AuthToken from "../../../../../../lib/access-token";

// const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const API_URL = import.meta.env.VITE_SERVER_URL;
const USER_URL = `${API_URL}/user`;
const GET_USERS_URL = `${API_URL}/users-list/`;

// const getUsers = (query: string): Promise<UsersQueryResponse> => {
//   return axios
//     .get(`${GET_USERS_URL}?${query}`)
//     .then((d: AxiosResponse<UsersQueryResponse>) => d.data);
// };

const accessToken = AuthToken();

const getUsers = async (query: string): Promise<UsersQueryResponse> => {
  console.log("Fetching users...");
  try {
    const response = await fetch(`${GET_USERS_URL}?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UsersQueryResponse = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const getUserById = (id: ID): Promise<User | undefined> => {
  return axios
    .get(`${USER_URL}/${id}`)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const createUser = (user: User): Promise<User | undefined> => {
  return axios
    .put(USER_URL, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const updateUser = (user: User): Promise<User | undefined> => {
  return axios
    .post(`${USER_URL}/${user.id}`, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${USER_URL}/${userId}`).then(() => {});
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${USER_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getUsers,
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
};
