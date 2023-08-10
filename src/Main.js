import React,{useState} from 'react';
import { ethers } from 'ethers';
import { Web3Storage } from 'web3.storage';
import "./styles.css";
import CarService_abi from "./truffle/build/contracts/CarServiceContract.json";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import SearchTable from './Components/SearchTable';
import UserInput from './Components/UserInput';
import NavBar from './Components/NavBar';

const Main = () => {
    
    const contractAddress = "0x2212c779A7d03B46ae697F2851aA9aB1bA54Aae3";
    const abi = CarService_abi.abi;
    //web3.storage api token
    const web3StorageApi = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUxZDIxNmY4YWE0RmNGMDFCODE4RkMyQTgyMDAyQjhBQ0ExMjMxQjciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTE1Njk1Njc1NjAsIm5hbWUiOiJDYXJTZXJ2aWNlIn0.0ynNnu9b1__XYH_CYB9AeymkOD67gIIDGrGKQsqQBGw";
    const storage = new Web3Storage({token : web3StorageApi});
    // state vairbles
    const [btnTxt, setBtnTxt] = useState("Not Connected");
    const [outData, setOutData] = useState([]);
    const [defaultAccount, setDefaultAccount] = useState("Account not Connected");
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
        setUploadData({
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
        setErrorMessage("Connected")
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
        try{
            tempContract.addService(uploadData.vin, tempCid);
            setErrorMessage("complete");
        }
        catch (e){
            setErrorMessage("Error Occured while adding the service");
            console.log(e);
        }
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
        try{
            setErrorMessage("Getting data from blockchain!!");
            const cids = await tempContract.getServices(_vin);
            setErrorMessage("Done");
            //download all files and storing it in a array
            setErrorMessage("Grabbing files this might take longer please wait");
            let result = []
            for (let i = 0; i < cids.length; i++){
                let temp = await retriveFiles(cids[i]);
                console.log("temp",temp);
                result.push(temp);
            }

            setOutData(result);
            setErrorMessage("Finished");
        }
        catch(e){
            setErrorMessage("Error occured");
            console.log(e);
        }
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
            <NavBar address={defaultAccount} btnText={btnTxt} handleConnectButton={handleConnectButton} />

            <div class="container">
                <Tabs className="center-aligned-tabs">
                    <TabList className="tab-buttons">
                        <Tab class="test">Add New Service Data</Tab>
                        <Tab class="test">Search With VIN Number</Tab>
                    </TabList>

                    <TabPanel className="add-panel">
                        <div class="main-div">
                            <UserInput uploadData={uploadData} 
                                handleSubmit={handleSubmit}
                                handleChange={handleChange}
                                errorMessages={errorMesage}/>
                        </div>
                    </TabPanel>
                    
                    <TabPanel className="search-panel">
                        <div class="main-div">
                            <form onSubmit={getFiles}>
                                <input type="text" 
                                    name="searchVIN" 
                                    value={searchVIN} 
                                    onChange={handleSearchChange}
                                    placeholder='Enter the VIN to Search'
                                    class="searchVin"/>
                                <button type='submit' class="searchBtn">Search</button>
                            </form>

                            <div class="scrollable">
                                {outData.map((s,index) => (
                                <SearchTable obj={s}/> ))}
                            </div> 
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    )
}

export default Main;