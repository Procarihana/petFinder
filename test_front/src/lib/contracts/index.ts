import {moudleName, networkConfig, suiClient, suiGraphQLClient} from "@/networkConfig";
import {AdoptContract, AdoptContracts, AnimalContracts, Contracts, Record, UserContracts} from "@/type";
import {SuiObjectData, SuiObjectResponse, SuiParsedData} from "@mysten/sui/client";
import {Transaction} from "@mysten/sui/transactions";
import {isValidSuiAddress, SUI_SYSTEM_STATE_OBJECT_ID, SUI_TYPE_ARG} from "@mysten/sui/utils";
import queryFolderDataContext from "./graphContext";
import {useCurrentAccount} from "@mysten/dapp-kit";
import {useEffect, useState} from "react";


/*
     public entry fun create_adopt_contract(
        // 领养人的x账号，用于校验用户信息
        x_id: String,
        // 领养动物id
        animal_id: String,
        // 领养合约金额
        amount: u64,
        // 领养人链上地址(用于校验用户以及退还押金)
        adopter_address: address,
        // 合约记录
        contracts: &mut AdoptContracts,
        // 合约需要记录的次数
        record_times: u64,
        // 捐赠给平台的币
        donateAmount: u64,
        // 获取 transcation 需要的信息
        ctx: &mut TxContext,
    )*/

export const createAdoptContract = async (xId: string,
                                          animal_id: string,
                                          amount: number,
                                          // 领养人链上地址(用于校验用户以及退还押金)
                                          adopterAddress: string,
                                          // 合约需要记录的次数
                                          recordTimes: number,
                                          // 捐赠给平台的币
                                          donateAmount: number) => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "apply_for_adoption",
        function: "create_adopt_contract",
        arguments: [
            tx.pure.string(xId),
            tx.pure.string(animal_id),
            tx.pure.u64(amount),
            tx.pure.address(adopterAddress),
            tx.object(networkConfig.testnet.adoptContracts),
            tx.pure.u64(recordTimes),
            tx.pure.u64(donateAmount)
        ]
    })
    return tx;
}

export const adoptContractsQuery = async () => {
    const adoptContracts = await suiClient.getObject({
        id: networkConfig.testnet.adoptContracts,
        options: {
            showContent: true
        }
    })
    const contract = await suiClient.getObject({
        id: "0xa6823bf196a9f709d5fcf53051e886d7bd839142a4d8cf7ad93898ba340fe719",
        options: {
            showContent: true
        }
    })
    debugger
    console.log(adoptContracts)
    console.log(contract)

    // events.data.forEach((event) => {
    //     debugger
    //     console.log(event.parsedJson)
    //     // const adoptContracts = event.parsedJson as User;
    //     // state.users.push(user);
    // })
    return adoptContracts;
}

const getSuiSystemState = async () => {
    const suiSystemState = suiClient.getObject({
        id: SUI_SYSTEM_STATE_OBJECT_ID,
        options: {
            showContent: true
        }
    });
    return suiSystemState;
};

export const getFirstSuiCoinObjectId = async (address:string) => {
    const coins = suiClient.getCoins({
        owner: address,
        coinType: SUI_TYPE_ARG
    });
    coins.then((res) => {
        debugger
        console.log(1)
        if (res.data.length > 0) {
            return res.data[0].coinObjectId;
        } else {
            console.log("缺少合约")
            return '';
        }
    })
};

/*
    public fun sign_adopt_contract(contract_id: ID,
    adopt_contains: &mut AdoptContracts,
    coin: &mut Coin<SUI>,
    system_state: &mut SuiSystemState,
    validator_address: address,
    public_uid: &mut PublicUid,
    ctx: &mut TxContext) {
 */
export const signContract = async (contractId: string, validatorAddress: string,suiCoinObjectId:string) => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "apply_for_adoption",
        function: "sign_adopt_contract",
        arguments: [
            tx.pure.id(contractId),
            tx.object(networkConfig.testnet.adoptContracts),
            // coin
            tx.object(suiCoinObjectId),
            // suiSystemState
            tx.object(SUI_SYSTEM_STATE_OBJECT_ID),
            tx.pure.address(validatorAddress),
            tx.object(networkConfig.testnet.publicUid)
        ]
    })
    return tx;
}