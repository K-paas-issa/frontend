import { createApiErrorMessage } from "./httpError";
import axios, { AxiosResponse } from "axios";

const developmentApiUrl = process.env["NEXT_PUBLIC_SERVER_IP_DEVELOPMENT"];
const productionApiUrl = process.env["NEXT_PUBLIC_SERVER_IP_PRODUCTION"];

const client = axios.create({
  baseURL: process.env["NEXT_PUBLIC_MODE"] === "development" ? developmentApiUrl : productionApiUrl,
});

async function httpClient<T>(...args: Parameters<typeof client.request>) {
  try {
    const response: AxiosResponse<T> = await client(...args);
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      const errorMessage = e.response.data.message ? e.response.data.message : createApiErrorMessage(e.response.status);
      throw new Error(errorMessage);
    } else {
      throw new Error("알 수 없는 오류가 발생했어요");
    }
  }
}

export { client, httpClient };
