import {BaseContract} from "./BaseContract";
import Web3 from "web3";
import {Users} from "./Users";

const ABI = [
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
        'inputs': [],
        'name': 'users',
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
        'inputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'constructor'
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
    }
];

export class PrattleNetwork extends BaseContract {
    private users: Users;

    constructor(contractAddress: string, web3: Web3, userAddress: string) {
        super(ABI, contractAddress, web3, userAddress);
    }

    async init(): Promise<void> {
        const usersAddress = await this.contract.methods.users().call();
        //TODO: test
        console.log('usersAddress', usersAddress);
        this.users = new Users(usersAddress, this.web3, this.userAddress);
        console.log('users', this.users);
        await this.users.init();
    }

}
