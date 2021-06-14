"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesInFolder = exports.getDoc = void 0;
const docs_1 = require("@googleapis/docs");
const drive_1 = require("@googleapis/drive");
function getJWT(config) {
    try {
        const scopes = ["https://www.googleapis.com/auth/documents.readonly", "https://www.googleapis.com/auth/drive.readonly"];
        return new docs_1.auth.JWT(config.client_email, undefined, config.private_key, scopes);
    }
    catch (error) {
        return String(error);
    }
}
function getDoc(config, documentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const auth = getJWT(config);
        if (typeof auth == "string") {
            throw Error(auth);
        }
        try {
            const resp = yield docs_1.docs({ version: "v1" }).documents.get({
                documentId,
                auth
            });
            return resp.data;
        }
        catch (error) {
            //More robust error handling TODO
            throw error;
        }
    });
}
exports.getDoc = getDoc;
function getFilesInFolder(config, folderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const auth = getJWT(config);
        if (typeof auth == "string") {
            throw Error(auth);
        }
        try {
            const resp = yield drive_1.drive({ version: "v3" }).files.list({
                q: `'${folderId}' in parents`,
                auth
            });
            return resp.data.files;
        }
        catch (error) {
            //More robust error handling TODO
            throw error;
        }
    });
}
exports.getFilesInFolder = getFilesInFolder;
//# sourceMappingURL=connect.js.map