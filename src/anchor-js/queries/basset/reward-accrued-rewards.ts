import { LCDClient } from "@terra-money/terra.js";
import { AddressProvider } from "../../address-provider/types";

interface Option {
  lcd: LCDClient;
  bAsset: string;
  address: string;
}
interface AccruedReward {
  rewards: string;
}

export const queryRewardAccrued = ({ lcd, bAsset, address }: Option) => async (
  addressProvider: AddressProvider.Provider
): Promise<AccruedReward> => {
  const bAssetContractAddress = addressProvider.bAssetReward(bAsset);
  let reponse: AccruedReward = await lcd.wasm.contractQuery(
    bAssetContractAddress,
    {
      accrued_rewards: {
        address: address,
      },
    }
  );
  return reponse;
};