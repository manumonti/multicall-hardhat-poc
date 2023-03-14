const { ethers } = require("hardhat");

async function main() {
  const [owner, acc1, acc2] = await ethers.getSigners();

  const Token = await ethers.getContractFactory("ERC20");
  const token = await Token.deploy();
  await token.mint(ethers.utils.parseUnits("100", 18));
  await token.transfer(acc1.address, ethers.utils.parseUnits("100", 18));
  await token
    .connect(acc1)
    .approve(acc2.address, ethers.utils.parseUnits("50", 18));

  const Multicall = await ethers.getContractFactory("Multicall3");
  const multicall = await Multicall.deploy();

  // Check how a simple call works
  const blockNumber = await multicall.getBlockNumber();
  console.log("Block number:", blockNumber);

  // Check how to use aggregate3
  const callData = Token.interface.encodeFunctionData("balanceOf", [
    acc1.address,
  ]);
  const calls = [
    { target: token.address, allowFailure: true, callData: callData },
  ];
  const returnData = await multicall.aggregate3(calls);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
