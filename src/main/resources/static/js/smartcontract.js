// POST REQUEST - INSERCION DE USUARIOS
async function registrarse(username,dni,datos,email,password,validu,validu2,dnires){
    event.preventDefault();

    if (datos == "" || username == "" || password == "" || email == ""){
        alert("Por favor, completa todos los campos");
    }else if (password.length < 8){
        alert("La contraseña introducida es demasiado corta");
    }else if(!validarEmail(email)){
        alert("El email introducido no es válido");
    }else if(!validarDNI(dni)){
        alert("El número de DNI introducido no es válido");
    }else{

        // Comprobación de validez del nombre de usuario
        let uservalido = await validUsername(username);
        // Comprobación de validez del dni
        let dnivalido = await validDni(dni);
        // Comprobación dni API
        //let resComp = await compareDNIuser(dni);
        //await waitSec();
        //console.log(resComp);

        compareDNIuser(dni)
            .then(async returnVal => {
                console.log(returnVal);
                let resComp = returnVal;

                if (uservalido && dnivalido && resComp == 0){
                    //No se incluye el ID porque se crea automáticamente siguiendo el orden
                    const dataObj = {
                        "userName" : username,
                        "dni" : dni,
                        "userData" : datos,
                        "userPwd" : password,
                        "userEmail" : email
                    };
        
                    // Inserción del nuevo usuario
                    let res = await fetch("/api/v1/usuarios",{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dataObj)
                    });
        
                    validu.innerHTML = "";
                    validu2.innerHTML = "";
        
                    if (res.status == 201){
                        // Insercion del nuevo user en la blockchain
                        let res = await addFinalUser(dni);
                        console.log(res);
                        alert("Todo ha ido bien :) Ya puedes iniciar sesión");
                        location.replace("inicio.html");
                    }else{
                        alert("¡Vaya! Parece que algo ha ido mal :(");
                    }
        
                }else if (!uservalido){
                    validu.innerHTML = '<p style="color:red;">Ya existe un usuario con este nombre</p>';
                }else if (!dnivalido){
                    validu2.innerHTML = '<p style="color:red;">Este DNI ya está registrado</p>';
                }else if (resComp == 1){
                    dnires.innerHTML= "Introduzca su DNI en PDF. Debe estar actualizado.";
                }else if (resComp == 2){
                    dnires.innerHTML= "¡Vaya! La API del Ministerio del Interior tiene algún problema. Inténtelo más tarde.";
                }else if (resComp == 3){
                    dnires.innerHTML= "Por favor, suba el PDF oficial de su DNI. El que ha subido no coincide.";
                }else if (resComp == 4){
                    dnires.innerHTML= "Parece que su DNI no está en la API del Ministerio de Interior. Revise el número de DNI o compruebe que le ha dado permiso a la API.";
                }else if (resComp == 5){
                    dnires.innerHTML= "Ha ocurrido un error al guardar tu DNI en Blockchain.";
                }

            })
            .catch(error => {
                console.log(error);
            });

        
    }
}

