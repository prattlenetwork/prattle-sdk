import Web3 from "web3";
import {Key, Storage} from "./Storage";

import {PrattleNetwork} from "./contracts/PrattleNetwork";


export class PrattleSDK {
    mainContract: PrattleNetwork;
    public storage: Storage;
    private web3: Web3;

    constructor(private mainContractAddress: string, platform: ("NATIVESCRIPT" | "NODEJS" | "BROWSER")) {
        this.storage = new Storage(platform);
    }

    public async initKeys(): Promise<Key> {
        return new Promise<Key>(resolve => {
            this.storage.getInitialized().subscribe(initialized => {
                if (initialized) {
                    this.storage.getPrivateKey().subscribe(privateKey => {
                        resolve(privateKey);
                    });
                }
            });
        });
    }

    public async init(web3: Web3) {
        this.web3 = web3;
        this.storage.getInitialized().subscribe(initialized => {
            if (initialized) {
                this.storage.getUserAddress().subscribe(async userAddress => {
                    if (userAddress) {
                        console.log('address:', userAddress);
                        this.mainContract = new PrattleNetwork(this.mainContractAddress, this.web3, userAddress);
                        await this.mainContract.init();
                    }
                });
            }
        });

    }
}

