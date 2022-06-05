import {AccessKey} from "../../models/AccessKey";

export default async function DeleteKey(accessKey: AccessKey) {
  await accessKey.delete();
}