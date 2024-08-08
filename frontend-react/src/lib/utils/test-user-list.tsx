import axios from "axios";
// import AuthToken from "../access-token";

export async function getUsersList() {
  const apiUrl: string = import.meta.env.VITE_SERVER_URL;
  // If the token is not needed, simply don't include it
  //   const accessToken: string = AuthToken();

  try {
    const response = await axios.get(`${apiUrl}/users-list/`, {
      headers: {
        "Content-Type": "application/json",
        // Comment out or remove the Authorization header
        Authorization:
          "Bearer " +
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIxNDY0Mzg2LCJpYXQiOjE3MTcxNDQzODYsImp0aSI6ImU3ZjJkYjNlNjU2YTQ0YTNhMzYyYjcxMmEyMjdjMjEzIiwidXNlcl9pZCI6NiwiaWQiOjYsImVtYWlsIjoidGVkaUBnYW1pbC5jb20iLCJmaXJzdF9uYW1lIjoiVGVkaSIsImdlbmRlciI6Ik1hbGUifQ.mFOahn6YtrPDS69m1-BSbsHYcFoUMl1pU2gGEw0mGeo",
      },
    });
    console.log("response: ", response);
    return response.data;
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
}
