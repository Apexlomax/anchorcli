import {
  Coin,
  Coins,
  Dec,
  Int,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { validateInput } from '../../utils/validate-input';
import { validateAddress } from '../../utils/validation/address';
import {
  validateIsGreaterThanZero,
  validateIsNumber,
} from '../../utils/validation/number';
import { AddressProvider } from '../../address-provider/types';

interface Option {
  address: string;
  amount: string;
  denom: string;
  to?: string;
  beliefPrice?: string;
  maxSpread?: string;
}

export const fabricatebSwapLuna = ({
  address,
  amount,
  to,
  beliefPrice,
  maxSpread,
  denom,
}: Option) => (
  addressProvider: AddressProvider.Provider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateIsNumber(amount),
    validateIsGreaterThanZero(+amount),
  ]);
  const coins = new Coins([
    new Coin(denom, new Int(new Dec(amount).mul(1000000)).toString()),
  ]);
  const pairAddress = addressProvider.terraswapPair();
  return [
    new MsgExecuteContract(
      address,
      pairAddress,
      {
        swap: {
          offer_asset: {
            info: {
              native_token: {
                denom: denom,
              },
            },
            amount: new Int(new Dec(amount).mul(1000000)).toString(),
          },
          belief_price: beliefPrice,
          max_spread: maxSpread,
          to: to,
        },
      },
      coins,
    ),
  ];
};