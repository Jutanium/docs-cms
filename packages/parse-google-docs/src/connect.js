import { docs, auth } from "@googleapis/docs";
import { drive } from "@googleapis/drive";
function getJWT(config) {
    const scopes = ["https://www.googleapis.com/auth/documents.readonly", "https://www.googleapis.com/auth/drive.readonly"];
    return new auth.JWT(config.client_email, undefined, config.private_key, scopes);
}
export async function getDoc(config, documentId) {
    const auth = getJWT(config);
    try {
        const resp = await docs({ version: "v1" }).documents.get({
            auth,
            documentId
        });
        return resp.data;
    }
    catch (error) {
        console.error(error);
        return undefined;
    }
}
export async function getFilesInFolder(config, folderId) {
    const auth = getJWT(config);
    try {
        const resp = await drive({ version: "v3" }).files.list({
            auth,
            q: `'${folderId}' in parents`
        });
        return resp.data.files;
    }
    catch (error) {
        console.error(error);
        return undefined;
    }
}
//# sourceMappingURL=connect.js.map