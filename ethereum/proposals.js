import web3 from "./web3";

import Votingsystem from "./build/Votingsystem.json";

export default (address) => {
	return new web3.eth.Contract(Votingsystem.abi, address);
};
