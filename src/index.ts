import Web3 from "web3";
import {Key, PrattleNetwork, Storage} from "./internal";
import {BehaviorSubject, Observable} from "rxjs";

export {BaseContract} from "./internal";
export {Post} from "./internal";
export {PrattleNetwork} from "./internal";
export {UserProfile} from "./internal";
export {Users} from "./internal";

export {Crypto} from "./internal";


export class PrattleSDK {
    private mainContract: BehaviorSubject<PrattleNetwork> = new BehaviorSubject<PrattleNetwork>(null);
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
                        const prattle = new PrattleNetwork(this.mainContractAddress);
                        await prattle.init();
                        this.mainContract.next(prattle);
                    }
                });
            }
        });

    }

    public getMainContract(): Observable<PrattleNetwork> {
        return this.mainContract.asObservable();
    }
}

