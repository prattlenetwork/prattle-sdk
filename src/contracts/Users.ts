import {BaseContract, BaseModel} from "./BaseContract";
import Web3 from "web3";
import {BehaviorSubject, Observable} from "rxjs";
import {Post} from "./Post";

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

    constructor(contractAddress: string, web3: Web3, userAddress: string) {
        super(ABI, contractAddress, web3, userAddress);
      this.model = new BehaviorSubject<UsersModel>(null);
    }

    async init(): Promise<void> {
      const postAddresses = await this.getPublicPostAddresses();
      await this.loadPosts(postAddresses);
    }

  async loadPosts(addresses: string[]) {
    const posts = await Promise.all(addresses.map(async postAddress => {
      const post = new Post(postAddress, this.web3, this.userAddress);
      //TODO: load content, maybe init later
      await post.init();

      return post;
    }));
    console.log('loaded all posts', posts);
    this.posts.next(posts);
  }

  async getPublicPostAddresses(): Promise<string[]> {
    const events = await this.contract.getPastEvents('Posted', {
      fromBlock: 0,
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
  userAddresses: string[];
}
