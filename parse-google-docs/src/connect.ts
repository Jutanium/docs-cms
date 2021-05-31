
import {docs_v1, drive_v3, google} from "googleapis";

type config = {
  client_email: string,
  private_key: string
}

function getJWT(config: config) {
  const scopes = ["https://www.googleapis.com/auth/documents.readonly", "https://www.googleapis.com/auth/drive.readonly"];
  return new google.auth.JWT(config.client_email, undefined, config.private_key, scopes);
}

export async function getDoc(config: config, documentId: string): Promise<docs_v1.Schema$Document | undefined> {
  const auth = getJWT(config);

  try {
    const resp = await google.docs({version: "v1"}).documents.get({
      auth,
      documentId
    })
    return resp.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function getFilesInFolder(config: config, folderId: string): Promise<Array<drive_v3.Schema$File> | undefined> {

  const auth = getJWT(config);

  try {
    const resp = await google.drive({version: "v3"}).files.list({
      auth,
      q: `'${folderId}' in parents`
    });
    return resp.data.files;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}