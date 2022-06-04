import ManualServerRepository from "../../repo/ManualServers.js";

export default async function GetAll() {
  const allManualServers = await ManualServerRepository.listServers();
  
  console.debug("all Manuals Servers: ", allManualServers);
  
  const healthyManualServers = await (allManualServers
    .filter(_server => _server.isCertificateTrusted)
    .filter(async _server => await _server.isHealthy(10000)));
  
  
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