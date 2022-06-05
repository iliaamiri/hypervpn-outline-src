import {Request, Response} from "express";

import ManualServerService from "../services/ManualServerService";
import ManualServerExceptions from "../../core/exceptions/ManualServerExceptions";
import exceptionHandler from "../../core/ExceptionHandler";
import GeneralExceptions from "../../core/exceptions/GeneralExceptions";
import ManualServerValidator from "../services/ManualServerValidator";
import IManualServerDto from "../models/IManualServerDto";

const ManualServer = {
  async addServers(req: Request, res: Response) {
    console.debug("attempting to add servers");
    const servers = req.body;
    if (!servers || !Array.isArray(servers)) {
      throw new Error("Invalid Input");
    }
    
    const errors = await ManualServerService.AddServers(servers);
    
    if (errors.length > 0 ) {
      errors.forEach((error, index) => {
        console.debug(`Server config which couldn't be add: ${servers[index]}`);
        console.debug(`Error #${index + 1}: `, error);
      });
  
      let firstError = errors[0];
      
      let errorForUser = ManualServerExceptions.COULD_NOT_CONNECT;
      
      if (firstError.message === ManualServerExceptions.SERVER_WAS_ALREADY_ADDED.errName) {
        errorForUser = ManualServerExceptions.SERVER_WAS_ALREADY_ADDED;
      }
      if (firstError.message === ManualServerExceptions.SERVER_IS_NOT_HEALTHY.errName) {
        errorForUser = ManualServerExceptions.SERVER_IS_NOT_HEALTHY;
      }
      
      return res.json({
        status: false,
        faultyServer: servers[0],
        error: errorForUser
      });
    }
    
    return res.status(200).json({
      status: true
    });
  },
  
  async getAll(req: Request, res: Response) {
    const allServers = await ManualServerService.GetAll();
    
    const allServersDto: IManualServerDto[] = [];
    for (let server of allServers) {
      allServersDto.push(server.toJSON());
    }
    console.log(allServersDto)
    res.json({
      status: true,
      allServers: allServersDto
    });
  },
  
  async updateServer(req: Request, res: Response) {
    let {serverRowId} = req.params;
    let server = req.body;
    if (serverRowId === undefined || isNaN(parseInt(serverRowId))) {
      return await exceptionHandler(GeneralExceptions.BAD_INPUT, req, res, () => {
        return { faultyInput: "serverRowId"};
      });
    }
    let serverRowIdInt = parseInt(serverRowId);
  
    const validationResult = await ManualServerValidator(server);
    
    console.log(validationResult);
    
    let isModelValid = validationResult.IsValid;
    if (!isModelValid) {
      let allErrors = validationResult.Errors;
      return await exceptionHandler(GeneralExceptions.BAD_INPUT, req, res, () => {
        return { validationResultErrors: allErrors};
      });
    }
    
    const foundServer = await ManualServerService.FindById(serverRowIdInt);
    if (!foundServer) {
      return await exceptionHandler(ManualServerExceptions.COULD_NOT_CONNECT, req, res);
    }
    
    await ManualServerService.UpdateManualServer(foundServer, server);
    
    res.status(200).json({
      status: true
    });
  },
  
  async forgetServer(req: Request, res: Response) {
    let {serverRowId} = req.params;
    if (serverRowId === undefined || isNaN(parseInt(serverRowId))) {
      return await exceptionHandler(GeneralExceptions.BAD_INPUT, req, res, () => {
        return { faultyInput: "serverRowId"};
      });
    }
    let serverRowIdInt = parseInt(serverRowId);
  
    const foundServer = await ManualServerService.FindById(serverRowIdInt);
    if (!foundServer) {
      return await exceptionHandler(ManualServerExceptions.COULD_NOT_CONNECT, req, res);
    }
  
    const success = await ManualServerService.ForgetServer(foundServer);
    
    if (!success) {
      return await exceptionHandler(ManualServerExceptions.COULD_NOT_DELETE, req, res, () => {
        return { faultyInput: "serverRowId"};
      });
    }
  
    res.status(200).json({
      status: true
    });
  }
}

export default ManualServer;