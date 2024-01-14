// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Operation {

  // Ratings de usuario
  mapping(string => uint) userRatings;

  // Ratings de organizaciones
  mapping(address => uint) orgRatings;

  // Nombres de organizaciones
  mapping(address => string) orgNames;

  // Nombres de organizaciones (invertido)
  mapping(string => address) orgAddresses;

  // Ficheros
  mapping(string => bytes32) private fileHashes;

  constructor() {
  }

  // Emitir evento cuando se suba un PDF
  event FileUploaded(string indexed fileName, bytes32 hash);

  // SUBIR UN PDF 
  function uploadPDF(string memory fileName, bytes memory hash) public{
    bytes32 hashBytes32 = bytesToBytes32(hash);
    fileHashes[fileName] = hashBytes32;
    emit FileUploaded(fileName,hashBytes32);
  }

  // FUNCION PARA CONVERTIR DE BYTES A BYTES32
  function bytesToBytes32(bytes memory data) internal pure returns (bytes32 result) {
    require(data.length == 32, "Invalid input length");
    assembly {
        result := mload(add(data, 32))
    }
  }

  // OBTENER EL HASH DE UN FICHERO SUBIDO PREVIAMENTE
  function getHashByFileName(string memory fileName) public view returns (bytes32) {
    return fileHashes[fileName];
  }

  // AÑADIR USUARIO
  function addUser(string memory dni) public returns (uint) {
    userRatings[dni] = 1; // por defecto
    return (userRatings[dni]);
  }

  // AÑADIR ORG
  function addOrg(address newAddress, string memory orgname) public{
    orgRatings[newAddress] = 1; // por defecto
    orgNames[newAddress] = orgname;
    orgAddresses[orgname] = newAddress;
  }

  // BUSCAR USER RATING 
  function getUserRating(string memory dni) public view returns (uint){
    return userRatings[dni];
  }

  // BUSCAR ORG RATING
  function getOrgRating(address orgAddress) public view returns (uint){
    return orgRatings[orgAddress];
  }

  // BUSCAR ORG NAME
  function getOrgName(address orgAddress) public view returns (string memory){
    return orgNames[orgAddress];
  }

  // DAR 1 o 2 PUNTOS A UN USUARIO
  function updateUserRating(string memory dni, uint puntuacion) public returns (bool,uint){
    if (orgRatings[msg.sender] >= 6 && userRatings[dni] != 0){
      userRatings[dni] = userRatings[dni] + puntuacion;
      return (true,userRatings[dni]);
    }else if (orgRatings[msg.sender] >= 1 && orgRatings[msg.sender] <= 5 && userRatings[dni] != 0){
      userRatings[dni] = userRatings[dni] + 1;
      return (true,userRatings[dni]);
    }else{
      return (false,0);
    }
  }

  // QUITAR 1 o 2 PUNTOS A UN USUARIO
  function removeUserVote(string memory dni, uint puntuacion) public returns (bool,uint){
    if (orgRatings[msg.sender] >= 6 && userRatings[dni] != 0){
      if (userRatings[dni] <= puntuacion){
        userRatings[dni] = 1;
        return (true,userRatings[dni]);
      }else{
        userRatings[dni] = userRatings[dni] - puntuacion;
        return (true,userRatings[dni]);
      }
    }else if (orgRatings[msg.sender] >= 1 && orgRatings[msg.sender] <= 5 && userRatings[dni] != 0){
      if (userRatings[dni] > 1){
        userRatings[dni] = userRatings[dni] - 1;
        return (true,userRatings[dni]);
      }else{
        return (true,userRatings[dni]);
      }
    }else{
      return (false,0);
    }
  }

  // AUMENTAR EL RATING DE UNA ORG
  function updateOrgRating(address orgAddress) public returns (bool, uint){
    if (orgRatings[orgAddress] != 0){
      orgRatings[orgAddress] = orgRatings[orgAddress] + 1;
      return (true,orgRatings[orgAddress]);
    }else{
      return (false,0);
    }
  }

  // BUSCAR ORGNAME A PARTIR DE ORGADDRESS
  function getAddressByName(string memory orgName) public view returns(address){
    return orgAddresses[orgName];
  }
}
