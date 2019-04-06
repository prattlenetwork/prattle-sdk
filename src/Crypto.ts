import {CryptoUtils, LocalAddress} from "loom-js";


export class  Crypto {
    public static generatePrivateKey(): Uint8Array {
        return CryptoUtils.generatePrivateKey();
    }

    public static getPublicKey(privateKey: Uint8Array): Uint8Array {
        return CryptoUtils.publicKeyFromPrivateKey(privateKey);
    }

    public static getUserAddress(publicKey: Uint8Array): string {
        return LocalAddress.fromPublicKey(publicKey).toString();
    }
}
