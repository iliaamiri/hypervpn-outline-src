import IException from "../IException";

const GeneralExceptions: {[key: string]: IException} = {
  BAD_INPUT: {
    errName: "BAD_INPUT",
    code: "400",
    httpCustomStatusCode: 400,
    userError: "Invalid input. Please pass a valid input",
    detail: "User's input(s) was not valid."
  },
};

export default GeneralExceptions;