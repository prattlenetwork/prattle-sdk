import {BaseContract} from "./BaseContract";
import Web3 from "web3";

const ABI = [];

export class UserProfile extends BaseContract {
    constructor(contractAddress: string, web3: Web3, userAddress: string) {
        super(ABI, contractAddress, web3, userAddress);
    }

    async init(): Promise<void> {

    }
}

export interface UserProfileModel {
    name: string,
    owner: string,
    address: string
}
