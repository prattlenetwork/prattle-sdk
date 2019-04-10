import Loki from 'lokijs';
import {BehaviorSubject, Observable} from "rxjs";
import {Crypto} from "./Crypto";
import {UserProfileModel} from "./contracts/UserProfile";
import {Post, PostModel} from "./contracts/Post";
import {Contract} from 'web3-eth-contract';

export class Storage {

    private db: Loki;
    private keys: Collection<Key>;
    private profiles: Collection<UserProfileModel>;
    private posts: Collection<PostModel>;
    private initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private privateKey: BehaviorSubject<Key> = new BehaviorSubject<Key>(null);
    private userAddress: BehaviorSubject<string> = new BehaviorSubject(null);

    constructor(platform: ("NATIVESCRIPT" | "NODEJS" | "BROWSER")) {
        this.db = new Loki('Prattle', {
            env: platform,
            autoload: true,
            autoloadCallback: () => {
                this.init();
            },
            autosave: true,
            autosaveInterval: 1000
        });

        this.initialized.subscribe((value => {
            if (value) {
                this.privateKey.next(this.keys.findOne({type: KeyType.PrivateKey}));
                const publicKey = Crypto.getPublicKey(Uint8Array.from(this.privateKey.value.value));
                this.userAddress.next(Crypto.getUserAddress(publicKey));
                console.log('storage initialized');
            }
        }));
    }

    init() {
        this.keys = this.db.getCollection('keys');
        if (!this.keys) {
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

        this.posts = this.db.getCollection('posts');
        if (!this.posts) {
            this.posts = this.db.addCollection('posts', {unique: ['address']});
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

    getProfile(address: string): UserProfileModel {
        return this.profiles.findOne({address: address.toLowerCase()});
    }

    getPost(address: string): PostModel {
        return this.posts.findOne({address: address.toLowerCase()});
    }


    addOrUpdateProfile(profile: UserProfileModel) {
        const profileModel = this.profiles.findOne({address: profile.address.toLowerCase()});
        if (profileModel) {

            //TODO: magic
        } else {
            profile.address = profile.address.toLowerCase();
            this.profiles.insert(profile);
        }
    }


    addOrUpdatePost(post: PostModel) {
        post.address = post.address.toLowerCase();

        const postModel = this.posts.findOne({address: post.address});
        if (postModel) {
            this.posts.update(post);
            console.log('updated', post.address);
        } else {
            this.posts.insert(post);
            console.log('inserted', post.address);
        }
    }


    async getOrLoadPost(contract: Contract): Promise<{ model: PostModel, cacheHit: boolean }> {
        const postModel = this.posts.findOne({address: contract.options.address.toLowerCase()});
        if (postModel) {
            return new Promise<{ model: PostModel, cacheHit: boolean }>(resolve => resolve({
                model: postModel,
                cacheHit: true
            }));
        }
        const post = await Post.loadModel(contract);
        return {
            model: post,
            cacheHit: false
        };

    }


}

export enum KeyType {
    PrivateKey
}

export interface Key {
    type: KeyType,
    value: number[]
}
