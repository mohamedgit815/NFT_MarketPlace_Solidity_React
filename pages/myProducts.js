import {useState , useEffect} from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import ContractCommerce from "../public/abi/NFTMarketPlace.json";
import Web3 from "web3";


export default function MyProducts() {
    // To Refresh Data Wallet
   const _providerChange = (provider)=>{
    provider.on("accountsChanged",()=>{window.location.reload()});
    provider.on("chainChanged",()=>{window.location.reload()});
}
// To Refresh Data Wallet


// Ready Web3
const [ web3 , setWeb3 ] = useState({
    web3: null , 
    account: null , 
    provider: null ,
    networkId: null
  });
  useEffect(() => {
    const _loadContract = async ()=>{
      const _provider = await detectEthereumProvider();

      if(_provider) {
        _providerChange(_provider);

        const _web3 = await new Web3(_provider);
        const _account = await _web3.eth.getAccounts();
        const _netWorkId = await _web3.eth.net.getId();     

          setWeb3({
            web3: _web3 ,
            account: _account[0] ,
            provider: _provider , 
            networkId: _netWorkId
          });

      } 
    }
      _loadContract();
  },[]);
/// Ready Web3


  // To Get BlockChain Contract Data 
  const [network,setNetwork] = useState(false);
  const [shopContract,setShopContract] = useState({
   // count: 0 ,
    //userBalance: 0 ,
    contract: undefined ,
    index: 0 ,
    product: undefined ,
    indexSold: 0
  //  owner: undefined 
  });
  useEffect(() => {
    const _getContracts = async () => {
      const _contractObject = await ContractCommerce.networks[web3.networkId];

      if( _contractObject ) {

        const _contractAddress = await ContractCommerce.networks[web3.networkId].address;
        
        const _deployedContract = await new web3.web3.eth.Contract(
          ContractCommerce.abi , _contractObject && _contractAddress );

        const _balance = await web3.web3.eth.getBalance(web3.account);
        const _balanceFromWei = await web3.web3.utils.fromWei(_balance,"ether");
        const _lengthCounterData = await _deployedContract.methods.getLengthOwnerData().call({from:web3.account});
        const _sold = await _deployedContract.methods.getLengthSoldData().call({from:web3.account});
        const _getTestAllYourItem = await _deployedContract.methods.getAllYourItems().call({from:web3.account});
       // const _getFalse = await _deployedContract.methods.setLockedTrue(1).send({from:web3.account});
        //const _getTrue = await _deployedContract.methods.getAllYourItems(2).call({from:web3.account}); 
        //console.log(_getFalse);
       

        setShopContract({
         // count:_idCount , 
         // userBalance: _balanceFromWei , 
          contract: _deployedContract, 
          index: _lengthCounterData , 
          product: _getTestAllYourItem ,
          indexSold: _sold
         // owner: _ownerContract
        })

      } else {
        setNetwork(true);
        _providerChange(web3.provider);
        window.alert("Switch to Ropsten Chain");
      }
    }

    web3.account && _getContracts();

  },[web3.account])
 /// To Get BlockChain Contract Data 



 const [loadData , setLoadData] = useState(false);
 const [fetchContract , setFetchContract] = useState([]);
 useEffect( () => {
   const _fetchContract = async () => {
     for(let i = 0 ; i < shopContract.index ; i++) {
       //const _fetchUploadData = await shopContract.contract.methods.getAllYourItems().call({from:web3.account});
       const _getUploadData = shopContract.product[i];

       setFetchContract(_upload => [..._upload,_getUploadData]);
       setLoadData(true);
      }
   }
   shopContract && _fetchContract();
 },[shopContract]);



// To Purchesed Data to BlockChain
const _purchesedData = async (_id,_address,_price) => {
    if(network) {
       return window.alert("Switch to Ropsten Chain");
    }

   // const _toWei = await web3.web3.utils.toWei(`${price}`,"ether");

    await shopContract.contract.methods.setPurchesedItem(_id).send({from:web3.account , to: _address , value: _price});

    window.location.reload();
}
/// To Purchesed Data to BlockChain

// Hide Data in Home
 const _setFasle = async (_id) => {
  if(network) {
    return window.alert("Switch to Ropsten Chain");
 }
  await shopContract.contract.methods.setLockedFalse(_id)
  .send({from:web3.account});

  window.location.reload();
 }
/// Hide Data in Home


// Show Data in Home
const _setTrue = async (_id) => {
  await shopContract.contract.methods.setLockedTrue(_id)
  .send({from:web3.account});

  window.location.reload();
 }
 /// Show Data in Home



// To check blockWallet
const _reqAccoubtsFunc = async () => {
    return await web3.web3.eth.requestAccounts();
}
/// To check blockWallet

  return (
    <div >
      <div className="flex justify-center">
         <p className="text-3xl"><b> My Products </b></p>
      </div>

      <div className="flex justify-around">
         <p className="text-2xl"><b>Your Products: {shopContract.index}</b></p>
         <p className="text-2xl"><b>The Products Sold: {shopContract.indexSold}</b></p>
      </div>


      <div className="justify-center">
            {
               shopContract.index == 0 ? "You Dont have any Products" : !loadData ? <div>Loading...</div> 
                  : 
              fetchContract.map((key,value) => {
                const _data = `https://ipfs.infura.io/ipfs/${key.image}`; 
                return(
                    <div key={key.id} className="mb-6">
                  <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 ">
                  <a href="#">
                      <img className="rounded-t-lg" src={_data} alt=""/>
                  </a>
                  <div className="p-5">
                      <a href="#">
                          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{key.name}</h5>
                      </a>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{key.content}.</p>
                      
                      
                       <div className="flex items-center justify-between">
                          <p className="text-gray-900 dark:text-white">{Web3.utils.fromWei(key.price,"ether")} Ether </p>


                          <button onClick={()=>{!web3.account?_reqAccoubtsFunc() : !key.locked ? _setTrue(key.id) : _setFasle(key.id)}} className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                              {key.locked == false ? "Show" : "Hide"}
                          </button>
                          
                      </div>
                  </div>
                </div>
              </div>
                );
              })
            }
      </div>

     </div>
  )
  }

  /*
  
    {
        !loadData ? <div>Loading...</div> : fetchContract.map((key,value) => {
          const _data = `https://ipfs.infura.io/ipfs/${key.image}`;
          console.log(key);
          
          return(
              <div key={key.id} className="mb-6">
            <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 ">
            <a href="#">
                <img className="rounded-t-lg" src={_data} alt=""/>
            </a>
            <div className="p-5">
                <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{key.name}</h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{key.content}.</p>
                
                
                <div className="flex items-center justify-between">
                    <p className="text-white">{key.price} Ether </p>


                    <button onClick={()=>{!web3.account? _reqAccoubtsFunc():_purchesedData(key.id,key.buyer,key.price)}} className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                         Buy
                    </button>
                    
                </div>
            </div>
        </div>
        </div>
          );
        })
      }
  
  */
  