// FUNCION PARA COMPARAR HASH DE MI DNI EN PDF CON EL DE LA API DEL MINISTERIO DE INTERIOR
async function compareDNIuser(dni){
    return new Promise(async(resolve) => {

    
    let returnVal = 3;
    // 0 - correct, 1 - no file input, 2 - API error, 3 - incorrect, 4 - permiso API, 5 - error al guardar en Blockchain
    const fileInput = document.getElementById('dniInputm');
    const file = fileInput.files[0];
    console.log(file);
    if (!file) {
        returnVal = 1;
        resolve(returnVal);
    }else{
        // Lectura del contenido del fichero
        const fileReader = new FileReader();
        fileReader.onload = async function(event){
            const fileData = event.target.result;

            // Generar el hash usando SHA-256 
            const hash = await sha256(fileData); // string, sin prefijo 0x 
            console.log(hash);

            await waitLess();
            
            // Buscar en API para comparar
            let res = await fetch("/api/v1/dnis",{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
            }});
            let found = false;
            if (res.status == 200){
                const data = await res.json();
        
                    for (let i = 0; i<data.length; i++){
                        let user = data[i];
                        console.log(user);
                        let dniH = user["dni"];
                        let hashH = user["dniHash"];
                        console.log(hashH);
                        if (dniH == dni){
                            console.log("user found");
                            found = true;
                            console.log(hashH);
                            console.log(hash);
                            console.log(typeof(hashH));
                            console.log(typeof(hash));
                            if (hashH === hash){
                                console.log("hola")
                                returnVal = 0; // correct
                                // Save hash in blockchain
                                let fileName = dni + "-" + hash;
                                const hashBytes = [];
  
                                // Convertir el hash string a bytes
                                for (let i = 0; i < hash.length; i += 2) {
                                    hashBytes.push(parseInt(hash.substr(i, 2), 16));
                                }
                                kycContract.methods.uploadPDF(fileName,hashBytes).send({ from: web3.eth.defaultAccount })
                                .then(transaction => {
                                    console.log('Hash saved in the blockchain:', hash);
                                    console.log('Transaction:', transaction);
                                    //alert('Hash saved in the blockchain.');
                                    resolve(returnVal);
                                })
                                .catch(error => {
                                    console.error('Error saving hash in the blockchain:', error);
                                    alert('Error saving hash in the blockchain.');
                                    returnVal = 5;
                                    resolve(returnVal);
                                });
                            }else{
                                returnVal = 3; // incorrect
                                resolve(returnVal);
                            }
                        }
                    }
        
                    if (!found){
                        console.log("hola");
                        returnVal = 4; // need permissions
                        resolve(returnVal);
                    }
            }else{
                returnVal = 2;
                resolve(returnVal);
            }
        };
        fileReader.readAsArrayBuffer(file);
    
    }
});
    //return returnVal;
    
}

// prueba
async function check(){
    event.preventDefault();
    console.log("updates are working");
}

// GET REQUEST - GET USERNAMES (para ver si está disponible el username)
async function validUsername(usernamev){

        let res = await fetch("/api/v1/usuarios",{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
        }});

        let valid = true;
        if (res.status == 200){
            const data = await res.json();

            for (let i = 0; i<data.length; i++){
                let user = data[i];
                let userName = user["userName"];
                if (userName == usernamev){
                    valid = false;
                }
            }

            return valid;

        }else{
            alert("¡Vaya! No se ha podido resolver tu petición");
            return false;
        }
}

// GET REQUEST - GET DNIs (para ver si está ya en uso el dni)
async function validDni(dniv){

    let res = await fetch("/api/v1/usuarios",{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
    }});

    let valid = true;
    if (res.status == 200){
        const data = await res.json();

        for (let i = 0; i<data.length; i++){
            let user = data[i];
            let dni = user["dni"];
            if (dni == dniv){
                valid = false;
            }
        }

        return valid;

    }else{
        alert("¡Vaya! No se ha podido resolver tu petición");
        return false;
    }
}

