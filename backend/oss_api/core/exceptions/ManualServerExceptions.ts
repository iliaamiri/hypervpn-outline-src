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
    code: "501",
    httpCustomStatusCode: 501,
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
    code: "505",
    httpCustomStatusCode: 505,
    userError: "This server is unreachable",
    detail: "The server is unhealthy. Could not reach this server after several attempts."
  }
};

export default ManualServerExceptions;