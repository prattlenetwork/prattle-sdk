import {BaseContract, BaseModel} from "./BaseContract";
import {BehaviorSubject, Observable} from "rxjs";
import {PrattleSDK} from "../index";
import {Contract} from 'web3-eth-contract';

const ABI: any = [
    {
        'constant': true,
        'inputs': [],
        'name': 'shares',
        'outputs': [
            {
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'text',
        'outputs': [
            {
                'name': '',
                'type': 'string'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'comments',
        'outputs': [
            {
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'isSharing',
        'outputs': [
            {
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'parent',
        'outputs': [
            {
                'name': '',
                'type': 'address'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'owner',
        'outputs': [
            {
                'name': '',
                'type': 'address'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [
            {
                'name': '',
                'type': 'address'
            }
        ],
        'name': 'ratings',
        'outputs': [
            {
                'name': '',
                'type': 'int256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'ipfsFile',
        'outputs': [
            {
                'name': '',
                'type': 'string'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'timestamp',
        'outputs': [
            {
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'likes',
        'outputs': [
            {
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'dislikes',
        'outputs': [
            {
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'ipfsFileType',
        'outputs': [
            {
                'name': '',
                'type': 'string'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'name': 'newOwner',
                'type': 'address'
            }
        ],
        'name': 'transferOwnership',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'name': 'message',
                'type': 'string'
            },
            {
                'name': 'ipfs',
                'type': 'string'
            },
            {
                'name': 'ipfsType',
                'type': 'string'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'constructor'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': false,
                'name': 'sharedBy',
                'type': 'address'
            },
            {
                'indexed': false,
                'name': 'timestamp',
                'type': 'uint256'
            }
        ],
        'name': 'Shared',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': false,
                'name': 'post',
                'type': 'address'
            },
            {
                'indexed': false,
                'name': 'timestamp',
                'type': 'uint256'
            }
        ],
        'name': 'CommentPosted',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': false,
                'name': 'user',
                'type': 'address'
            },
            {
                'indexed': false,
                'name': 'rating',
                'type': 'int256'
            }
        ],
        'name': 'Rated',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': false,
                'name': 'newOwner',
                'type': 'address'
            }
        ],
        'name': 'TransferredOwnership',
        'type': 'event'
    },
    {
        'constant': false,
        'inputs': [
            {
                'name': 'newRating',
                'type': 'int256'
            }
        ],
        'name': 'rate',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'name': 'post',
                'type': 'address'
            }
        ],
        'name': 'comment',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'name': 'post',
                'type': 'address'
            }
        ],
        'name': 'share',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'name': 'post',
                'type': 'address'
            }
        ],
        'name': 'setParent',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'name': 'shared',
                'type': 'bool'
            }
        ],
        'name': 'setSharing',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    }
];

export class Post extends BaseContract {

    constructor(contractAddress: string) {
        super(ABI, contractAddress);
        this.model = new BehaviorSubject<PostModel>(null);
    }

    public static async loadModel(contract: Contract): Promise<PostModel> {
        console.log('load static post');

        const postModel: PostModel = {
            address: contract.options.address,
            owner: await contract.methods.owner().call(),
            text: await contract.methods.text().call(),
            ipfsFile: await contract.methods.ipfsFile().call(),
            ipfsType: await contract.methods.ipfsFileType().call(),
            timestamp: await contract.methods.timestamp().call(),
            likes: await contract.methods.likes().call(),
            dislikes: await contract.methods.dislikes().call(),
            comments: await contract.methods.comments().call(),
            shares: await contract.methods.shares().call(),
            parent: await contract.methods.parent().call(),
            isSharing: await contract.methods.isSharing().call(),
            myRating: await contract.methods.ratings(PrattleSDK.userAddress).call(),
        };
        console.log('loaded static post', postModel);
        return postModel;
    }

    async init(): Promise<void> {
        console.log('init post..');
        const {model: postModel, cacheHit: cached} = await PrattleSDK.storage.getOrLoadPost(this.contract);

        console.log('post model: ', postModel);
        this.model.next(postModel);
        if (!cached) {
            console.log('add or update post');
            PrattleSDK.storage.addOrUpdatePost(postModel);
        }
    }

    getModel(): Observable<PostModel> {
        return (this.model as BehaviorSubject<PostModel>).asObservable();
    }

}

export interface PostModel extends BaseModel {
    text: string;
    ipfsFile: string;
    ipfsType: string;
    timestamp: number;
    likes: number;
    dislikes: number;
    comments: number;
    shares: number;
    parent: string;
    isSharing: boolean;
    myRating: number;
}
