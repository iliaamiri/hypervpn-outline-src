import IException from "./IException";
import {Request, Response} from "express";

export default async function exceptionHandler(e: IException[] | IException, req: Request, res: Response, additionalParamsCallback: Function = () => {return{}}) {
  let statusCode;
  let errorToGive;
  if (Array.isArray(e)) {
    let errors = [];
    for (let exception of e) {
      errors.push(makeErrorModel(exception));
    }
    statusCode = parseInt(errors[0].code);
    errorToGive = errors;
  } else {
    errorToGive = makeErrorModel(e);
    statusCode = parseInt(e.code);
  }
  
  res.status(statusCode ?? 500).json({
    status: false,
    ...additionalParamsCallback(),
    error: errorToGive
  });
  return;
}

function makeErrorModel(exception: IException) {
  return {
    errName: exception.errName,
    code: exception.code,
    userError: exception.userError
  };
}