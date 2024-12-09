require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const compiledFactory = require("./build/ProposalFactory.json");

const privateKey = process.env.PRIVATE_KEY;
const sepoliaKey = process.env.SEPOLIA_KEY;

console.log("Private hereee");
console.log(privateKey);
console.log(sepoliaKey);

const provider = new HDWalletProvider(
	privateKey,
	`https://sepolia.infura.io/v3/${sepoliaKey}`
);

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	const gasPrice = await web3.eth.getGasPrice();

	const gasEstimate = await new web3.eth.Contract(compiledFactory.abi)
		.deploy({ data: compiledFactory.evm.bytecode.object })
		.estimateGas({ from: accounts[0] });

	console.log("Attempting to deploy from account", accounts[0]);

	try {
		const result = await new web3.eth.Contract(compiledFactory.abi)
			.deploy({ data: compiledFactory.evm.bytecode.object })
			.send({ gas: gasEstimate, from: accounts[0] });
		console.log("Contract deployed to", result.options.address);
	} catch (error) {
		console.error("Deployment error:", error);
	}

	provider.engine.stop();
};

// Deploy the contract
deploy();

// 0xea3e792bb1c38f6ff70805480631e4539333fef8; First Contract Address
