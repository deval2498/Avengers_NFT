//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBase.sol';
import "hardhat/console.sol";

contract avengers is ERC721URIStorage,VRFConsumerBase{

    uint256 public tokenId;
    uint256 public totalSupply = 10;
    uint256 public qty;
    uint256 public fee;
    bytes32 public keyHash;

    mapping(uint256 => address) tokenIdToSender;
    mapping(uint256 => uint256) tokenIdToRandomNumber;
    mapping(bytes32 => uint256) requestIdToTokenId;
    mapping(bytes32 => address) requestIdToSender;

    event tokenIdGenerated(address indexed _sender, uint256 indexed _tokenId);



    constructor(address _VRFCoordinator, address _LinkToken,bytes32 keyhash,uint256 _fee) ERC721("Strongest Avenger","SAVG") VRFConsumerBase(_VRFCoordinator,_LinkToken){
        fee = _fee;
        keyHash = keyhash;
        tokenId = 0;
    }

    function create() public {
        require(tokenId < 10,'All NFTs are already minted!');
        tokenIdToSender[tokenId] = msg.sender;
        bytes32 requestId = getRandomNumber();
        requestIdToSender[requestId] = msg.sender;
        emit tokenIdGenerated(msg.sender,tokenId);
        
    }

    function getRandom(uint256 _tokenId) public view returns(uint256 random) {
        return tokenIdToRandomNumber[_tokenId];
    }

    function finishMint(uint256 _tokenId) public {
        require(tokenIdToSender[_tokenId] == msg.sender,'You are not the owner of this tokenid!');
        uint256 randomNumber = tokenIdToRandomNumber[_tokenId];
        uint256 counter;
        counter = (randomNumber % 10)+1;
        randomNumber = randomNumber/10;
        _safeMint(msg.sender, _tokenId);
        string memory tokenURI = generateTokenURI(counter);
        _setTokenURI(_tokenId, tokenURI);
        tokenId+=1;
    }

    function getRandomNumber() public returns(bytes32 requestId) {
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId,uint256 randomness) internal override {
        uint256 tokenCounter;
        tokenCounter = requestIdToTokenId[requestId];
        tokenIdToRandomNumber[tokenCounter] = randomness;
    }

    

    function generateTokenURI(uint256 counter) pure internal returns(string memory _tokenURI) {
        _tokenURI = string(abi.encodePacked("https://gateway.pinata.cloud/ipfs/QmWGLJ5E1B78jpo75Ky52wVUbgU4DBppzkcavWbu8j4a9p/",uint2str(counter),".json"));
    }


    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

}