import { Request, Response } from "express";

// Services
import AccessKeyService from "../services/AccessKeyService";

// Exceptions
import AccessKeyExceptions from "../../core/exceptions/AccessKeyExceptions";
import ShadowboxExceptions from "../../core/exceptions/ShadowboxException";
import ManualServerExceptions from "../../core/exceptions/ManualServerExceptions";
import IException from "../../core/IException";

const AccessKeyController = {
  async getAll(req: Request, res: Response) {
    const accessKeys = await AccessKeyService.GetAllFromDatabase();

    console.log("all accessKeys: ", accessKeys);

    res.status(200).json({
      allAccessKeys: accessKeys
    });
  },

  async getById(req: Request, res: Response) {
    const { key } = req.params;
    const foundAccessKey = await AccessKeyService.FindById(key);

    if (foundAccessKey === null || !foundAccessKey) {
      throw AccessKeyExceptions.NOT_FOUND;
    }

    res.json(foundAccessKey.toJSON());
  },

  async newKey(req: Request, res: Response) {
    const { dataLimit } = req.body;
    if (!dataLimit) {
      throw AccessKeyExceptions.INVALID_DATA_LIMIT_INPUT;
    }

    const newGeneratedAccessKeyInstance = await AccessKeyService.Generate(dataLimit);

    if (newGeneratedAccessKeyInstance === null || !newGeneratedAccessKeyInstance) {
      throw ShadowboxExceptions.NOT_FOUND;
    }
    
    const newAccessKey = await AccessKeyService.CreateNewKey(newGeneratedAccessKeyInstance);
    
    res.status(200).json({
      keyValue: newAccessKey.toJSON(),
      dataLimit: dataLimit,
      createdAt: Date.now()
    });
  },

  async deleteKey(req: Request, res: Response) {
    const { key } = req.params;
    const foundAccessKey = await AccessKeyService.FindById(key);
    if (foundAccessKey) {
      await AccessKeyService.DeleteKey(foundAccessKey);
    }

    res.sendStatus(200);
  },

  async updateDataLimit(req: Request, res: Response) {
    const { key } = req.params;
    
    let { dataLimit } = req.body;
    dataLimit = parseInt(dataLimit);
    if (isNaN(dataLimit) || dataLimit < 1) {
      throw AccessKeyExceptions.INVALID_DATA_LIMIT_INPUT;
    }
    
    const foundAccessKey = await AccessKeyService.FindById(key);
    if (!foundAccessKey) {
      throw AccessKeyExceptions.NOT_FOUND;
    }

    dataLimit = { bytes: parseInt(dataLimit)};
    
    try {
      await AccessKeyService.UpdateDataLimit(foundAccessKey, dataLimit);
    } catch (err) {
      throw err;
    }
  }
};

export default AccessKeyController;