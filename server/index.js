const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "046abb1d7ead9007ba2579fd0db632408455976952160f7890bc8e983485227318bffdb2c2bd8420b035f0bf08806a468778c472684ad793dc3063ac84f34d43ee": 100,
  "043f45e487c3490df9e77f12bb4e2a1958ff4781848b6a03a124a6716f8c676f32dca1317c4f2a0bc38eecfbc9677ba631e42157a915ecb8f2879053df707e5179": 50,
  "04f23f09413e6a828694080de85ac22651879cedbc92eaa85e7e6adde792582b335f60dcd1c0fce74d991004f48e33a597a90efe7089fe58e9bb44bcdda113243d": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { 
    sender, 
    recipient, 
    amount
  } = req.body;

  let sendDetailsError = await validateSendDetails(req.body);
  if (sendDetailsError) {
    res.status(400).send(sendDetailsError);
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

async function validateSendDetails(body) {
  const { 
    sender, 
    recipient, 
    amount,
    signature,
    messageHash,
    publicKey
  } = body;

  if (!isSignatureVerified(signature, messageHash, publicKey)) {
    return { message: "Not a verified signature" };
  }

  if (await doesSendDetailsMatchMessageHash(sender, amount, recipient, messageHash)) {
    return { message: "send details do not match message hash"};
  }

  return null;
}

function isSignatureVerified(signature, messageHash, publicKey) {
  return secp.verify(signature, messageHash, publicKey);
}

async function doesSendDetailsMatchMessageHash(sender, amount, recipient, messageHash) {
  let rawMessageHash = await secp.utils.sha256(utf8ToBytes(JSON.stringify({
    sender,
    amount,
    recipient
  })));
  return messageHash !== toHex(rawMessageHash);
}

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
