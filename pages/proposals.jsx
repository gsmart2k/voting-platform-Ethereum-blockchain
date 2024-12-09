import React, { useState } from "react";
import { FingerPrintIcon } from "@heroicons/react/24/solid";
import { NoSymbolIcon } from "@heroicons/react/24/solid";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { PaperClipIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Web3 from "web3";
import web3 from "@/ethereum/web3";
import ProposalFactoryInstance from "@/ethereum/factory";
import Voting from "../ethereum/proposals";
import Link from "next/link";
import Router, { useRouter } from "next/router";

export const getServerSideProps = async () => {
	const completedProposals = await ProposalFactoryInstance.methods
		.getCompletedProposals()
		.call();
	const res = await ProposalFactoryInstance.methods.getActiveProposals().call();
	let contracts = [];
	for (let i = 0; i < res.length; i++) {
		const VotingPool = Voting(res[i]);
		const name = await VotingPool.methods.getProposalName().call();
		const proposalStatus = await VotingPool.methods.proposalStatus().call();
		if (!proposalStatus) {
			contracts.push({ [name]: res[i] });
		}
	}

	let completedProposalsArray = [];
	for (let i = 0; i < completedProposals.length; i++) {
		const VotingPool = Voting(completedProposals[i]);
		const name = await VotingPool.methods.getProposalName().call();
		completedProposalsArray.push({ [name]: completedProposals[i] });
	}

	return {
		props: {
			result: contracts,
			completedProposals: completedProposalsArray,
		},
	};
};

function Proposal({ result, completedProposals }) {
	const router = useRouter();

	const [userAddress, setUserAddress] = useState("");
	const [web3, setWeb3] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	// const proposals = web3.eth.

	const checkMetaMask = () => {
		if (window.ethereum) {
			return true;
		} else {
			alert("Please install MetaMask!");
			return false;
		}
	};

	const connectWallet = async () => {
		if (!checkMetaMask()) return; // Make sure MetaMask is installed

		// Request account access if necessary
		try {
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const web3Instance = new Web3(window.ethereum); // Create a Web3 instance
			setWeb3(web3Instance); // Store the web3 instance
			setUserAddress(accounts[0]); // Set the account to display
			console.log("Connected account:", accounts[0]);
		} catch (error) {
			console.log("Error connecting wallet:", error);
		}
	};

	const handleAdminCheck = async () => {
		try {
			const VotingPool = Voting(result[0].NIGERIA);
			const isManager = await VotingPool.methods.isManager(userAddress).call();
			if (isManager) {
				router.push("/adminpage");
			} else setErrorMsg("You must be an admin to visit this page");
		} catch (error) {
			console.log(error);
		}
	};

	//  ERROR REMOVAL FN
	if (errorMsg.length > 0) {
		setTimeout(() => {
			setErrorMsg("");
		}, 10000);
	}

	return (
		<div className=" p-3 h-screen mt-10">
			<div
				className={
					errorMsg.length > 0 ? `p-3 m-3 bg-red-600 text-center` : "none"
				}>
				{errorMsg.length > 0 ? errorMsg : ""}
			</div>
			<Image
				className="flex m-auto"
				src="/img/votomo.png"
				width={100}
				alt="Votomo"
				height={100}
			/>

			<div className="p-5">
				<div className="flex justify-start flex-col items-start">
					<h3 className="font-bold">Active Proposals</h3>
					<div className="space-y-4">
						{result.length == 0 ? (
							<h3>Sorry, there No Active proposals</h3>
						) : (
							result.map((res, index) =>
								Object.keys(res).map((key) => (
									<div key={index} className="flex flex-row space-x-3">
										<Link href={`/users/proposals/${res[key]}`}>
											<div className="bg-gray-700 p-3 w-60 text-white">
												{key}
											</div>
										</Link>
										<div className="bg-green-500 p-3">
											<FingerPrintIcon height={20} width={20} />
										</div>
										<div className="bg-black p-3">
											<NoSymbolIcon color="white" height={20} width={20} />
										</div>
									</div>
								))
							)
						)}
					</div>
				</div>
				<div className="flex justify-start flex-col items-start mt-10 space-y-3">
					<h3 className="font-bold">Completed Proposals</h3>
					{result.length == 0 ? (
						<h3>Sorry, there are No Completed proposals</h3>
					) : (
						completedProposals.map((res, index) =>
							Object.keys(res).map((key) => (
								<div key={index} className="flex flex-row space-x-3 ">
									<Link href={`/users/proposals/${res[key]}`}>
										<div className="bg-gray-700 p-3 w-60 text-white opacity-60">
											{key}
										</div>
									</Link>
									<div className="bg-green-500 p-3">
										<FingerPrintIcon height={20} width={20} />
									</div>
									<div className="bg-black p-3">
										<NoSymbolIcon color="white" height={20} width={20} />
									</div>
								</div>
							))
						)
					)}
				</div>
			</div>
			<div className="mt-10">
				{userAddress ? (
					<div className="flex flex-col content-center text-center m-auto items-center">
						<h3 className="font-bold">Connected Address</h3>
						<h5>{userAddress}</h5>
					</div>
				) : (
					<button
						onClick={connectWallet}
						className="flex bg-black  rounded-lg p-3 text-white m-auto w-11/12 items-center justify-center mt-10">
						Connect Wallet
					</button>
				)}
			</div>

			<button
				className="flex fixed bottom-5 font-bold"
				onClick={handleAdminCheck}>
				ARE YOU AN ADMIN ? CLICK HERE
			</button>
		</div>
	);
}

export default Proposal;