// FUNCION PARA VALIDAR EL EMAIL
function validarEmail(email){
    //REGEXP EMAIL
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

// FUNCION PARA VALIDAR EL FORMATO DEL DNI
function validarDNI(dniNumber) {

    const dniRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
    const dniLetters = "TRWAGMYFPDXBNJZSQVHLCKE";
    if (!dniRegex.test(dniNumber)) {
      return false;
    }
    const letterIndex = parseInt(dniNumber.substring(0, 8)) % 23;
    const expectedLetter = dniLetters.charAt(letterIndex);
    const actualLetter = dniNumber.charAt(8).toUpperCase();
    return expectedLetter === actualLetter;
}

// FUNCION PARA INSERTAR ORGANIZACIONES
async function orgRegistrarse(orgname,password,validu,orgcode,validu7){
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
    const orgAddress = web3.utils.toChecksumAddress(account);


    if (orgname == "" || password == ""){
        alert("Por favor, completa todos los campos");
    }else if(password.length < 8){
        alert("La contraseña introducida es demasiado corta");
    }else{
        // Comprobación de validez del nombre de usuario
        let orgvalida = await validOrgname(orgname);
        // Comprobación de validez del código de la AEB
        let codevalido = await validOrgCode(orgcode,orgname);

        if (orgvalida && codevalido){

            const dataObj = {
                "orgName" : orgname,
                "orgPwd" : password,
            };

            // POST request
            let res = await fetch("/api/v1/orgs",{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataObj)
            });

            validu.innerHTML = "";

            if (res.status == 201){
                alert("Todo ha ido bien :) Ya puedes iniciar sesión");
                // Inserción de la nueva org en la blockchain
                addOrg(orgAddress,orgname);
                // Get orgname
                let resultado1 = "";
                kycContract.methods.getOrgName(orgAddress).call({from: orgAddress}, (error,result) => { resultado1 = result });
                await waitSec();
                console.log(resultado1);
                // Redirect
                location.replace("inicio.html");
            }else{
                alert("¡Vaya! Parece que algo ha ido mal :( prueba otra vez");
            }

        }else if (!orgvalida){
            validu.innerHTML = '<p style="color:red;">Ya existe una organización con este nombre</p>';
        }else if (!codevalido){
            validu7.innerHTML = '<p style="color:red;">El código de la AEB es incorrecto.</p>';
        }
    }
}

// FUNCION PARA VALIDAR EL NOMBRE DE UNA ORG
async function validOrgname(orgnamev){

    let res = await fetch("/api/v1/orgs",{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
    }});

    //console.log("holi");

    let valid = true;
    if (res.status == 200){
        const data = await res.json();

        for (let i = 0; i<data.length; i++){
            let org = data[i];
            let orgName = org["orgName"];
            if (orgName == orgnamev){
                valid = false;
            }
        }

        return valid;

    }else{
        alert("¡Vaya! No se ha podido resolver tu petición");
        return false;
    }
}

// FUNCION PARA VALIDAR EL CODIGO DE LA AEB
async function validOrgCode(orgcode,orgname){

    let res = await fetch("/api/v1/aeb",{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
    }});
    

    let valid = false;
    if (res.status == 200){
        const data = await res.json();
        console.log(data);

        for (let i = 0; i<data.length; i++){
            let org = data[i];
            let orgName = org["orgName"];
            let orgCode = org["orgCode"];
            console.log(orgcode);
            console.log(orgCode);
            if (orgname == orgName && orgCode == orgcode){
                valid = true;
            }
        }

        return valid;

    }else{
        alert("¡Vaya! No se ha podido resolver tu petición");
        return false;
    }

}

// FUNCION PARA CERRAR SESION
function cerrarSesion(usertype)
{
    if (usertype == "user"){
        sessionStorage.setItem("userDNI",null);
        alert("Cierre de sesión correcto");
        location.replace("index.html");
    }else{
        sessionStorage.setItem("orgName",null);
        sessionStorage.setItem("orgAddress",null);
        alert("Cierre de sesión correcto");
        location.replace("index.html");
    }
}

// FUNCIÓN PARA MOSTRAR LAS ORGS (org interface)
// ...
  
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

//Se selecciona la cuenta por defecto
web3.eth.defaultAccount = "0x6aD5816252F3BAdEBe20d85648760bA9c011015B";

//Se instancia el contrato desplegado
var kycContract = new web3.eth.Contract(ABI,deployedContractAddress);

// FUNCION PARA AÑADIR A UN USUARIO
/*function addFinalUser(dni){
    let resultado = 0;
    kycContract.methods.addUser(dni).send({from: web3.eth.defaultAccount}, (error,result) => { resultado = result; });
    return resultado;
}*/
async function addFinalUser(dni) {
    let resultado = 0;
    await kycContract.methods
      .addUser(dni)
      .send({ from: web3.eth.defaultAccount }, (error, result) => {
        resultado = result;
      });
    return resultado;
  }
  

// FUNCION PARA AÑADIR A UNA ORG
function addOrg(address,orgname){
    kycContract.methods.addOrg(address,orgname).send({from: web3.eth.defaultAccount}, (error,result) => { console.log(error + result) });
}

