import { create } from "ipfs-http-client";
import React from "react";
import useRouter from "next/router";
import Voting from "../../../ethereum/proposals";
import web3 from "@/ethereum/web3";
import { useState, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import ProposalFactoryInstance from "../../../ethereum/factory";

// const pinataApiKey = process.env.PINATA_API_KEY;
// const pinataApiSecret = process.env.PINATA_API_SECRET;

// const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

export const getServerSideProps = async (context) => {
	const contractAddress = context.query.contractaddress;
	const VotingPool = Voting(contractAddress);
	const poolName = await VotingPool.methods.getProposalName().call();

	return {
		props: {
			contractAddress: contractAddress,
			poolName,
		},
	};
};

function AdminProposalPage({ contractAddress, poolName }) {
	const [name, setName] = useState("");
	const [party, setParty] = useState("");
	const [image, setImage] = useState("");
	const [voteCount, setVoteCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [formLength, setFormLength] = useState([1]);
	const [generalform, setGeneralForm] = useState([]);
	const [candidates, setCandidates] = useState([]);

	if (error.length >= 1) {
		setTimeout(() => {
			setError("");
		}, 5000);
	} else {
	}

	const handleAddParticipants = async () => {
		const accounts = await web3.eth.getAccounts();
		try {
			const VotingPool = Voting(contractAddress);
			await VotingPool.methods
				.addCandidates("Trump", "Republican", "google.com", 0)
				.send({
					from: accounts[0],
					gas: 1000000,
				});
			console.log("Candidate successfully added");
		} catch (error) {
			console.log(error);
		}
	};
	const handleAddMultipleParticipants = async () => {
		const names = [];
		const party = [];
		const image = [];

		candidates.map((candidate) => {
			names.push(candidate.name);
			party.push(candidate.party);
			image.push(candidate.image);
		});

		const accounts = await web3.eth.getAccounts();
		try {
			const VotingPool = Voting(contractAddress);
			await VotingPool.methods.addMultipleCandidates(names, party, image).send({
				from: accounts[0],
				gas: 1000000,
			});
			console.log("Candidate batch successfully added");
		} catch (error) {
			console.log(error);
		}
	};

	const handleName = (e) => {
		e.preventDefault();
		setName(e.target.value);
	};

	const handleParty = (e) => {
		e.preventDefault();
		setParty(e.target.value);
	};
	const handleImage = (e) => {
		e.preventDefault();
		setImage(e.target.value);
	};

	const handleGetCompletedProposals = async () => {
		const resultss = await ProposalFactoryInstance.methods
			.getCompletedProposals()
			.call();
		console.log(resultss);
	};

	const handleAddCandidate = async (e) => {
		e.preventDefault();
		const cands = { name, party, image };
		setCandidates((prev) => [...prev, cands]);
		setName("");
		setParty("");
		setImage("");
	};

	const handleGetAllCandidates = async (e) => {
		e.preventDefault();
		const accounts = await web3.eth.getAccounts();

		try {
			const VotingPool = Voting(contractAddress);
			const res = await VotingPool.methods.getAllCandidates().call();
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	};

	const handleIncrementField = () => {
		const newArray = [...formLength];
		newArray.push(1);
		setFormLength(newArray);
		console.log(formLength);
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		if (name.length != 0 && party.length != 0 && image.length != 0) {
			const accounts = await web3.eth.getAccounts();
			setLoading(true);
			try {
				const VotingPool = Voting(result);
				await VotingPool.methods
					.addCandidates(name, party, image, voteCount)
					.send({
						from: accounts[0],
						gas: 1000000,
					});
				setLoading(false);
				setError("");
				console.log("Candidate successfully added");
			} catch (error) {
				setError(error.message);
				setLoading(false);
			}
		} else {
			setError("One or more fields are empty");
		}
	};

	const handleEndVoting = async () => {
		const accounts = await web3.eth.getAccounts();

		const VotingPool = Voting(contractAddress);

		try {
			await VotingPool.methods
				.endVoting(contractAddress)
				.send({ from: accounts[0], gas: 1000000 });
			console.log("voting Ended");
		} catch (error) {
			console.log(error);
		}
	};

	const handleVoteCount = (e) => {
		e.preventDefault();
		setVoteCount(e.target.value);
	};
	return (
		<div className="p-3">
			<div className={error ? `bg-red-600 p-3 text-center` : null}>
				<h4>{error.length >= 1 ? error : null}</h4>
			</div>
			<h3>{poolName}</h3>
			<h3>{contractAddress}</h3>

			{formLength.map((forms, index) => (
				<form
					method="POST"
					name="formsubmit"
					key={index}
					className="flex flex-col p-5 space-y-3">
					<input
						name="field1"
						placeholder="Name of candidate"
						className="border border-5 border-black p-3"
						value={name}
						onChange={handleName}
					/>
					<input
						name="field2"
						placeholder="Political Party"
						className="border border-5 border-black p-3"
						value={party}
						onChange={handleParty}
					/>
					<input
						name="field3"
						placeholder="Image Url"
						className="border border-5 border-black p-3"
						value={image}
						onChange={handleImage}
					/>
					<button className="bg-blue-400 p-3" onClick={handleAddCandidate}>
						{" "}
						{loading ? (
							<ArrowPathIcon className="animate-spin h-6 items-center m-auto flex" />
						) : (
							"Add Candidate"
						)}{" "}
					</button>
				</form>
			))}

			<button
				onClick={handleAddMultipleParticipants}
				className="bg-blue-400 rounded-full p-5">
				MAX ADD
			</button>
			<button
				onClick={handleGetAllCandidates}
				className="bg-blue-400 rounded-full p-5">
				GET ALL CANDIDATES
			</button>
			<button
				className="p-3 bg-blue-500  rounded-full"
				onClick={handleEndVoting}>
				End Voting
			</button>
			<button
				className="p-3 bg-blue-500  rounded-full "
				onClick={handleGetCompletedProposals}>
				Get Completed Proposals
			</button>

			<div>{JSON.stringify(candidates, null, 2)}</div>
		</div>
	);
}

export default AdminProposalPage;
