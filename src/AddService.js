import React,{useState} from 'react';
import { ethers } from 'ethers';
import { Web3Storage } from 'web3.storage';
import "./styles.css";
import CarService_abi from "./truffle/build/contracts/CarServiceContract.json";

const AddService = () => {
    
    const contractAddress = "0xa17D83dfD3d1891f062Ecb9E898DC01995071f77";
    const abi = CarService_abi.abi;
    const web3StorageApi = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUxZDIxNmY4YWE0RmNGMDFCODE4RkMyQTgyMDAyQjhBQ0ExMjMxQjciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTE1Njk1Njc1NjAsIm5hbWUiOiJDYXJTZXJ2aWNlIn0.0ynNnu9b1__XYH_CYB9AeymkOD67gIIDGrGKQsqQBGw";
    const storage = new Web3Storage({token : web3StorageApi});
    //put state variables    
    const [btnTxt, setBtnTxt] = useState("Not Connected");
    const [defaultAccount, setDefaultAccount] = useState("Not Connected");
    const [errorMesage, setErrorMessage] = useState("")
    const [cid, setCid] = useState("");
    //set state variables
    const [searchVIN, setSearchVIN] = useState("");
    const [cids, setCids] = useState([]);
    
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
    };

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


    const retriveFiles = async () =>{

        // Getting cids from block chain
        //harcoding the vin number
        let _vin = "asdasd";
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        let tempSigner = tempProvider.getSigner();
        let tempContract = new ethers.Contract(contractAddress, abi, tempSigner);
        
        const tempCids = tempContract.getServices(_vin);
        console.log(cids);

        // try {
        //     const url = `https://${tempCid}.ipfs.dweb.link/data.json`;
        //     const response = await fetch(url);
        
        //     if (response.ok) {
        //       const content = await response.json();
        //       console.log('Retrieved file content:', content);
        //     } else {
        //       console.error('Error retrieving file:', response.statusText);
        //     }
        //   } catch (error) {
        //     console.error('An error occurred:', error);
        //   }
    }


    return (
        <div class="parent">
            <div class="left">
            <p>Address : {defaultAccount}</p>
            <button onClick={handleConnectButton}>{btnTxt}</button>
            <button onClick={retriveFiles}>Test Button</button>
            <form onSubmit={handleSubmit}>
                <label>VIN</label>
                <input type='text' name="vin" value={uploadData.vin} onChange={handleChange}></input>
                <br />

                <label>Model Type</label>
                <input type='text' name="model_type" value={uploadData.model_type} onChange={handleChange}></input>
                <br />

                <label>Version</label>
                <input type='text' name="version" value={uploadData.version} onChange={handleChange}></input>
                <br />

                <label>Color</label>
                <input type='text' name="color" value={uploadData.color} onChange={handleChange}></input>
                <br />

                <label>Country</label>
                <input type='text' name='country' value={uploadData.country} onChange={handleChange}></input>
                <br />

                <label>Dealer Code</label>
                <input type='text' value={uploadData.dealer_code} name="dealer_code" onChange={handleChange}></input>
                <br />

                <label>Dealer</label>
                <input type='text' value={uploadData.dealer} name="dealer" onChange={handleChange}></input>
                <br />

                <label>RO</label>
                <input type='text' value={uploadData.ro} name="ro" onChange={handleChange}></input>
                <br />

                <label>Odometer</label>
                <input type='number' value={uploadData.odometer} name="odometer" onChange={handleChange}></input>
                <br />

                <label>Part Number</label>
                <input type='text' value={uploadData.part_number} name='part_number' onChange={handleChange}></input>
                <br />

                <label>Part Name</label>
                <input type='text' value={uploadData.part_name} name="part_name" onChange={handleChange}></input>
                <br />

                <label>Technician Description</label>
                <input type='text' value={uploadData.technician_description} name="technician_description" onChange={handleChange}></input>
                <br />

                <button type='submit'>Add Service</button>
            </form>
            <p>{errorMesage}</p>
            </div>

            <div class="right">

                <form>
                    <label>Enter the VIN number</label>
                    <input type="text" name="searchVIN" value={searchVIN}/>

                    <div class="scrollable">
                        <div style={{border : "1px solid black"}}>
                            <table>
                                <tr>
                                    <td>VIN</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Model Types</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Version</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>color</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Country</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Dealer Code</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Dealer</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>RO</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Odometer</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Part Number</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Part Name</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Technician Description</td>
                                    <td></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default AddService;