// FUNCION PARA QUE UNA ORG BUSQUE EL RATING DE UN USUARIO
async function getUserRating(dnib){
    event.preventDefault();
    
    let rating = await kycContract.methods.getUserRating(dnib).call({from: web3.eth.defaultAccount}, (error,result) => { console.log(result) });
    waitSec();
    console.log(rating);

    if (rating == 0){
        alert("Este DNI no tiene un rating asociado en Blockchain (no está registrado en MyID).")
    }else{
        var ratingText = document.getElementById('rating-text');
        
        var ratingStars = document.getElementById('rating-stars');

        ratingText.textContent = 'Rating: ' + rating;

        var projectedRating = (rating / 64) * 10;
        console.log(projectedRating);
        projectedRating = Math.trunc(projectedRating);
        console.log(projectedRating);

        ratingStars.innerHTML = '★'.repeat(projectedRating) + '☆'.repeat(5 - projectedRating);
    }
}

// FUNCION PARA QUE UNA ORG VEA SU RATING
async function verMyOrgrating(){
    event.preventDefault();
    let orgName = sessionStorage.getItem("orgName").toString();
    console.log(orgName);
    let orgAddress = sessionStorage.getItem("orgAddress").toString();
    console.log(orgAddress);
    const solidityAddress = web3.utils.toChecksumAddress(orgAddress);
    let rating = await kycContract.methods.getOrgRating(orgAddress).call({from: solidityAddress}, (error,result) => { console.log(result) });
    waitSec();
    console.log(rating);

    var ratingText = document.getElementById('rating-text');
    
    var ratingStars = document.getElementById('rating-stars');

    ratingText.textContent = 'Rating: ' + rating;

    var projectedRating = (rating / 64) * 10;
    console.log(projectedRating);
    projectedRating = Math.trunc(projectedRating);
    console.log(projectedRating);

    ratingStars.innerHTML = '★'.repeat(projectedRating) + '☆'.repeat(5 - projectedRating);
}

// FUNCTION SHOW ORG ADDRESS
async function showOrgAddress(){
    event.preventDefault();
    let orgAddress = sessionStorage.getItem("orgAddress").toString();
    let p = document.getElementById("ethAddr");
    p.innerHTML = orgAddress;
}

// FUNCION SHOW HIDE
async function showVoting(){
    event.preventDefault();
    let orgAddress = sessionStorage.getItem("orgAddress").toString();
    let resultado = 0;
    let orgRating = await kycContract.methods.getOrgRating(orgAddress).call({from: orgAddress}, (error,result) => { resultado = result });
    await waitSec();
    console.log(resultado);
    if (resultado >= 6){
        console.log("hola");
        document.getElementById('more6').style.display = "block";
        document.getElementById('more6q').style.display = "block";
    }else{
        document.getElementById('less6').style.display = "block";
        document.getElementById('less6q').style.display = "block";
    }
}

// FUNCION PARA QUE UNA ORG ACTUALICE EL RATING DE UN USUARIO
async function voteUser(dni,puntuacion){
    event.preventDefault();
    let orgAddress = sessionStorage.getItem("orgAddress").toString();
    //const solidityAddress = web3.utils.toChecksumAddress(orgAddress);
    let resultado = (false,0);
    await kycContract.methods.updateUserRating(dni,puntuacion).send({from: orgAddress}, (error,result) => { resultado = result });
    if (resultado[0]){
        alert("Rating un actualizado correctamente");
    }else{
        alert("Error al actualizar: el DNI no está registrado en MyID o tu organización no tiene suficiente rating");
    }
}


function waitSec() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000); // 1000 milliseconds = 1 second
    });
}

function waitLess() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
}

// FUNCION PARA QUE UNA ORG ACTUALICE (+) EL RATING DE OTRA ORG
async function voteOrg(orgNameV){
    event.preventDefault();
    let senderAddress = sessionStorage.getItem("orgAddress"); // sender
    console.log(senderAddress);
    let resultado = (false,0);
    //const solidityAddress = web3.utils.toChecksumAddress(senderAddress); // sender address
    await kycContract.methods.updateOrgRating(orgNameV).send({from: senderAddress}, (error,result) => { resultado = result });
    if (resultado[0]){
        alert("Rating un actualizado correctamente");
    }else{
        alert("Error al actualizar. Puede que esta organización no forme parte de MyID.");
    }
}

