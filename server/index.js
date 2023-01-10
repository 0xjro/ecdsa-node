const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const secp = require("ethereum-cryptography/secp256k1");

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

app.post("/send", (req, res) => {
  const { 
    sender, 
    recipient, 
    amount,
    signature,
    messageHash,
    publicKey
  } = req.body;

  const isVerified = secp.verify(signature, messageHash, publicKey);

  if (!isVerified) {
    return res.status(400).send({ message: "Not a verified signature" });
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

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
