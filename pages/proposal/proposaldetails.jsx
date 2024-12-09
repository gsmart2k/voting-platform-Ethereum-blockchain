import React from "react";
import web3 from "@/ethereum/web3";
import Proposal from "../proposals";
import Image from "next/image";
import { FingerPrintIcon } from "@heroicons/react/24/solid";

function proposalDetails() {
	// await Proposal.getMethods()

	return (
		<div className="flex flex-col">
			<div className="flex flex-row justify-between w-96 m-5 items-center">
				<Image src="/img/votomo.png" width="50" height="20" />
				<h3 className="font-bold">0x3ed34345...</h3>
			</div>
			<h3 className="m-5">US Election</h3>

			<div className="flex flex-col w-screen justify-center">
				<Image
					className="w-80 justify-center m-auto"
					width="200"
					height="200"
					alt="trump"
					src="/img/trump.png"
				/>
				<h3 className="flex font-bold bg-black text-white p-3 w-80 justify-center m-auto">
					Donald Trump
				</h3>
				<button className="flex flex-row m-auto bg-green-500 p-3 w-80 justify-center text-white items-center font-semibold space-x-5">
					VOTE <FingerPrintIcon height={20} width={20} />{" "}
				</button>
			</div>
		</div>
	);
}

export default proposalDetails;
