const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();
// note the private key displayed is in hex
console.log('private key: ', toHex(privateKey));

// note the public key displayed is in hex
const publicKey = secp.getPublicKey(privateKey);
console.log('public key: ', toHex(publicKey));

/*
private key:  a8d9021b2dddc00ae0905b424f1ed178f8358a8565590550e1df91d764a7ac63
public key:  046abb1d7ead9007ba2579fd0db632408455976952160f7890bc8e983485227318bffdb2c2bd8420b035f0bf08806a468778c472684ad793dc3063ac84f34d43ee

private key:  48d68d4c5b42ed5fa677a462afe6df54b2c2ab6d859ed262372ab8e6d859a2e3
public key:  043f45e487c3490df9e77f12bb4e2a1958ff4781848b6a03a124a6716f8c676f32dca1317c4f2a0bc38eecfbc9677ba631e42157a915ecb8f2879053df707e5179

private key:  937358d2c9496814d2d481114cfb03f52f60a67883b4b5cad44c1edd3ceeb9b7
public key:  04f23f09413e6a828694080de85ac22651879cedbc92eaa85e7e6adde792582b335f60dcd1c0fce74d991004f48e33a597a90efe7089fe58e9bb44bcdda113243d
*/