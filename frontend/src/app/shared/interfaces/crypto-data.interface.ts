export interface ICryptoData {
  salt: string;
  dek: {
    cipherText: string;
    iv: string;
  };
  rsa: {
    publicKey: string;
    privateKey: {
      cipherText: string;
      iv: string;
    };
  };
}
