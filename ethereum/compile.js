const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// Paths
const buildPath = path.resolve(__dirname, "build");
const proposalPath = path.resolve(__dirname, "contracts", "votingproposal.sol");

// Remove previous build folder
fs.removeSync(buildPath);

// Read contract source code
const source = fs.readFileSync(proposalPath, "utf8");

// Configure input for solc compiler
const input = {
	language: "Solidity",
	sources: {
		"votingproposal.sol": {
			content: source,
		},
	},
	settings: {
		outputSelection: {
			"*": {
				"*": ["abi", "evm.bytecode"],
			},
		},
		optimizer: {
			enabled: true,
			runs: 200,
		},
	},
};

// Compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Ensure the build directory exists
fs.ensureDirSync(buildPath);

// Write the compiled contracts to the build directory
for (const contractName in output.contracts["votingproposal.sol"]) {
	const contract = output.contracts["votingproposal.sol"][contractName];
	const filePath = path.resolve(buildPath, `${contractName}.json`);
	fs.outputJsonSync(filePath, contract);
	console.log(`Contract ${contractName} compiled and saved to ${filePath}`);
}