// FUNCION PARA QUE UNA ORG QUITE UN VOTO A UN USUARIO
async function unvoteUser(dni,puntuacion){
    event.preventDefault();
    let orgAddress = sessionStorage.getItem("orgAddress").toString();
    let resultado = (false,0);
    //const solidityAddress = web3.utils.toChecksumAddress(orgAddress);
    await kycContract.methods.removeUserVote(dni,puntuacion).send({from: orgAddress}, (error,result) => { resultado = result });
    if (resultado[0]){
        alert("Rating un actualizado correctamente");
    }else{
        alert("Error al actualizar: el DNI no está registrado en MyID o tu organización no tiene suficiente rating");
    }
}

// FUNCION PARA COMPARAR HASH DE UN DNI EN PDF CON EL DE LA API DEL MINISTERIO DE INTERIOR
async function compareDNI(dni,dnires){
    const fileInput = document.getElementById('dniInputm');
    const file = fileInput.files[0];
    if (!file) {
        alert('Por favor, seleccione un archivo.');
        return;
    }

    // Lectura del contenido del fichero
    const fileReader = new FileReader();
    fileReader.onload = async function(event) {
      const fileData = event.target.result;
  
      // Generar el hash usando SHA-256 
      const hash = await sha256(fileData); // string, sin prefijo 0x 
      console.log(hash);

      // Check rating de la org
      let orgName = sessionStorage.getItem("orgName").toString();
        let orgAddress = sessionStorage.getItem("orgAddress").toString();
        console.log(orgAddress);
        const solidityAddress = web3.utils.toChecksumAddress(orgAddress);
        let orgRating = await kycContract.methods.getOrgRating(solidityAddress).call({from: solidityAddress}, (error,result) => { console.log(result) });
        orgRating = parseInt(orgRating);

        //await waitSec();

        console.log(typeof(orgRating));

        let rati = 8  + orgRating - orgRating;
        console.log(typeof(rati));

        if (orgRating >= rati){

            // Comparar fileName, hash con Blockchain
            let fileNameComp = dni.toString() + "-" +  "dni";
            console.log(fileNameComp);
            console.log(typeof(fileNameComp));
            let hashBlockchain = "";
            let fileHash = kycContract.methods.getHashByFileName(fileNameComp).call({from: solidityAddress}, (error,result) => { hashBlockchain = result; });
            await waitSec();
            console.log(fileHash);
            console.log(hashBlockchain);
            console.log(typeof(hashBlockchain));
            fileHash = hashBlockchain.substring(2);
            console.log(fileHash);
            
            if (fileHash == "0x0000000000000000000000000000000000000000000000000000000000000000"){
                alert("Este documento no está guardado en la Blockchain, el usuario debe subirlo.");
                return;
            }else if (fileHash === hash){
                // Correcto en Blockchain, pasamos a comparar con la BBDD
                let res = await fetch("/api/v1/dnis",{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                }});

                let found = false;
                if (res.status == 200){
                    const data = await res.json();
        
                    for (let i = 0; i<data.length; i++){
                        let user = data[i];
                        console.log(user);
                        let dniH = user["dni"];
                        let hashH = user["dniHash"];
                        console.log(hashH);
                        if (dniH == dni){
                            console.log("user found");
                            found = true;
                            console.log(typeof(hashH));
                            console.log(typeof(hash));
                            if (hashH === hash){
                                dnires.innerHTML = "El documento es correcto."
                            }else{
                                alert("Este documento está correctamente guardado en la Blockchain, pero no coincide con el de la base de datos. Notifique al usuario para que vuelva a subirlo. Puede haber ocurrido un error o una brecha de seguridad.");
                            }
                        }
                    }
        
                    if (!found){
                        dnires.innerHTML = "Este DNI no tiene una entrada asociada en la API del Ministerio del Interior. Notifique al cliente para que le de permiso al Ministerio del Interior para incluir su DNI en la API.";
                    }
        
                }else{
                    alert("¡Vaya! No se ha podido resolver tu petición");
                    return false;
                }
            }else{
                dnires.innerHTML = "Este documento no está guardado en la Blockchain (no verificado).";
            }
        }else{
            alert("Tu organización no tiene acceso a esta funcionalidad.");
        }
    };
    fileReader.readAsArrayBuffer(file);
    
}

