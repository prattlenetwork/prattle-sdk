import Loki from 'lokijs';
import {BehaviorSubject, Observable} from "rxjs";
import {CachedPosts, Crypto, Post, PostModel, UserProfileModel} from "./internal";
import {Contract} from 'web3-eth-contract';

export class Storage {

    private db: Loki;
    private keys: Collection<Key>;
    private profiles: Collection<UserProfileModel>;
    private posts: Collection<PostModel>;
    private cachedPosts: Collection<CachedPosts>;
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
            this.keys = this.db.addCollection('keys', {unique: ['type']});
            this.keys.insert({
                type: KeyType.PrivateKey,
                value: Array.from(Crypto.generatePrivateKey())
            });
            this.setLastUpdatedBlock(0);
        }

        this.profiles = this.db.getCollection('profiles');
        if (!this.profiles) {
            this.profiles = this.db.addCollection('profiles');
        }

        this.posts = this.db.getCollection('posts');
        if (!this.posts) {
            this.posts = this.db.addCollection('posts', {unique: ['address']});
        }

        this.cachedPosts = this.db.getCollection('cachedPosts');
        if (!this.cachedPosts) {
            this.cachedPosts = this.db.addCollection('cachedPosts', {unique: ['parent']});
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

    addOrUpdateCachedPosts(cachedPosts: CachedPosts) {
        console.log('add comment posts', cachedPosts);
        const lastUpdated = this.getLastUpdatedBlock();
        console.log('last comment updated', lastUpdated);
        if (cachedPosts.blockNumber > lastUpdated && cachedPosts.postAddresses.length > 0) {
            // update existing
            const cached = this.cachedPosts.findOne({parent: cachedPosts.parent});
            if (cached) {
                cached.blockNumber = cachedPosts.blockNumber;
                cached.postAddresses = cachedPosts.postAddresses;
                this.cachedPosts.update(cached);
            } else {
                this.cachedPosts.insert(cachedPosts);
            }

            this.setLastUpdatedBlock(cachedPosts.blockNumber);
            console.log('inserted comment posts');
        }
    }

    getPublicPosts(): CachedPosts {
        return this.getComments('PUBLIC');
    }

    getComments(address: string): CachedPosts {
        const cached = this.cachedPosts.findOne({parent: address});
        return cached ? cached : {
            parent: address,
            postAddresses: [],
            blockNumber: 0
        };
    }


    private setLastUpdatedBlock(blockNumber: number) {
        const lastUpdated = this.keys.findOne({type: KeyType.LastUpdatedBlockNumber});
        if (lastUpdated) {
            lastUpdated.value = blockNumber;
            this.keys.update(lastUpdated);
        } else {
            this.keys.insert({
                type: KeyType.LastUpdatedBlockNumber,
                value: blockNumber
            });
        }
        console.log('updated last block: ', blockNumber);
    }

    private getLastUpdatedBlock(): number {
        return this.keys.findOne({type: KeyType.LastUpdatedBlockNumber}).value as number;
    }


}

export enum KeyType {
    PrivateKey, LastUpdatedBlockNumber
}

export interface Key {
    type: KeyType;
    value: number[] | number;
}
