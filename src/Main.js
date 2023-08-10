import React,{useState} from 'react';
import { ethers } from 'ethers';
import { Web3Storage } from 'web3.storage';
import "./styles.css";
import CarService_abi from "./truffle/build/contracts/CarServiceContract.json";

import SearchTable from './Components/SearchTable';
import UserInput from './Components/UserInput';
import NavBar from './Components/NavBar';

const Main = () => {
    
    const contractAddress = "0x39FAe01424Ed9720B084D29f265332389423C10D";
    const abi = CarService_abi.abi;
    //web3.storage api token
    const web3StorageApi = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUxZDIxNmY4YWE0RmNGMDFCODE4RkMyQTgyMDAyQjhBQ0ExMjMxQjciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTE1Njk1Njc1NjAsIm5hbWUiOiJDYXJTZXJ2aWNlIn0.0ynNnu9b1__XYH_CYB9AeymkOD67gIIDGrGKQsqQBGw";
    const storage = new Web3Storage({token : web3StorageApi});
    // state vairbles
    const [btnTxt, setBtnTxt] = useState("Not Connected");
    const [outData, setOutData] = useState([]);
    const [defaultAccount, setDefaultAccount] = useState("Not Connected");
    const [errorMesage, setErrorMessage] = useState("")
    const [cid, setCid] = useState("");
    const [searchVIN, setSearchVIN] = useState("");
    
    const [uploadData, setUploadData] = useState({
        vin : "",
        model_type : "",
        version : "",
        color : "",
        country : "",
        dealer_code : "",
        dealer : "",
        ro : "",
        odometer : 0,
        part_number : "",
        part_name : "",
        technician_description : "",
    })

    const handleChange = (event) => {
        const {name, value} = event.target;
        setUploadData({
            ...uploadData,
            [name] : value
        });
    }

    const handleSearchChange = (event) =>{
        setSearchVIN(event.target.value);   
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(uploadData);
        uploadFiles();
    }

    const handleConnectButton = () => {
        if (window.ethereum) {
            window.ethereum.request({method : "eth_requestAccounts"})
            .then((request) => handAccountChange(request[0]))
            .catch((e) => setErrorMessage(e))
        }
        else{
            setErrorMessage("Please install metamask");
            console.log("Metamask is not found");
        }
    }

    const handAccountChange =  (request) => {
        setDefaultAccount(request);
        setBtnTxt("Connected");
    }

    const uploadFiles = async () => {
        
        // converting the js object to json
        const jsonData = JSON.stringify(uploadData, null, 2);

        // representing as file
        const file = new File([new Blob([jsonData], { type: 'text/plain' })], 'data.json', {
            type: 'text/json'
          });
        
        //uploading the file
        setErrorMessage("Pending")
        const tempCid = await storage.put([file]);
        setCid(tempCid);
        console.log(`File uploaded with CID: ${tempCid}`);
        
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        let tempSigner = tempProvider.getSigner();
        let tempContract = new ethers.Contract(contractAddress, abi, tempSigner);
        // uploading cid and vin to blockchain
        tempContract.addService(uploadData.vin, tempCid);
        setErrorMessage("complete");
    }


    const getFiles = async (e) =>{
        e.preventDefault();
        // Getting cids from block chain
        setErrorMessage("Please be patinent")
        let _vin = searchVIN;
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        let tempSigner = tempProvider.getSigner();
        let tempContract = new ethers.Contract(contractAddress, abi, tempSigner);
        
        //getting all cids
        const cids = await tempContract.getServices(_vin);
        console.log("cids ",cids);
        console.log("leng of cids", cids.length);

        //download all files and storing it in a array
        let result = []
        for (let i = 0; i < cids.length; i++){
            let temp = await retriveFiles(cids[i]);
            console.log("temp",temp);
            result.push(temp);
        }

        console.log("results : ", result[0].vin);
        console.log(typeof(result));
        setOutData(result);
        setErrorMessage("Done");
        console.log("outdata", outData);
    }

    const retriveFiles = async (_cid) => {
        try {
            //using the url and fetch method to download the data
            const url = `https://${_cid}.ipfs.dweb.link/data.json`;
            const response = await fetch(url);
        
            if (response.ok) {
              return await response.json();
            } else {
              setErrorMessage('Error retrieving file:', response.statusText);
              return null;
            }
          } catch (error) {
            setErrorMessage('An error occurred:', error);
            return null;
          }
    }

    return (
        <div class="parent">
            <NavBar address={defaultAccount} btnText={btnTxt} />
            <div class="connectContainer">
                <p>Address : {defaultAccount}</p>
                <button onClick={handleConnectButton}>{btnTxt}</button>
            </div>

            <div class="interactionContainer">
                <div class="left">
                    <UserInput uploadData={uploadData} handleSubmit={handleSubmit} handleChange={handleChange}/>
                </div>

                <div class="right">
                    <form onSubmit={getFiles}>
                        <label>Enter the VIN number</label>
                        <input type="text" name="searchVIN" value={searchVIN} onChange={handleSearchChange}/>
                        <button type='submit'>Search</button>
                    </form>

                    <div class="scrollable">
                        {outData.map((s,index) => (
                        <SearchTable obj={s}/> ))}
                    </div> 
                </div>
            </div>

            <div>
                <p class="connectContainer">{errorMesage}</p>
            </div>
        </div>
    )
}

export default Main;