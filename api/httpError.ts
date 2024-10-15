import { API_ERROR_MESSAGE, SERVER_ERROR_REGEX, NETWORK_ERROR_REGEX } from "../constant";

const createApiErrorMessage = (statusCode: number) => {
  const isServerError = SERVER_ERROR_REGEX.test(statusCode.toString());
  const isNetworkError = NETWORK_ERROR_REGEX.test(statusCode.toString());

  if (isServerError) return API_ERROR_MESSAGE.serverError;

  if (isNetworkError) return API_ERROR_MESSAGE.networkError;

  if (statusCode in API_ERROR_MESSAGE) return API_ERROR_MESSAGE[statusCode];
};

export { createApiErrorMessage };