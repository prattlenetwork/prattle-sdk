import Web3 from "web3";
import {Contract} from 'web3-eth-contract';


export abstract class BaseContract {
    protected contract: Contract;
    protected web3: Web3;
    protected userAddress: string;



    protected constructor(abi: any, contractAddress: string, web3: Web3, userAddress: string) {
        this.contract = new web3.eth.Contract(abi, contractAddress, {
            from: userAddress,
            gasPrice: '0',
            gas: 1000000,
            data: null
        });
        this.web3 = web3;
        this.userAddress = userAddress;
    }

    abstract async init(): Promise<void>;
}
