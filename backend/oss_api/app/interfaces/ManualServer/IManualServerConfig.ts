// Configuration for manual servers.  This is the output emitted from the
// shadowbox install script, which is needed for the manager connect to
// shadowbox.
export default interface IManualServerConfig {
  apiUrl: string;
  certSha256: string;
}