import {Request, Response} from "express";

import ManualServerService from "../services/ManualServerService";
import ManualServerExceptions from "../../core/exceptions/ManualServerExceptions";

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
  
  async getAll(req, res) {
    const allServers = await ManualServerService.GetAll();
    
    res.json({
      status: true,
      allServers: allServers
    });
  },
}

export default ManualServer;