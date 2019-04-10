import {Contract} from 'web3-eth-contract';
import {BehaviorSubject, Observable} from "rxjs";
import {PrattleSDK} from "../index";

export abstract class BaseContract {
    protected contract: Contract;
    protected model: BehaviorSubject<BaseModel>;

    // TODO: fuck this members
    protected constructor(abi: any, contractAddress: string) {
        this.contract = new PrattleSDK.web3.eth.Contract(abi, contractAddress, {
            from: PrattleSDK.userAddress,
            gasPrice: '0',
            gas: 1000000,
            data: null
        });
    }

    public abstract getModel(): Observable<BaseModel>;

    abstract async init(): Promise<void>;
}

export interface BaseModel {
    owner: string;
    address: string
}
