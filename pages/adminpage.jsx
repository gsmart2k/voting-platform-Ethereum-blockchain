import React, { useState } from "react";
import web3 from "@/ethereum/web3";
import ProposalFactoryInstance from "@/ethereum/factory";
import Voting from "../ethereum/proposals";
import Link from "next/link";
import { useRouter } from "next/router";
import {
	ArrowDownRightIcon,
	ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";

export const getServerSideProps = async () => {
	const result = await ProposalFactoryInstance.methods
		.getActiveProposals()
		.call();
	// console.log(result);
	return {
		props: {
			results: result,
		},
	};
};

function AdminPage({ results }) {
	const router = useRouter();

	const [votingPoolName, setVotingPoolName] = useState("");
	const [votingPoolAddress, setVotingPoolAddress] = useState("");
	const [contracts, setContracts] = useState("");

	console.log("results:");
	console.log(results);

	results.map((res) => {
		console.log(res);
	});

	const handleInputChange = (e) => {
		e.preventDefault;
		setVotingPoolName(e.target.value);
	};

	const handleCreateVotingPool = async () => {
		const accounts = await web3.eth.getAccounts();

		console.log(accounts);
		console.log("testing this out ");

		try {
			await ProposalFactoryInstance.methods
				.createVotingPool(votingPoolName, accounts[0])
				.send({
					from: accounts[0],
				});
			router.reload();
		} catch (error) {
			console.log(error);
		}
	};
	const handleGetPoolName = async () => {
		const VotingPool = Voting(results[1]);
		try {
			const result = await VotingPool.methods.getProposalName().call();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<h1 className="font-bold p-3">ADMIN PAGE</h1>
			<div className="flex flex-row justify-center items-center w-full">
				<input
					placeholder="Pool Name"
					value={votingPoolName}
					onChange={handleInputChange}
					className="border border-1 border-black p-3 w-10/12"
				/>
				<button className="p-3 bg-blue-500" onClick={handleCreateVotingPool}>
					<ArrowRightCircleIcon width={30} height={30} />
				</button>
			</div>
			<div className="mt-10 p-3">
				<h3>Created Contracts</h3>
				{results.map((contract, index) => (
					<div key={index}>
						<Link
							className="text-blue-600 font-semibold"
							href={`/admin/proposals/${contract}`}>
							{contract}
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}

export default AdminPage;
