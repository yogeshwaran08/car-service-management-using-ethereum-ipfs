import React from 'react'

const GetService = () => {

    const contractAddress = "0xa17D83dfD3d1891f062Ecb9E898DC01995071f77";
    const abi = CarService_abi.abi;
    const web3StorageApi = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUxZDIxNmY4YWE0RmNGMDFCODE4RkMyQTgyMDAyQjhBQ0ExMjMxQjciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTE1Njk1Njc1NjAsIm5hbWUiOiJDYXJTZXJ2aWNlIn0.0ynNnu9b1__XYH_CYB9AeymkOD67gIIDGrGKQsqQBGw";
    const storage = new Web3Storage({token : web3StorageApi});
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [btnTxt, setBtnTxt] = useState("Not Connected");
    const [defaultAccount, setDefaultAccount] = useState("Not Connected");
    const [errorMesage, setErrorMessage] = useState("")
    const [cid, setCid] = useState("");

        
  return (
    <div>

    </div>
  )
}

export default GetService