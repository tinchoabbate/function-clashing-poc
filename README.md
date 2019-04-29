# Function clashing PoC

Simple proof-of-concept on how a malicious proxy contract can take advantage of function clashing.

In this case, the proxy implements a malicious function `collate_propagate_storage(bytes16)` that share the same 4-bytes identifier with `burn(uint256)` (see [https://www.4byte.directory/signatures/?bytes4_signature=0x42966c68](https://www.4byte.directory/signatures/?bytes4_signature=0x42966c68)). That means that everytime a user attempts to call the [`burn(uint256)` function of `ERC20Burnable`](https://github.com/OpenZeppelin/openzeppelin-eth/blob/v2.1.3/contracts/token/ERC20/ERC20Burnable.sol#L15), it will instead call `collate_propagate_storage(bytes16)`, having all of their tokens stolen by the proxy's owner.

To read about function clashing in proxies, you can check:
- [Malicious backdoors in Ethereum proxies](https://medium.com/nomic-labs-blog/malicious-backdoors-in-ethereum-proxies-62629adf3357)
- [Transparent proxies and function clashes](https://github.com/zeppelinos/zos/blob/master/packages/docs/docs/docs/pattern.md#transparent-proxies-and-function-clashes)

## Instructions

1. Install dependencies with `npm install`
2. Run exploit with `npm test`
