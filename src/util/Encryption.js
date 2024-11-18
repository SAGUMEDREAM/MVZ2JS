export const secretKey = "CBCC9D34B7B7A685783F3A6EE741F320-A47281DF81E58FC41DE03824041DE6F8-2AA4CEFCBE59795057DFD3E4B2F3EFA8";
export class Encryption {
    static encode(ctxString) {
        return Encryption.encrypt(ctxString,secretKey)
    }
    static decode(ctxString) {
        return Encryption.decrypt(ctxString,secretKey)
    }
    static encrypt(text, secretKey) {
        const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
        return encrypted;
    }

    static decrypt(text, secretKey) {
        const bytes = CryptoJS.AES.decrypt(text, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted;
    }
}
