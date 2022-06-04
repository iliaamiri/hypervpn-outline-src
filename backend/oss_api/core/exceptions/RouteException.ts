import IException from "../IException";

const RouteExceptions: {[key: string]: IException} = {
  ROUTE_DOES_NOT_EXIST: {
    errName: "ROUTE_DOES_NOT_EXIST",
    code: "404",
    httpCustomStatusCode: 404,
    userError: "Internal Error",
    detail: "Route doesn't exist."
  }
};

export default RouteExceptions;