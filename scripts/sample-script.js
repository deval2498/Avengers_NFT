// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { getDefaultProvider } = require("@ethersproject/providers");
const { ethers, getChainId } = require("hardhat");
const hre = require("hardhat");
let {networkConfig} = require('../helper-hardhat-config.js')

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const chainId  = await getChainId();
  console.log(chainId);
  const vrfCoor = networkConfig[chainId]['vrfCoordinator']
  const linkAddr = networkConfig[chainId]['linkToken']
  const keyhash = networkConfig[chainId]['keyHash']
  const fee = networkConfig[chainId]['fee']

  if(chainId == 4){
  const Ipfsnft = await ethers.getContractFactory("avengers");
  const ipfsnft = await Ipfsnft.deploy(vrfCoor,linkAddr,keyhash,fee);

  await ipfsnft.deployed();

  console.log("Strongest Avenger NFT deployed to:", ipfsnft.address);

  const account = await ethers.getSigner();
  const signer = account;
  

  const linktoken = await ethers.getContractFactory("LinkToken")
  const link = new ethers.Contract(linkAddr,linktoken.interface,signer)
  await link.transfer(ipfsnft.address,ethers.utils.parseEther('0.1'));
  const nft = new ethers.Contract(ipfsnft.address,Ipfsnft.interface,signer);
  const tx = await nft.create({gasLimit: 3000000});
  const receipt = await tx.wait(1);
  const tokenId = await nft.tokenId()
  await new Promise(r => setTimeout(r, 180000))
  const mint = await nft.finishMint(tokenId,{gasLimit:3000000})
  console.log("Verify here:\n npx hardhat verify --network",networkConfig[chainId]['name'],ipfsnft.address,networkConfig[chainId]['vrfCoordinator'],networkConfig[chainId]['linkToken'],networkConfig[chainId]['keyHash'],networkConfig[chainId]['fee'])
  }

  else {
    const LinkToken = await ethers.getContractFactory("LinkToken")
    const linktoken = await LinkToken.deploy();
  
    
    await linktoken.deployed();
    console.log("Link Token deployed tp:",linktoken.address)
    const VRFCoordinatorMock = await ethers.getContractFactory("VRFCoordinatorMock");
    const vrfcoordinatormock = await VRFCoordinatorMock.deploy(linktoken.address);
    await vrfcoordinatormock.deployed();

    console.log("Vrf mock deployed to:",vrfcoordinatormock.address)

    const Ipfsnft = await ethers.getContractFactory("avengers");
    const ipfsnft = await Ipfsnft.deploy(vrfcoordinatormock.address,linktoken.address,keyhash,fee);
    await ipfsnft.deployed();
  
    console.log("Strongest Avenger NFT deployed to:", ipfsnft.address);
  
    const account = await ethers.getSigner();
    const signer = account;
    
  
    const linktransfer = await linktoken.transfer(ipfsnft.address,fee);
    console.log(await linktoken.balanceOf(ipfsnft.address))
    const tx = await ipfsnft.create({gasLimit: 3000000});
    const receipt = await tx.wait(1);
    console.log("Your token id is:",await ipfsnft.tokenId())
    const tokenId = await ipfsnft.tokenId()
    const mint = await ipfsnft.finishMint(tokenId)
    console.log("random:",await ipfsnft.getRandom(tokenId))
    console.log("Verify here:\n npx hardhat verify --network",networkConfig[chainId]['name'],ipfsnft.address,networkConfig[chainId]['vrfCoordinator'],networkConfig[chainId]['linkToken'],networkConfig[chainId]['keyHash'],networkConfig[chainId]['fee'])
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
