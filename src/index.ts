import Web3 from "web3";
import {Key, Storage} from "./Storage";

import {PrattleNetwork} from "./contracts/PrattleNetwork";

export {BaseContract} from "./contracts/BaseContract";
export {Post} from "./contracts/Post";
export {PrattleNetwork} from "./contracts/PrattleNetwork";
export {UserProfile} from "./contracts/UserProfile";
export {Users} from "./contracts/Users";

export {Crypto} from "./Crypto";


export class PrattleSDK {
    mainContract: PrattleNetwork;
    public static storage: Storage;
    public static web3: Web3;
    public static userAddress: string;

    constructor(private mainContractAddress: string, platform: ("NATIVESCRIPT" | "NODEJS" | "BROWSER")) {
        PrattleSDK.storage = new Storage(platform);
    }

    public async initKeys(): Promise<Key> {
        return new Promise<Key>(resolve => {
            PrattleSDK.storage.getInitialized().subscribe(initialized => {
                if (initialized) {
                    PrattleSDK.storage.getPrivateKey().subscribe(privateKey => {
                        resolve(privateKey);
                    });
                }
            });
        });
    }

    public async init(web3: Web3) {
        PrattleSDK.web3 = web3;
        PrattleSDK.storage.getInitialized().subscribe(initialized => {
            if (initialized) {
                PrattleSDK.storage.getUserAddress().subscribe(async userAddress => {
                    if (userAddress) {
                        PrattleSDK.userAddress = userAddress;
                        console.log('address:', userAddress);
                        this.mainContract = new PrattleNetwork(this.mainContractAddress);
                        await this.mainContract.init();
                    }
                });
            }
        });

    }
}

