import IException from "../IException";

const AccessKeyExceptions: {[key: string]: IException} = {
    NOT_FOUND: {
        errName: "NOT_FOUND",
        code: "404",
        httpCustomStatusCode: 404,
        userError: "VPN Key does not exist",
        detail: "VPN Key does not exist"
    },
    INVALID_DATA_LIMIT_INPUT: {
        errName: "INVALID_DATA_LIMIT_INPUT",
        code: "400",
        httpCustomStatusCode: 400,
        userError: "Invalid Input",
        detail: "ad User input. `dataLimit` was not passed."
    }
};

export default AccessKeyExceptions;