import {BaseContract, BaseModel} from "./BaseContract";
import {BehaviorSubject, Observable} from "rxjs";
import {Post} from "./Post";
import {PrattleSDK} from "../index";
import {PublicPosts} from "../Storage";

const ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "numberOfUsers",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "userProfileOf",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "post",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "Posted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "profile",
                "type": "address"
            }
        ],
        "name": "RegisterSuccess",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "userName",
                "type": "string"
            }
        ],
        "name": "registerUser",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "post",
                "type": "address"
            },
            {
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "postPublicly",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export class Users extends BaseContract {

    private posts: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);

    constructor(contractAddress: string) {
        super(ABI, contractAddress);
        this.model = new BehaviorSubject<UsersModel>(null);
    }

    async init(): Promise<void> {
        const cachedPosts = PrattleSDK.storage.getPublicPosts();
        if (cachedPosts.postAddresses.length > 0) {
            await this.loadPosts(cachedPosts.postAddresses);
            console.log('LOADED cached posts from block: ', cachedPosts.blockNumber, cachedPosts.postAddresses);
        }

        const currentBlock: number = await PrattleSDK.web3.eth.getBlockNumber();
        const postAddresses = await this.getPublicPostAddresses(cachedPosts.blockNumber);
        await this.loadPosts(postAddresses);

        setTimeout(() => {
            console.log('DELAYED UPDATE');
            const allPostAddresses = cachedPosts.postAddresses.concat(postAddresses.filter(address => {
                return cachedPosts.postAddresses.indexOf(address) < 0;
            }));

            PrattleSDK.storage.addOrUpdatePublicPosts({
                blockNumber: currentBlock,
                postAddresses: allPostAddresses
            });
        }, 1000);



        console.log('UPDATED cached posts from block:', currentBlock, postAddresses)
    }

    async loadPosts(addresses: string[]) {
        const posts = await Promise.all(addresses.map(async postAddress => {
            const post = new Post(postAddress);
            //TODO: load content, maybe init later
            await post.init();

            return post;
        }));
        console.log('loaded all posts', posts);


        const allPosts = this.posts.value.concat(posts.filter(post => {
            return this.posts.value.indexOf(post) < 0;
        }));

        console.log('merged Posts', allPosts);


        this.posts.next(allPosts);
        console.log('UPDATE POSTS SDK');
    }


    async getPublicPostAddresses(sinceBlock: number): Promise<string[]> {
        const events = await this.contract.getPastEvents('Posted', {
            fromBlock: sinceBlock,
            toBlock: 'latest'
        });


        return events.map(event => {
            return event.returnValues.post;
        });
    }

    getModel(): Observable<UsersModel> {
        return (this.model as BehaviorSubject<UsersModel>).asObservable();
    }

    getPublicPosts(): Observable<Post[]> {
        return this.posts.asObservable();
    }

}

export interface UsersModel extends BaseModel {
    publicPosts: PublicPosts;
}
