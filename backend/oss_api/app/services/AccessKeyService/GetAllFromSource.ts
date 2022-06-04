import ManualServerRepository from "../ManualServerRepository";

export default async function GetAllFromSource() {
  const healthyManualServers = await ManualServerRepository.listServers();
  
  console.debug("all Manuals Servers: ", healthyManualServers);
  
  return await Promise.all(
    healthyManualServers
      .map(async _server => {
        console.log("url", _server.getManagementApiUrl())
        
        let listOfAccessKeys;
        try {
          listOfAccessKeys = await _server.listAccessKeys();
          
          // console.log("the keys: ", listOfAccessKeys);
          
          return {
            apiUrl: _server.getManagementApiUrl(),
            accessKeys: listOfAccessKeys
          }
        } catch (err) {
          console.log(err);
        }
      })
  );
}