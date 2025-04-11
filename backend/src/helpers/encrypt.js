import CryptoJS from "crypto-js";

const { JWT_ENCRYPT_SECRET } = process.env;

if (!JWT_ENCRYPT_SECRET) {
  throw new Error("JWT_ENCRYPT_SECRET is not defined");
}

export const encryptJWT = (token) => {
  return CryptoJS.AES.encrypt(token, JWT_ENCRYPT_SECRET).toString();
};

export const decryptJWT = (encryptedToken) => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, JWT_ENCRYPT_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};
