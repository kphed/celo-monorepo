import BigNumber from 'bignumber.js'
import { Tx } from 'web3/eth/types'
import { IRpcCaller } from './rpc-caller'

// Default gateway fee to send the serving full-node on each transaction.
// TODO(nategraf): Provide a method of fecthing the gateway fee value from the full-node peer.
const DefaultGatewayFee = new BigNumber(10000)

export class MissingTxParamsPopulator {
  private chainId: number | null = null
  private gatewayFeeRecipient: string | null = null

  constructor(readonly rpc: IRpcCaller) {}

  public async populate(celoTxParams: Tx): Promise<Tx> {
    const txParams = { ...celoTxParams }

    if (txParams.chainId == null) {
      txParams.chainId = await this.getChainId()
    }

    if (txParams.nonce == null) {
      txParams.nonce = await this.getNonce(txParams.from!)
    }

    if (!txParams.gas || this.isEmpty(txParams.gas.toString())) {
      txParams.gas = await this.getEstimateGas(txParams)
    }

    if (this.isEmpty(txParams.gatewayFeeRecipient)) {
      txParams.gatewayFeeRecipient = await this.getCoinbase()
    }

    if (!this.isEmpty(txParams.gatewayFeeRecipient) && this.isEmpty(txParams.gatewayFee)) {
      txParams.gatewayFee = DefaultGatewayFee.toString(16)
    }

    if (!txParams.gasPrice || this.isEmpty(txParams.gasPrice.toString())) {
      txParams.gasPrice = await this.getGasPrice(txParams.feeCurrency)
    }

    return txParams
  }

  private async getChainId(): Promise<number> {
    if (this.chainId === null) {
      // Reference: https://github.com/ethereum/wiki/wiki/JSON-RPC#net_version
      const result = await this.rpc.call('net_version', [])
      this.chainId = parseInt(result.result.toString(), 10)
    }
    return this.chainId
  }

  private async getNonce(address: string): Promise<string> {
    // Reference: https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactioncount
    const result = await this.rpc.call('eth_getTransactionCount', [address, 'pending'])
    const nonce = result.result.toString()
    return nonce
  }

  private async getEstimateGas(txParams: Tx): Promise<string> {
    // Reference: https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_estimategas
    const gasResult = await this.rpc.call('eth_estimateGas', [txParams])
    const gas = gasResult.result.toString()
    return gas
  }

  private async getCoinbase(): Promise<string> {
    if (this.gatewayFeeRecipient === null) {
      // Reference: https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_coinbase
      const result = await this.rpc.call('eth_coinbase', [])
      this.gatewayFeeRecipient = result.result.toString()
    }
    if (this.gatewayFeeRecipient == null) {
      throw new Error(
        `Coinbase is null, we are not connected to a full node, cannot sign transactions locally`
      )
    }
    return this.gatewayFeeRecipient
  }

  private async getGasPrice(feeCurrency: string | undefined): Promise<string | undefined> {
    // Gold Token
    if (!feeCurrency) {
      return this.getGasPriceInCeloGold()
    }
    throw new Error(
      `celo-private-keys-subprovider@getGasPrice: gas price for ` +
        `currency ${feeCurrency} cannot be computed in the CeloPrivateKeysWalletProvider, ` +
        ' pass it explicitly'
    )
  }

  private async getGasPriceInCeloGold(): Promise<string> {
    // Reference: https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gasprice
    const result = await this.rpc.call('eth_gasPrice', [])
    const gasPriceInHex = result.result.toString()
    return gasPriceInHex
  }

  private isEmpty(value: string | undefined) {
    return (
      value === undefined ||
      value === null ||
      value === '0' ||
      value.toLowerCase() === '0x' ||
      value.toLowerCase() === '0x0'
    )
  }
}
