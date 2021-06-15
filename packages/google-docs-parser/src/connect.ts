
import {docs_v1, docs, auth,} from "@googleapis/docs";
import {drive, drive_v3} from "@googleapis/drive"
type config = {
  client_email: string,
  private_key: string
}

function getJWT(config: config) {
  try {
    const scopes = ["https://www.googleapis.com/auth/documents.readonly", "https://www.googleapis.com/auth/drive.readonly"];
    return new auth.JWT(config.client_email, undefined, config.private_key, scopes);
  } catch (error) {
    return String(error);
  }
}

export async function getDoc(config: config, documentId: string): Promise<docs_v1.Schema$Document | undefined> {
  const auth = getJWT(config);
  if (typeof auth == "string") {
    throw Error(auth);
  }

  try {
    const resp = await docs({version: "v1"}).documents.get({
      documentId,
      auth
    })
    return resp.data;
  } catch (error) {
    //More robust error handling TODO
    throw error;
  }
}

export async function getFilesInFolder(config: config, folderId: string): Promise<Array<drive_v3.Schema$File> | undefined> {

  const auth = getJWT(config);
  if (typeof auth == "string") {
    throw Error(auth);
  }

  try {
    const resp = await drive({version: "v3"}).files.list({
      q: `'${folderId}' in parents`,
      auth
    });
    return resp.data.files;
  } catch (error) {
    //More robust error handling TODO
    throw error;
  }
}