// FUNCION PARA COMPARAR HASH DE UN PDF CON EL DE LA API DE HACIENDA
async function compareHacienda(dni,hacienda){
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Por favor, seleccione un archivo.');
        return;
    }

    // Lectura del contenido del fichero
    const fileReader = new FileReader();
    fileReader.onload = async function(event) {
      const fileData = event.target.result;
  
      // Generar el hash usando SHA-256 
      const hash = await sha256(fileData); // string, sin prefijo 0x 
      console.log(hash);

      // Check rating de la org
      let orgName = sessionStorage.getItem("orgName").toString();
        let orgAddress = sessionStorage.getItem("orgAddress").toString();
        console.log(orgAddress);
        const solidityAddress = web3.utils.toChecksumAddress(orgAddress);
        let orgRating = await kycContract.methods.getOrgRating(solidityAddress).call({from: solidityAddress}, (error,result) => { console.log(result) });
        orgRating = parseInt(orgRating);

        //await waitSec();

        console.log(typeof(orgRating));

        let rati = 8  + orgRating - orgRating;
        console.log(typeof(rati));

        if (orgRating >= rati){

            // Comparar fileName, hash con Blockchain
            let fileNameComp = dni.toString() + "-" +  "hacienda";
            console.log(fileNameComp);
            console.log(typeof(fileNameComp));
            let hashBlockchain = "";
            let fileHash = await kycContract.methods.getHashByFileName(fileNameComp).call({from: solidityAddress}, (error,result) => { hashBlockchain = result; });
            //await waitSec();
            console.log(fileHash);
            console.log(hashBlockchain);
            console.log(typeof(hashBlockchain));
            fileHash = hashBlockchain.substring(2);
            console.log(fileHash);
            
            if (fileHash == "0x0000000000000000000000000000000000000000000000000000000000000000"){
                alert("Este documento no está guardado en la Blockchain, el usuario debe subirlo.");
                return;
            }else if (fileHash === hash){
                // Correcto en Blockchain, pasamos a comparar con la BBDD
                let res = await fetch("/api/v1/hacienda",{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                }});

                let found = false;
                if (res.status == 200){
                    const data = await res.json();
        
                    for (let i = 0; i<data.length; i++){
                        let user = data[i];
                        console.log(user);
                        let dniH = user["dni"];
                        let hashH = user["docHash"];
                        console.log(hashH);
                        if (dniH == dni){
                            console.log("user found");
                            found = true;
                            console.log(typeof(hashH));
                            console.log(typeof(hash));
                            if (hashH === hash){
                                hacienda.innerHTML = "El documento es correcto."
                            }else{
                                alert("Este documento está correctamente guardado en la Blockchain, pero no coincide con el de la base de datos. Notifique al usuario para que vuelva a subirlo. Puede haber ocurrido un error o una brecha de seguridad.");
                            }
                        }
                    }
        
                    if (!found){
                        hacienda.innerHTML = "Este DNI no tiene una entrada asociada en la API de Hacienda";
                    }
        
                }else{
                    alert("¡Vaya! No se ha podido resolver tu petición");
                    return false;
                }
            }else{
                hacienda.innerHTML = "Este documento no está guardado en la Blockchain (no verificado).";
            }
        }else{
            alert("Tu organización no tiene acceso a esta funcionalidad.");
        }
    };
    fileReader.readAsArrayBuffer(file);
    
}

