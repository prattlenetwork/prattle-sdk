import {BaseContract} from "./BaseContract";
import Web3 from "web3";

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
    constructor(contractAddress: string, web3: Web3, userAddress: string) {
        super(ABI, contractAddress, web3, userAddress);
    }

    async init(): Promise<void> {

    }

}
