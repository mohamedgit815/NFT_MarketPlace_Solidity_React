import {useState , useEffect} from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import {create} from 'ipfs-http-client';
import ContractCommerce from "../public/abi/NFTMarketPlace.json";
import Web3 from "web3";

const _clinet = create("https://ipfs.infura.io:5001/api/v0");

export default function CreateNFT() {

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
      const [shopContract , setShopContract] = useState({
       // count: 0 ,
        //userBalance: 0 ,
        contract: undefined ,
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
            //const test = await _deployedContract.methods.setUploadItemsNft("Ali","Ali2",10000000000,"Ali3",true).send({from:web3.account});

             //const _idCount = await _deployedContract.methods.setUploadItemsNft().call();
    
            setShopContract({
             // count:_idCount , 
             // userBalance: _balanceFromWei , 
              contract: _deployedContract
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


    // to Get Url Image
    const [imageUrl,setImageUrl] = useState();
    const _uploadImage = async (e) => {

    const _file = e.target.files[0];
    //const _url = `https://ipfs.infura.io/ipfs/${pathImage}`;
    try{
      const _addFile = await _clinet.add(_file);
      setImageUrl(_addFile.path);
    }catch(e) {
      console.log(`Error in OnChange${e}`)
    }
    }
    /// to Get Url Image


    // To Get All Inputs
    const [allInputs,setAllInputs] = useState({
        name:"" , content:"" , price: 0 , locked: false
    });
    /// To Get All Inputs


    // to Upload Data to BlockChain
    const _uploadData = async () => {

        if(network) {
        return window.alert("Switch to Ropsten Chain");
        }
        
        if(allInputs.name === "" || allInputs.content === "" || allInputs.price === 0 || imageUrl === undefined || !web3.account ) {
            return window.alert("Full all Inputs");  } 

        const _toWei = await web3.web3.utils.toWei(allInputs.price,"ether");

        await shopContract.contract.methods.setUploadItemsNft(
           allInputs.name , allInputs.content
          , _toWei , `${imageUrl}` , allInputs.locked
          ).send({from:web3.account});

        window.location.reload();
    }
    /// to Upload Data to BlockChain


    // To check blockWallet
    const _reqAccoubtsFunc = async () => {
        return await web3.web3.eth.requestAccounts();
    }
    /// To check blockWallet

    return (
      <div >
            <div className="mb-6">
                <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Name</label>
                <input type="text" id="base-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name" onChange={e=>setAllInputs({...allInputs,name:e.target.value})}/>
            </div>


            <div className="mb-6">
             <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Descriptions</label>
            <input type="text" placeholder="Descriptions" id="large-input" className="block p-4 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e=>setAllInputs({...allInputs,content:e.target.value})} />
            </div>


            <div className="mb-6">
                <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Ethers</label>
                <input type="number" min={0} placeholder="Ethers" id="small-input" className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e=>setAllInputs({...allInputs,price:e.target.value})} />
            </div>


            <div className="mb-6">
                 <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="user_avatar" onChange={_uploadImage}>Upload Image</label>
                 <input className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" onChange={_uploadImage}/>
                 <div className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="user_avatar_help">A profile picture is useful to confirm your are logged into your account</div>
            </div>


            <div className="htmlForm-group htmlForm-check text-center mb-6">
           <input type="checkbox"
             className="htmlForm-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain mr-2 cursor-pointer"
              id="exampleCheck25" onChange={e=>setAllInputs({...allInputs,locked:e.target.checked})}/>
             <label className="htmlForm-check-label inline-block text-gray-800" htmlFor="exampleCheck25" >Do you want to Show this Product</label>
            </div>


            <div className="text-center mb-6">
              {
              !web3.provider ? <a className="text-green-700" href="https://metamask.io/download/" target="_blank">Install Wallet</a> 
                    : 
              <button onClick={!web3.account ? _reqAccoubtsFunc : _uploadData } 
              className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                      Upload 
                </button> 
              }
                
            </div>

      </div>
    )
  }
  