export default interface IException {
  errName: string;
  code: string;
  httpCustomStatusCode: number;
  userError: string;
  detail: string;
}