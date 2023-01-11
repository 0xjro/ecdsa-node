import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { utf8ToBytes, toHex, hexToBytes } from "ethereum-cryptography/utils";

function Transfer({ setBalance, publicKey, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    let rawMessageHash = await secp.utils.sha256(utf8ToBytes(JSON.stringify({
      sender: publicKey,
      amount: parseInt(sendAmount),
      recipient
    })));

    let messageHash = toHex(rawMessageHash);
    const signature = toHex(await secp.sign(messageHash, privateKey));

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: publicKey,
        amount: parseInt(sendAmount),
        recipient,
        signature,
        messageHash,
        publicKey
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
