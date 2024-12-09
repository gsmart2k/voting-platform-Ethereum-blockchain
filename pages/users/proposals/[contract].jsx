import Image from "next/image";
import React, { useState } from "react";
import Voting from "../../../ethereum/proposals";
import web3 from "@/ethereum/web3";
import { FingerPrintIcon } from "@heroicons/react/24/solid";

export const getServerSideProps = async (context) => {
	const address = context.query.contract;
	const VotingPool = Voting(address);

	const name = await VotingPool.methods.getProposalName().call();
	const cands = await VotingPool.methods.getAllCandidates().call();

	const formattedCandidates = cands.map((candidate) => ({
		name: candidate.name,
		party: candidate.party,
		imageUrl: candidate.imageUrl,
		voteCount: Number(candidate.voteCount), // Convert BigInt to number
	}));

	console.log(formattedCandidates);

	return {
		props: {
			address: address,
			name: name,
			candidates: formattedCandidates,
		},
	};
};

function ProposalDetailsUsers({ address, name, candidates }) {
	const [voting, setVoting] = useState(Array(candidates.length).fill("Vote"));
	const [errorMsg, setErrorMsg] = useState("");

	const handleVote = async (name, index) => {
		const accounts = await web3.eth.getAccounts();
		const updatedVoting = [...voting];
		updatedVoting[index] = "Voting";
		setVoting(updatedVoting);
		const VotingPool = Voting(address);
		try {
			await VotingPool.methods.vote(name).call({ from: accounts[0] });
			await VotingPool.methods
				.vote(name)
				.send({ from: accounts[0], gas: 1000000 });
			updatedVoting[index] = "Vote completed";
			setVoting(updatedVoting);
			// console.log(result)
		} catch (error) {
			const updatedVoting = [...voting];
			setVoting(updatedVoting);
			setErrorMsg(error.message);
			console.log(error.message);
		}
	};

	// Handler for auto Error removal

	if (errorMsg.length > 0) {
		setTimeout(() => {
			setErrorMsg("");
		}, 10000);
	}

	return (
		<div>
			<div
				className={
					errorMsg.length > 0 ? `p-3 m-3 bg-red-600 text-center` : "none"
				}>
				{errorMsg.length > 0 ? errorMsg : ""}
			</div>
			<h3 className="font-bold p-5">{name}</h3>
			{candidates.map((candidate, index) => (
				<div
					key={index}
					onClick={() => handleVote(candidate.name, index)}
					className="flex flex-col space-y-4 items-center">
					<div className="flex w-9/12  bg-blue-200">
						<img
							className="flex object-cover"
							alt="candidates Image"
							src={candidate.imageUrl}
						/>
					</div>
					<h4 className="font-bold">{candidate.name}</h4>
					<div className="flex flex-row items-center justify-center bg-green-500 p-3 w-9/12 space-x-1">
						<button className="">{voting[index]}</button>
						<FingerPrintIcon height={20} width={20} />
					</div>
				</div>
			))}
		</div>
	);
}

export default ProposalDetailsUsers;