// FUNCION PARA QUE UN USUARIO SUBA UN DOCUMENTO PDF
async function uploadPDF(type,fileInput) {
    // type - string de valor "dni" o "hacienda"
    console.log(fileInput);
    const file = fileInput.files[0];
  
    if (!file) {
      alert('Por favor, seleccione un archivo.');
      return;
    }
  
    // Lectura del contenido del fichero
    const fileReader = new FileReader();
    fileReader.onload = async function(event) {
      const fileData = event.target.result;
  
      // Generar el hash usando SHA-256 
      const hash = await sha256(fileData); // string, sin prefijo 0x 
      const hashBytes = [];
  
      // Convertir el hash string a bytes
      for (let i = 0; i < hash.length; i += 2) {
        hashBytes.push(parseInt(hash.substr(i, 2), 16));
      }
  
      // Guardar documento en bbdd
      const dni = sessionStorage.getItem('userDNI').toString();
      const fileBytes = new Uint8Array(fileData);
      console.log("holas3");
  
      const dataObj = {
        "dni": dni,
        "docHash": hash,
        "documentData": Array.from(fileBytes) 
      };

      console.log(dataObj);
  
      try {
        const response = await fetch('/api/v1/docs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataObj),
        });
  
        if (response.status === 201) {
          alert('Documento subido con éxito');
          // Insertar el hash del documento en la blockchain
          saveHashInBlockchain(hashBytes,type);

          // Si todo va bien, busco el dni en los docs y lo borro si 
        } else {
          alert('Algo ha ido mal. Por favor prueba otra vez,');
        }
      } catch (error) {
        console.error('Ha ocurrido un error al subir el documento:', error);
      }
    };
    fileReader.readAsArrayBuffer(file);
  }
  
  
