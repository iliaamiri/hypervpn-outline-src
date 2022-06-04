import IException from "../IException";

const ShadowboxExceptions: {[key: string]: IException} = {
  API_REQUEST_FAILED: {
    errName: "API_REQUEST_FAILED",
    code: '500',
    httpCustomStatusCode: 500,
    userError: "Internal Error",
    detail: "API request failed."
  },
  NETWORK_ERROR: {
    errName: "NETWORK_ERROR",
    code: '501',
    httpCustomStatusCode: 501,
    userError: "Internal Error",
    detail: "API request failed due to network error."
  },
  NOT_FOUND: {
    errName: "NOT_FOUND",
    code: "404",
    httpCustomStatusCode: 404,
    userError: "Internal Error. Please try again later or contact us.",
    detail: "Server does not exist"
  },
}

export default ShadowboxExceptions;