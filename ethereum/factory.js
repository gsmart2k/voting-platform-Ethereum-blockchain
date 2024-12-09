import web3 from "./web3";
import ProposalFactory from "./build/ProposalFactory.json";

const ProposalFactoryInstance = new web3.eth.Contract(
	ProposalFactory.abi,
	"0x976Ebe75EAB23f17Da254C0594BEf01e3634fc93"
);

export default ProposalFactoryInstance;
