import {useState , useEffect} from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import ContractCommerce from "../public/abi/NFTMarketPlace.json";
import Web3 from "web3";


export default function Home() {
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
    index: 0
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
        const _lengthCounterData = await _deployedContract.methods.getAllCounter().call();       

        //const test = await _deployedContract.methods.addressOwner().call();
        //const test = await _deployedContract.methods.setUploadItemsNft("Ali","Ali2",10000000000,"Ali3",true).send({from:web3.account});

        // const _idCount = await _deployedContract.methods.setUploadItemsNft().call();

        // console.log(test);

       // const _ownerContract = await _deployedContract.methods.getContractAddress().call();
       

        setShopContract({
         // count:_idCount , 
         // userBalance: _balanceFromWei , 
          contract: _deployedContract, 
          index: _lengthCounterData
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



 const [loadData,setLoadData] = useState(false);
 const [fetchContract,setFetchContract] = useState([]);
 useEffect(()=>{
   const _fetchContract = async () => {
     for(let i = 0 ; i < shopContract.index ; i++) {
       const _fetchUploadData = await shopContract.contract.methods.getAllItemByIndex(i+1).call();
       setFetchContract(_upload => [..._upload,_fetchUploadData]);
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


// To check blockWallet
const _reqAccoubtsFunc = async () => {
    return await web3.web3.eth.requestAccounts();
}
/// To check blockWallet


  return (
    <div className="items-center">

        <div className="flex justify-center">
            <p className="text-3xl"><b> Home </b></p>
        </div>

        {
        !loadData ? <div>Loading...</div> : fetchContract.map((key,value) => {
          const _data = `https://ipfs.infura.io/ipfs/${key.image}`;
          
          return(
            
             key.buyer === web3.account || key.locked === false ? <></> 
            : <div key={key} className="mb-6">
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
            
    </div>
  )
}
// Web3.utils.fromWei(key.price,"ether")
/*
 {
        !loadData ? <div>Loading...</div> : fetchContract.map((key,value)=>{
          const _data = `https://ipfs.infura.io/ipfs/${key.image}`;
          return(
            <div key={key} className="mb-6">
            <div class="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 ">
            <a href="#">
                <img class="rounded-t-lg" src={_data} alt=""/>
            </a>
            <div class="p-5">
                <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{key.name}</h5>
                </a>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{key.content}.</p>
                
                
                <div className="flex items-center justify-between">
                    <p className="text-white">{Web3.utils.fromWei(key.price,"ether")} Ether </p>

                    <a href="#" class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Buy
                    </a>
                </div>
            </div>
        </div>
        </div>
          );
        })
      }
*/