export default async function DeleteKey(accessKey) {
  await accessKey.delete();
}