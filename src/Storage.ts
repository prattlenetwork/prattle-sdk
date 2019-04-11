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
    private publicPosts: Collection<PublicPosts>;
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
                const publicKey = Crypto.getPublicKey(Uint8Array.from(this.privateKey.value.value as number[]));
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
            this.keys.insert({
                type: KeyType.LastUpdatedBlockNumber,
                value: 0
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

        this.publicPosts = this.db.getCollection('publicPosts');
        if (!this.publicPosts) {
            this.publicPosts = this.db.addCollection('publicPosts');
            this.publicPosts.insert({
                blockNumber: 0,
                postAddresses: []
            })
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

    getPublicPosts(): PublicPosts {
        return this.publicPosts.findOne({blockNumber: {'$gte': 0}});
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

    addOrUpdatePublicPosts(publicPosts: PublicPosts) {
        console.log('add public posts', publicPosts);
        const lastUpdated = this.keys.findOne({type: KeyType.LastUpdatedBlockNumber}).value as number;
        console.log('last updated', lastUpdated); // TODO: fix, is 0
        if (publicPosts.blockNumber > lastUpdated && publicPosts.postAddresses.length > 0) {
            this.publicPosts.clear();
            this.publicPosts.insert(publicPosts);
            console.log('inserted public posts');
        }
    }


}

export enum KeyType {
    PrivateKey, LastUpdatedBlockNumber
}

export interface Key {
    type: KeyType;
    value: number[] | number;
}

export interface PublicPosts {
    blockNumber: number;
    postAddresses: string[];
}
