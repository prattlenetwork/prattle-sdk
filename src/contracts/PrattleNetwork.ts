import {BaseContract, BaseModel} from "./BaseContract";
import Web3 from "web3";
import {Users} from "./Users";
import {BehaviorSubject, Observable} from "rxjs";

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
      this.model = new BehaviorSubject<PrattleNetworkModel>(null);
    }

    async init(): Promise<void> {
      console.log('init maincontract..');
      const prattleNetworkModel: PrattleNetworkModel = {
        address: this.userAddress,
        owner: await this.contract.methods.owner().call(),
        usersAddress: await this.contract.methods.users().call()
      };
      console.log('maincontract model: ', prattleNetworkModel);
      this.model.next(prattleNetworkModel);

        //TODO: test
      console.log('usersAddress', prattleNetworkModel.usersAddress);
      this.users = new Users(prattleNetworkModel.usersAddress, this.web3, this.userAddress);
        console.log('users', this.users);
        await this.users.init();
    }

  getModel(): Observable<PrattleNetworkModel> {
    return (this.model as BehaviorSubject<PrattleNetworkModel>).asObservable();
  }

}

export interface PrattleNetworkModel extends BaseModel {
  usersAddress: string;
}
