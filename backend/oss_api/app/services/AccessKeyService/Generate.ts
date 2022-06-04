import ManualServerRepository from "../ManualServerRepository";
import {AccessKey} from "../../models/AccessKey";

export default async function Generate(dataLimit) : Promise<AccessKey | null> {
  const allManualServers = await ManualServerRepository.listServers();
  
  const healthManualServers = [];
  for (let index = 0; index < allManualServers.length; index++) {
    let server = allManualServers[index];
    let isHealthy = await server.isHealthy(2000);
    if (isHealthy) {
      healthManualServers.push(server);
    }
  }
  
  let chosenServer;
  
  let previousDataLimitOverDifferenceOfBandwidthAndPoU;
  
  for (let index = 0; index < healthManualServers.length; index++) {
    let server = healthManualServers[index];
    if (!server['serverConfig']) {
      return;
    }
    
    let listOfAccessKeys = await server.listAccessKeys();
    
    let defaultDataLimit = server.getDefaultDataLimit() ?? {bytes: 0};
    
    const possibilityOfUsage = listOfAccessKeys.reduce((PoU, accessKey) => {
      if (!accessKey.dataLimit) {
        return PoU + defaultDataLimit.bytes;
      } else {
        return PoU + accessKey.dataLimit.bytes;
      }
    }, 0);
    
    if (possibilityOfUsage + parseInt(dataLimit) > (server.bandwidthThreshold.megaBytes * 1000000)) {
      return;
    }
    
    // let usageMap = await server.getDataUsage();
    
    // let currentDataUsage = 0;
    // usageMap.forEach((bytesValue, accessKey) => {
    //   currentDataUsage = currentDataUsage + bytesValue;
    // });
    
    let currentDataLtOverDiffOfBandwidthAndPoU = parseInt(dataLimit) / ((server.bandwidthThreshold.megaBytes * 1000000) - possibilityOfUsage);
    
    let a = previousDataLimitOverDifferenceOfBandwidthAndPoU;
    if ((a !== undefined && currentDataLtOverDiffOfBandwidthAndPoU < a) || healthManualServers.length - 1 === index) {
      chosenServer = server;
    }
    
    previousDataLimitOverDifferenceOfBandwidthAndPoU = currentDataLtOverDiffOfBandwidthAndPoU
  }
  
  if (!chosenServer) {
    return null;
  }
  
  // console.debug("chosen server: ", chosenServer)
  // await chosenServer.setHostnameForAccessKeys('127.0.0.1');
  // console.debug("chosen server: ", chosenServer)
  // console.debug("asdff", chosenServer.getManagementApiUrl())

  return new AccessKey(
    chosenServer,
    "",
    {bytes: parseInt(dataLimit)}
  );
}