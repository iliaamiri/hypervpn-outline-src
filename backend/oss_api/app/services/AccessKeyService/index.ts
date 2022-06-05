import GetAllFromDatabase from "./GetAllFromDatabase.js";
import FindById from "./FindById";
import CreateNewKey from "./CreateNewKey";
import DeleteKey from "./DeleteKey";
import Generate from "./Generate";
import GetAllFromSource from "./GetAllFromSource";
import UpdateDataLimit from "./UpdateDataLimit";

const AccessKeyService = {
  CreateNewKey,
  Generate,
  GetAllFromSource,
  GetAllFromDatabase,
  FindById,
  UpdateDataLimit,
  DeleteKey
}

export default AccessKeyService;