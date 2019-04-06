import Loki from 'lokijs';
import {BehaviorSubject, Observable} from "rxjs";
import { Crypto } from "./Crypto";
import {UserProfileModel} from "./contracts/UserProfile";


export class Storage {

    private db: Loki;
    private keys: Collection<Key>;
    private profiles: Collection<UserProfileModel>;
    private initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private privateKey: BehaviorSubject<Key> = new BehaviorSubject<Key>(null);
    private userAddress: BehaviorSubject<string> = new BehaviorSubject(null);

    constructor() {
        this.db = new Loki('Prattle', {
            autoload: true,
            autoloadCallback: () => {
                this.init();
            },
            autosave: true,
            autosaveInterval: 1000
        });

        this.initialized.subscribe((value => {
            if(value) {
                this.privateKey.next(this.keys.findOne({type: KeyType.PrivateKey}));
                const publicKey = Crypto.getPublicKey(Uint8Array.from(this.privateKey.value.value));
                this.userAddress.next(Crypto.getUserAddress(publicKey));
            }
        }));
    }

    init() {
        this.keys = this.db.getCollection('keys');
        if(!this.keys) {
            this.keys = this.db.addCollection('keys');
            this.keys.insert({
                type: KeyType.PrivateKey,
                value: Array.from(Crypto.generatePrivateKey())
            });
        }

        this.profiles = this.db.getCollection('profiles');
        if (!this.profiles) {
            this.profiles = this.db.addCollection('profiles');
        }

        this.initialized.next(true);
    }

    getInitialized(): Observable<boolean> {
        return this.initialized.asObservable();
    }

    getPrivateKey(): Observable<Key> {
        return this.privateKey.asObservable();
    }

    getUserAddress(): Observable<string> {
        return this.userAddress.asObservable();
    }



}

export enum KeyType {
    PrivateKey
}

export interface Key {
    type: KeyType,
    value: number[]
}
