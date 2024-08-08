import axios from "axios";

export default async function fetchData<T>(
  url: string,
  options?: {}
): Promise<T> {
  try {
    const response = await axios(url, options);
    return response.data as T;
  } catch (error) {
    return Promise.reject(error);
  }
}
