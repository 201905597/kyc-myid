// VERIFICAR CREDENCIALES DE USUARIO
async function verificarUser(username,password,validu){
    event.preventDefault();
    let valid = false;
    console.log(username);
    console.log(password);

    if (username == "" || password == ""){
        alert("Por favor, rellena todos los campos");
    }else{
        let res = await fetch("/api/v1/usuarios",{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
        }});

        if (res.status == 200){
            const data = await res.json();
            console.log(data);
            let userId = "";
            for (let i = 0; i<data.length; i++){
                let user = data[i];
                let userName = user["userName"];
                let pass = user["userPwd"];
                userDNI = user["dni"];
                console.log(userDNI);
                console.log(userName);
                console.log(pass);
                //SET del parámetro user DNI
                sessionStorage.setItem("userDNI",userDNI);
                
                console.log(valid);
                if (userName == username && pass == password){
                    valid = true;
                    break;
                }
            }
            if (valid){
                location.replace("userIndex.html");
            }else{
                validu.innerHTML = '<p style="color:red;">Hay algún error en los datos introducidos.</p>';
            }
        }else{
            alert("¡Vaya! No se ha podido resolver tu petición");
        }
    }


}


// VERIFICAR CREDENCIALES DE ORGANIZACIÓN
async function verificarOrg(orgname,pass,error){
    event.preventDefault();

    // Conexión con MetaMask
    let ok = true; 
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        ok = false;
        alert("Por favor, conéctate a MetaMask.");
      } else {
        ok = false;
        console.error(err);
      }
    });
    const account = accounts[0];
    console.log(account);
    console.log(typeof(account));
    const ethAddress = web3.utils.toChecksumAddress(account).toLowerCase();
    console.log(ethAddress);
    let orgNameRes = "";
    kycContract.methods.getOrgName(ethAddress).call({ from: ethAddress }, (error, result) => {orgNameRes = result; });
    await waitSec();
    if (orgNameRes != orgname){
        console.log(orgNameRes);
        console.log(orgname);
        ok = false;
        alert("El nombre de la organización que has introducido no corresponde a tu cuenta de Metamask.");
    }

    // Verificación de credenciales
    if (ok){
        
        let valid = false;
        console.log(orgname);
        console.log(pass);

        if (orgname == "" || pass == ""){
            alert("Por favor, rellena todos los campos");
        }else{
            let res = await fetch("/api/v1/orgs",{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
            }});

            if (res.status == 200){
                const data = await res.json();
                console.log(data);
                
                for (let i = 0; i<data.length; i++){
                    let org = data[i];
                    let orgName = org["orgName"];
                    let password = org["orgPwd"];
                    
                    if (orgName == orgname && password == pass){
                        valid = true;
                        break;
                    }
                }
                if (valid){
                    sessionStorage.setItem("orgName",orgname);
                    sessionStorage.setItem("orgAddress",account);

                    /*if (orgname === "admin"){
                        location.replace("adminIndex.html");
                    }else{
                        location.replace("orgIndex.html");
                    }*/
                    location.replace("orgIndex.html");

                }else{
                    error.innerHTML = '<p style="color:red;">Hay algún error en los datos introducidos.</p>';
                }
            }else{
                alert("¡Vaya! No se ha podido resolver tu petición");
            }
        }
    }
}

function waitSec() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000); // 1000 milliseconds = 1 second
    });
}

// ACCESO SMART CONTRACT
var ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "string",
                "name": "fileName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
            }
        ],
        "name": "FileUploaded",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "orgname",
                "type": "string"
            }
        ],
        "name": "addOrg",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "dni",
                "type": "string"
            }
        ],
        "name": "addUser",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "orgName",
                "type": "string"
            }
        ],
        "name": "getAddressByName",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "fileName",
                "type": "string"
            }
        ],
        "name": "getHashByFileName",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "orgAddress",
                "type": "address"
            }
        ],
        "name": "getOrgName",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "orgAddress",
                "type": "address"
            }
        ],
        "name": "getOrgRating",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "dni",
                "type": "string"
            }
        ],
        "name": "getUserRating",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "dni",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "puntuacion",
                "type": "uint256"
            }
        ],
        "name": "removeUserVote",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "orgAddress",
                "type": "address"
            }
        ],
        "name": "updateOrgRating",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "dni",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "puntuacion",
                "type": "uint256"
            }
        ],
        "name": "updateUserRating",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "fileName",
                "type": "string"
            },
            {
                "internalType": "bytes",
                "name": "hash",
                "type": "bytes"
            }
        ],
        "name": "uploadPDF",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

var deployedContractAddress = "0x52a22F3a0eF68524263627e91734F419D38e39Fe";

//Se instancia el objeto web3
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

//Se selecciona la cuenta por defecto (admin account)
web3.eth.defaultAccount = "0x6aD5816252F3BAdEBe20d85648760bA9c011015B";

//Se instancia el contrato desplegado
var kycContract = new web3.eth.Contract(ABI,deployedContractAddress);

// Get org name by address
//function getOrgName()
  