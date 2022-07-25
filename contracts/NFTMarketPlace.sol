// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <8.0.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketPlace {
    using Counters for Counters.Counter;
    Counters.Counter private _itemsId;
    address private __owner; // To Get Owner Contract
    address private __contractAddress = address(this); // To Get Address Contract
    
    // This Function Returned Owner Adresss
    function getAddressOwner() external view returns( address ) {
        return __owner;
    }

    // This Function Returned Contract Adresss
    function getContractAddress() external view returns( address ) {
        return __contractAddress;
    }

    // This Function Returned Balance Contract Adresss
    function getContractBalance() external view returns( uint256 ) {
        return address(this).balance;
    }

    // This Function to the owner can withdraw Balance in Contract 
    function getContractWithdraw() external payable {
        require(msg.sender == __owner ,"you are not Owner");
        payable(msg.sender).transfer(address(this).balance);
    }


    // Get All Index Counter
     function getAllCounter() external view returns(uint256) {
        return _itemsId.current();
    }

    constructor() {
        __owner = msg.sender;
    }


    struct _UploadNftStruct_ {
        uint256 id;
        string name;
        string content;
        string image;
        uint256 price;
        address owner;
        address buyer;
        bool locked;
    }


    event _UploadNftEvent_ (
        uint256 id,
        string name,
        string content,
        string image,
        uint256 price,
        address owner,
        address buyer,
        bool locked
    );

    mapping( uint256 => _UploadNftStruct_ ) private _mapUploading; // This Exist to Uploading and Get Data
    mapping( string => bool ) private _mapCheckImage; // This to check your Image is Exist or no 
    mapping( address => uint256 [] ) private _mapCountUsers; // This Exist to Know how many you products Have
    mapping( address => uint256 [] ) private _mapSold; // This Exist to Know how many product sold
    mapping( uint256 => uint256 [] ) private _mapCountSoldProduct; // to Know how many sold it 


    // Function Uploading Data
    function setUploadItemsNft(
        string memory name_ , string memory content_ ,
        uint256 price_ ,string memory image_ , bool locked_
        ) external {
        address __sender = msg.sender;
        
        require( __sender != address(0) , "check your Address" );
        require( !_mapCheckImage[image_] , "This Image Already Exists" );
        require( price_ > 1000 , "No Money" );


        _itemsId.increment();
        uint256 __id = _itemsId.current();


         _mapUploading[__id] =
         _UploadNftStruct_( __id , name_ , content_ , image_ , price_ , __sender, __sender ,locked_);
         _mapCountUsers[msg.sender].push(__id);
         _mapCheckImage[image_] = true;

         emit _UploadNftEvent_( __id , name_ , content_ , image_ , price_ , __sender , __sender,locked_) ;
    }


    // Function Purchesed Product
    function setPurchesedItem( uint256 id_ ) external payable {
        _UploadNftStruct_ storage __data = _mapUploading[id_];
        address __sender = msg.sender;

        require( __sender != address(0) , "NoAddress" );
        require( __sender != __data.owner , "You are Owner" );
        require(id_ <= _itemsId.current() && id_ >= 0, "check your Current Item" );
        require( msg.value == __data.price , "Your Value is not Equal Price" );
        require(__data.locked == true, "You Can't buy this Product");

        // To Get your Fees
        uint256 __value = msg.value * 95/100;
        payable(__data.owner).transfer(__value);

        _mapCountSoldProduct[__data.id].push(__data.id);
        __data.buyer = __sender;
        __data.locked = false;

        _mapCountUsers[__sender].push(__data.id);
        _mapCountUsers[__data.owner].pop();
        _mapSold[__data.owner].push(__data.id);
    }



    // Function to get Length Products you have
    function getLengthOwnerData() external view returns( uint256 ) {
        return _mapCountUsers[msg.sender].length;
    }


    // Function to get Length Products you sold
    function getLengthSoldData() external view returns(uint256) {
        return _mapSold[msg.sender].length;
    }

    // Function to get Length Products you sold
    function getLengthSold(uint256 id_) external view returns(uint256) {
        return _mapCountSoldProduct[id_].length;
    }


    // to Show Data in Home
    function setLockedTrue( uint256 id_ ) external {
        require( _mapUploading[id_].buyer == msg.sender,"You are not Owner");
        require(_mapUploading[id_].locked != true,"Your Value is True");

        _mapUploading[id_].locked = true;

    }


    // to Hide Data in Home
    function setLockedFalse( uint256 id_ ) external {
        require( _mapUploading[id_].buyer == msg.sender , "You are not Owner" );
        require( _mapUploading[id_].locked == true , "Your Value is False" );

        _mapUploading[id_].locked = false;

    }


    // Function Get all Products By Index
    function getAllItemByIndex(uint256 index_) external view returns(_UploadNftStruct_ memory) {
        require(index_ <= _itemsId.current()&& index_ >= 0,"check your Current Item");
        return _mapUploading[index_];
    }


    // Function to get All Products 
    function getAllItems() external view returns(_UploadNftStruct_ [] memory) {
        uint256 _totalItemCount = _itemsId.current();
        uint256 _myCurrentIndex = 0;

        _UploadNftStruct_[] memory _nftItems = new _UploadNftStruct_[](_mapCountUsers[msg.sender].length);

                for(uint256 i = 0; i < _totalItemCount; i++) {
                    if( _mapUploading[i+1].locked == true ) {
                        _UploadNftStruct_ storage _currentItem = _mapUploading[i+1];
                        _nftItems[_myCurrentIndex] = _currentItem;
                        _myCurrentIndex += 1;
                    }
                }
        return _nftItems;
    }
    

    // Function to get All your Products Onley
    function getAllYourItems() external view returns(_UploadNftStruct_ [] memory) {
        uint256 _totalItemCount = _itemsId.current();
        uint256 _myCurrentIndex = 0;

        _UploadNftStruct_[] memory _nftItems = new _UploadNftStruct_[](_mapCountUsers[msg.sender].length);

                for(uint256 i = 0; i < _totalItemCount; i++) {
                    if( _mapUploading[i+1].buyer == msg.sender ) {
                        _UploadNftStruct_ storage _currentItem = _mapUploading[i+1];
                        _nftItems[_myCurrentIndex] = _currentItem;
                        _myCurrentIndex += 1;
                    }
                }
        return _nftItems;
    }
    
}