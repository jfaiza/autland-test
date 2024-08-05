const { ethers } = require("ethers");
const { getBondTransactionParams } = require("./bond_params.utils");

const bond_handler = async ({ from, to, amount, chain }) => {
  try {
    const eth_amount = ethers.parseUnits(amount, "ether").toString();
    const transactionParams = await getBondTransactionParams(
      to,
      eth_amount,
      chain
    );
    let transaction = transactionParams.props.data;
    return transaction

  } catch (error) {
    console.error("Error sending transaction:", error.message);
  }
};

export { bond_handler };
