// Repository of ManualServer objects.  These are servers the user has setup
// themselves, and configured to run shadowbox, outside of the manager.
import IManualServerConfig from "./IManualServerConfig";
import {IManualServer} from "./IManualServer";

export default interface IManualServerRepository {
  // Lists all existing Shadowboxes.
  listServers(): Promise<IManualServer[]>;
  
  // Adds a manual server using the config (e.g. user input).
  addServer(config: IManualServerConfig): Promise<IManualServer>;
  
  // Retrieves a server with `config`.
  findServer(config: IManualServerConfig): IManualServer | undefined;
}