async function sha256(fileData) {
    const buffer = await crypto.subtle.digest('SHA-256', fileData);
    const hashArray = Array.from(new Uint8Array(buffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
  
function saveHashInBlockchain(hash,type) {
    // type - string de valor "dni" o "hacienda"
    let dni = sessionStorage.getItem("userDNI").toString();
    let fileName = dni + "-" + type;
    console.log("fileName en saveHash ");
    console.log(fileName);
    //let hashWithPrefix = '0x' + hash;
    //let hashBytes = web3.utils.hexToBytes(hashWithPrefix); // Convert hexadecimal string to bytes
    //let encodedHash = web3.eth.abi.encodeParameter('bytes32', hashBytes);
    kycContract.methods.uploadPDF(fileName,hash).send({ from: web3.eth.defaultAccount })
    .then(transaction => {
      console.log('Hash saved in the blockchain:', hash);
      console.log('Transaction:', transaction);
      alert('Hash saved in the blockchain.');
    })
    .catch(error => {
      console.error('Error saving hash in the blockchain:', error);
      alert('Error saving hash in the blockchain.');
    });
}


// FUNCION PARA QUE UNA ORG BUSQUE A UN USUARIO EN ASNEF
async function searchASNEF(dni,asnefuser){
    event.preventDefault();
    let orgName = sessionStorage.getItem("orgName").toString();
    let orgAddress = sessionStorage.getItem("orgAddress").toString();
    console.log(orgAddress);
    const solidityAddress = web3.utils.toChecksumAddress(orgAddress);
    let orgRating = await kycContract.methods.getOrgRating(solidityAddress).call({from: solidityAddress}, (error,result) => { console.log(result) });
    orgRating = parseInt(orgRating);
    //await waitLess();

    console.log(typeof(orgRating));

    let rati = 8  + orgRating - orgRating;
    console.log(typeof(rati));
    if (orgRating >= rati){
        
        let res = await fetch("/api/v1/asnef",{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
        }});

        let found = false;
        if (res.status == 200){
            const data = await res.json();

            for (let i = 0; i<data.length; i++){
                let user = data[i];
                console.log(user);
                let dniAsnef = user["dni"];
                if (dniAsnef == dni){
                    console.log("found");
                    found = true;
                    asnefuser.innerHTML = "Este DNI tiene una entrada asociada en ASNEF";
                }
            }

            if (!found){
                asnefuser.innerHTML = "Este DNI no tiene una entrada asociada en ASNEF";
            }

        }else{
            alert("¡Vaya! No se ha podido resolver tu petición");
            return false;
        }

    }else{
        alert("Tu organización no tiene acceso a esta funcionalidad.");
    }
}
  

// FUNCION PARA QUE UNA ORG BUSQUE A UN USUARIO EN LA CIRBE
async function searchCIRBE(dni,cirbeuser){
    event.preventDefault();
    let orgName = sessionStorage.getItem("orgName").toString();
    let orgAddress = sessionStorage.getItem("orgAddress").toString();
    console.log(orgAddress);
    const solidityAddress = web3.utils.toChecksumAddress(orgAddress);
    let orgRating = await kycContract.methods.getOrgRating(solidityAddress).call({from: solidityAddress}, (error,result) => { console.log(result) });
    orgRating = parseInt(orgRating);
    //await waitLess();
    

    console.log(typeof(orgRating));
    console.log(orgRating);

    let rati = 8  + orgRating - orgRating;  
    console.log(typeof(rati));
    console.log(rati);
    console.log(orgRating);
    
    if (orgRating >= rati){
        
        let res = await fetch("/api/v1/cirbe",{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
        }});

        let found = false;
        if (res.status == 200){
            const data = await res.json();

            for (let i = 0; i<data.length; i++){
                let user = data[i];
                console.log(user);
                let dniCirbe = user["dni"];
                let deudaCirbe = user["deuda"];
                if (dniCirbe == dni){
                    console.log("found");
                    found = true;
                    cirbeuser.innerHTML = "Este DNI tiene un total de " + deudaCirbe + " euros en préstamos registrados en la CIRBE";
                }
            }

            if (!found){
                cirbeuser.innerHTML = "Este DNI no tiene préstamos asociados registrados en la CIRBE";
            }

        }else{
            alert("¡Vaya! No se ha podido resolver tu petición");
            return false;
        }

    }else{
        alert("Tu organización no tiene acceso a esta funcionalidad.");
    }
}

// FUNCION PARA MOSTRAR LOS DATOS DE USUARIO
async function showUserData(){

    let dni = sessionStorage.getItem("userDNI").toString();

    let res = await fetch("/api/v1/usuarios",{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
    }});

    let found = false;
        if (res.status == 200){
            const data = await res.json();

            for (let i = 0; i<data.length; i++){
                let user = data[i];
                console.log(user);
                let userDni = user["dni"];
                let userData = user["userData"];
                let userName = user["userName"];
                let userEmail = user["userEmail"];
                if (userDni == dni){
                    console.log("found");
                    found = true;
                    document.getElementById('nombreuser').innerHTML = userData;
                    document.getElementById('dniuser').innerHTML = userDni;
                    document.getElementById('mailuser').innerHTML = userEmail;
                    document.getElementById('usernameuser').innerHTML = userName;
                }
            }

            if (!found){
                alert("¡Vaya! Ha ocurrido un error al tratar de cargar tus datos de usuario.")
            }

        }else{
            alert("¡Vaya! Ha ocurrido un error al tratar de cargar tus datos de usuario.");
            return false;
        }

}

// FUNCION PARA QUE UN USUARIO VEA SU RATING
async function verMyIDrating(){
    let userDNI = sessionStorage.getItem("userDNI").toString();
    console.log(typeof(userDNI));
    console.log(userDNI);
    let rating = await kycContract.methods.getUserRating(userDNI).call({from: web3.eth.defaultAccount}, (error,result) => { console.log(result) });
    waitSec();
    console.log(rating);

    var ratingText = document.getElementById('rating-text');
    
    var ratingStars = document.getElementById('rating-stars');

    ratingText.textContent = 'Rating: ' + rating;

    var projectedRating = (rating / 64) * 10;
    console.log(projectedRating);
    projectedRating = Math.trunc(projectedRating);
    console.log(projectedRating);

    ratingStars.innerHTML = '★'.repeat(projectedRating) + '☆'.repeat(5 - projectedRating);
}

function getOrgAddress(orgname) {
    return new Promise((resolve, reject) => {
      kycContract.methods.getAddressByName(orgname).call({ from: web3.eth.defaultAccount }, (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          const addressString = result.toString();
          resolve(addressString);
        }
      });
    });
}

