import IException from "../IException";

const ManualServerExceptions: {[key: string]: IException} = {
  INVALID_CERTIFICATE: {
    errName: "INVALID_CERTIFICATE",
    code: "400",
    httpCustomStatusCode: 400,
    userError: "Couldn't trust the certificate. Please try again.",
    detail: "Error trusting certificate, may be due to bad user input."
  },
  COULD_NOT_CONNECT: {
    errName: "COULD_NOT_CONNECT",
    code: "503",
    httpCustomStatusCode: 503,
    userError: "Could not connect to the server.",
    detail: "Could not connect to the serve. Unknown error."
  },
  SERVER_WAS_ALREADY_ADDED: {
    errName: "SERVER_WAS_ALREADY_ADDED",
    code: "400",
    httpCustomStatusCode: 400,
    userError: "This server has been already added to the database.",
    detail: "Servers cannot be duplicated in the database."
  },
  SERVER_IS_NOT_HEALTHY: {
    errName: "SERVER_IS_NOT_HEALTHY",
    code: "523",
    httpCustomStatusCode: 523,
    userError: "This server is unreachable",
    detail: "The server is unhealthy. Could not reach this server after several attempts."
  },
  METRICS_IS_DISABLED: {
    errName: "METRICS_IS_DISABLED",
    code: "503",
    httpCustomStatusCode: 503,
    userError: "The server's metrics is disabled. This means you cannot set data limits for this key as long as the" +
      "server metrics are not enabled.",
    detail: "In order for setting a data limit on a key on this server, you need to enable the metrics first."
  },
  COULD_NOT_DELETE: {
    errName: "COULD_NOT_DELETE",
    code: "500",
    httpCustomStatusCode: 500,
    userError: "The server could not be deleted. Please contact technical support.",
    detail: "Possible reason: rowId couldn't be found"
  }
};

export default ManualServerExceptions;