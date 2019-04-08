import {BaseContract, BaseModel} from "./BaseContract";
import Web3 from "web3";
import {BehaviorSubject, Observable} from "rxjs";

const ABI = [];

export class UserProfile extends BaseContract {

    constructor(contractAddress: string, web3: Web3, userAddress: string) {
        super(ABI, contractAddress, web3, userAddress);
      this.model = new BehaviorSubject<UserProfileModel>(null);
    }

    async init(): Promise<void> {
      const profileModel: UserProfileModel = {
        address: this.userAddress,
        owner: await this.contract.methods.owner().call(),
        description: await this.contract.methods.description().call(),
        numberOfPosts: await this.contract.methods.numberOfPosts().call(),
        picture: await this.contract.methods.picture().call(),
        pictureType: await this.contract.methods.pictureType().call(),
        userName: await this.contract.methods.username.call()
      };

      this.model.next(profileModel);

    }

  getModel(): Observable<UserProfileModel> {
    return (this.model as BehaviorSubject<UserProfileModel>).asObservable();
  }


}

export interface UserProfileModel extends BaseModel {
  userName: string;
  picture: string;
  pictureType: string;
  description: string;
  numberOfPosts: number;
}
