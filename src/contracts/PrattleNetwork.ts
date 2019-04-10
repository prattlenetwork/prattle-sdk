import {BaseContract, BaseModel} from "./BaseContract";
import {Users} from "./Users";
import {BehaviorSubject, Observable} from "rxjs";
import {PrattleSDK} from "../index";

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
    private users: BehaviorSubject<Users> = new BehaviorSubject<Users>(null);

    constructor(contractAddress: string) {
        super(ABI, contractAddress);
        this.model = new BehaviorSubject<PrattleNetworkModel>(null);
    }

    async init(): Promise<void> {
        console.log('init maincontract..');
        const prattleNetworkModel: PrattleNetworkModel = {
            address: PrattleSDK.userAddress,
            owner: await this.contract.methods.owner().call(),
            usersAddress: await this.contract.methods.users().call()
        };
        console.log('maincontract model: ', prattleNetworkModel);
        this.model.next(prattleNetworkModel);

        //TODO: test
        console.log('usersAddress', prattleNetworkModel.usersAddress);
        const users = new Users(prattleNetworkModel.usersAddress);
        await users.init();
        console.log('initialized users');
        this.users.next(users);

    }

    getModel(): Observable<PrattleNetworkModel> {
        return (this.model as BehaviorSubject<PrattleNetworkModel>).asObservable();
    }

    getUsers(): Observable<Users> {
        return this.users.asObservable();
    }

}

export interface PrattleNetworkModel extends BaseModel {
    usersAddress: string;
}
