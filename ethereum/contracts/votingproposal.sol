// SPDX-License-Identifier: MmemoryIT
pragma solidity ^0.8.0;

contract ProposalFactory {
    address[] public proposalAddresses;
    address[] public completedProposal;
    mapping(address => bool) hasCompleted;

    function createVotingPool(string memory _proposalName, address) public {
        VotingSystem newProposal = new VotingSystem(
            _proposalName,
            msg.sender,
            address(this)
        );
        proposalAddresses.push(address(newProposal));
        hasCompleted[address(newProposal)] = false;
    }

    function getActiveProposals() public view returns (address[] memory) {
        return (proposalAddresses);
    }

    function addCompletedProposal(address _completedProposal) public {
        completedProposal.push(_completedProposal);
    }

    function getCompletedProposals() public view returns (address[] memory) {
        return (completedProposal);
    }
}
contract VotingSystem {
    struct Candidate {
        string name;
        string party;
        string imageUrl;
        uint voteCount;
    }

    ProposalFactory public Pfactory;

    string proposalName;
    address public manager;
    Candidate[] public candidates;
    address[] public voters;
    mapping(address => bool) public hasVoted;
    bool public votingCompleted;

    mapping(string => uint) public candidateIndex;

    constructor(
        string memory _proposalName,
        address creator,
        address factoryAddress
    ) {
        manager = creator;
        proposalName = _proposalName;
        votingCompleted = false;
        Pfactory = ProposalFactory(factoryAddress);
    }

    modifier onlyManager() {
        require(
            msg.sender == manager,
            "Only the manager can call this function"
        );
        _;
    }

    function getProposalName() public view returns (string memory) {
        return (proposalName);
    }

    function addCandidate(
        string memory _name,
        string memory _party,
        string memory _imageUrl,
        uint _voteCount
    ) public onlyManager {
        candidates.push(
            Candidate({
                name: _name,
                party: _party,
                imageUrl: _imageUrl,
                voteCount: _voteCount
            })
        );

        candidateIndex[_name] = candidates.length; // Store 1-based index
    }

    function addMultipleCandidates(
        string[] memory _names,
        string[] memory _party,
        string[] memory _image
    ) public onlyManager {
        for (uint256 i = 0; i < _names.length; i++) {
            candidates.push(
                Candidate({
                    name: _names[i],
                    party: _party[i],
                    imageUrl: _image[i],
                    voteCount: 0
                })
            );
            candidateIndex[_names[i]] = candidates.length;
        }
    }

    function getCandidate(
        uint index
    ) public view returns (string memory, string memory, string memory, uint) {
        Candidate memory candidate = candidates[index];
        return (
            candidate.name,
            candidate.party,
            candidate.imageUrl,
            candidate.voteCount
        );
    }

    function getCandidateIndex(string memory name) public view returns (uint) {
        return candidateIndex[name];
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function vote(string memory name) public {
        require(candidateIndex[name] > 0, "Candidate does not exist"); // Ensure candidate exists
        uint index = candidateIndex[name] - 1; // Convert 1-based index to 0-based
        require(index < candidates.length, "Candidate not found");

        require(hasVoted[msg.sender] != true, "User Already Voted"); // Ensure user hasn't voted already

        candidates[index].voteCount++; // Increment vote count
        voters.push(msg.sender); // Track voter
        hasVoted[msg.sender] = true; // Mark user as voted
    }

    function endVoting() public onlyManager {
        votingCompleted = true;
        Pfactory.addCompletedProposal(address(this));
    }

    function proposalStatus() public view returns (bool) {
        return votingCompleted;
    }
    
    function isManager(address _address) view public returns(bool){
        if(_address == manager){
            return true;
        }else{
            return false;
        }
    }
}
