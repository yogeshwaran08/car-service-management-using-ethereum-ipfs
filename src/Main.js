import React,{useState} from 'react';
import { ethers } from 'ethers';
import { Web3Storage } from 'web3.storage';
import "./styles.css";
import CarService_abi from "./truffle/build/contracts/CarServiceContract.json";

const Main = () => {
    
    const contractAddress = "0x17DB399f5595266FbF66De03A9837Aa771E30E79";
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
        <div class="basic">
            <div class="connectContainer">
                <p>Address : {defaultAccount}</p>
                <button onClick={handleConnectButton}>{btnTxt}</button>
            </div>
            <div class="parent">
            <div class="left">
            <form onSubmit={handleSubmit}>
                <table>
                    <tbody>                    
                    <tr>
                        <td><label>VIN</label></td>
                        <td><input type='text' name="vin" value={uploadData.vin} onChange={handleChange}></input></td>
                    </tr>
                    
                    <tr>
                        <td><label>Model Type</label></td>
                        <td><input type='text' name="model_type" value={uploadData.model_type} onChange={handleChange}></input></td>
                    </tr>

                    <tr>   
                        <td><label>Version</label></td>
                        <td><input type='text' name="version" value={uploadData.version} onChange={handleChange}></input></td>
                    </tr>

                    <tr>    
                        <td><label>Color</label></td>
                        <td><input type='text' name="color" value={uploadData.color} onChange={handleChange}></input></td>
                    </tr>

                    <tr>
                        <td><label>Country</label></td>
                        <td><input type='text' name='country' value={uploadData.country} onChange={handleChange}></input></td>
                    </tr>

                    <tr>
                        <td><label>Dealer Code</label></td>
                        <td><input type='text' value={uploadData.dealer_code} name="dealer_code" onChange={handleChange}></input></td>
                    </tr>

                    <tr>
                        <td><label>Dealer</label></td>
                        <td><input type='text' value={uploadData.dealer} name="dealer" onChange={handleChange}></input></td>
                    </tr>

                    <tr>
                        <td><label>RO</label></td>
                        <td><input type='text' value={uploadData.ro} name="ro" onChange={handleChange}></input></td>
                    </tr>
                    
                    <tr>
                        <td><label>Odometer</label></td>
                        <td><input type='number' value={uploadData.odometer} name="odometer" onChange={handleChange}></input></td>
                    </tr>

                    <tr>
                        <td><label>Part Number</label></td>
                        <td><input type='text' value={uploadData.part_number} name='part_number' onChange={handleChange}></input></td>
                    </tr>

                    <tr>
                        <td><label>Part Name</label></td>
                        <td><input type='text' value={uploadData.part_name} name="part_name" onChange={handleChange}></input></td>
                    </tr>

                    <tr>
                        <td><label>Technician Description</label></td>
                        <td><input type='text' value={uploadData.technician_description} name="technician_description" onChange={handleChange}></input></td>
                    </tr>
                    </tbody>
                </table>
                <button type='submit'>Add Service</button>
            </form>
            </div>

            <div class="right">

                <form onSubmit={getFiles}>
                    <label>Enter the VIN number</label>
                    <input type="text" name="searchVIN" value={searchVIN} onChange={handleSearchChange}/>
                    <button type='submit'>Search</button>
                </form>
                    <div class="scrollable">
                        {outData.map((s,index) => (
                            <div style={{border : "1px solid black"}}>
                                <table class="searchElement">
                                    <tbody>
                                    <tr>
                                        <td>VIN</td>
                                        <td>{s.vin}</td>
                                    </tr>
                                    <tr>
                                        <td>Model Types</td>
                                        <td>{s.model_type}</td>
                                    </tr>
                                    <tr>
                                        <td>Version</td>
                                        <td>{s.version}</td>
                                    </tr>
                                    <tr>
                                        <td>color</td>
                                        <td>{s.color}</td>
                                    </tr>
                                    <tr>
                                        <td>Country</td>
                                        <td>{s.country}</td>
                                    </tr>
                                    <tr>
                                        <td>Dealer Code</td>
                                        <td>{s.dealer_code}</td>
                                    </tr>
                                    <tr>
                                        <td>Dealer</td>
                                        <td>{s.dealer}</td>
                                    </tr>
                                    <tr>
                                        <td>RO</td>
                                        <td>{s.ro}</td>
                                    </tr>
                                    <tr>
                                        <td>Odometer</td>
                                        <td>{s.odometer}</td>
                                    </tr>
                                    <tr>
                                        <td>Part Number</td>
                                        <td>{s.part_number}</td>
                                    </tr>
                                    <tr>
                                        <td>Part Name</td>
                                        <td>{s.part_name}</td>
                                    </tr>
                                    <tr>
                                        <td>Technician Description</td>
                                        <td>{s.technician_description}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                    
            </div>
            {/* <p>{errorMesage}</p> */}

            </div>
        </div>
    )
}

export default Main;