// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Voting {
    struct Selector {
        address owner;
        address selector_address;
        uint256 voteCount;
    }

    struct Participant {
        address participant_address;
        address selector_address;
    }
    address public admin;
    uint256 public selector_index;
    uint256 public participant_index;

    constructor() {
        admin = msg.sender;
    }

    mapping(uint256 => Selector) public selectors;
    mapping(uint256 => Participant) public participants;

    function add_selector(address to) external {
        uint256 same = 0;
        for (uint256 i = 0; i < selector_index; i++) {
            if (selectors[i].selector_address == to) {
                same++;
            }
        }
        require(same == 0, "This Selector already Voting!");
        require(admin == msg.sender, "Only admin can do this action!");
        selectors[selector_index] = Selector(msg.sender, to, 0);
        selector_index++;
    }

    function add_participants(address selector_address) external {
        require(admin != msg.sender, "Admin can't do this action!");
        require(selector_index > 0, "No selector created first create selector!");

        uint256 same_participant = 0;
        for (uint256 i = 0; i < participant_index; i++) {
            if (participants[i].participant_address == msg.sender) {
                same_participant++;
            }
        }

        
        require(same_participant == 0, "This Participant already Voting!");
       
       //check selector have or not
        uint256 not_found_selector = 0;
        uint256 selector_own = 0;
        uint256 selector_indexing;
        for (uint256 i = 0; i < selector_index; i++) {
            if (selectors[i].selector_address == selector_address) {
                selector_indexing = i;
                break;
            } else {
                not_found_selector++;
            }

        }

        for (uint256 i = 0; i < selector_index; i++) {
            if (selectors[i].selector_address == msg.sender) {
                selector_own++;
            }
        }

        require(selector_own == 0, "Selector can not Vote for Self!");
        require(not_found_selector == 0, "Selector not Found!");
        
        participants[participant_index] = Participant(msg.sender, selector_address);
        selectors[selector_indexing].voteCount++;
        participant_index++;

    }

    function select_winner() external view returns (Selector memory) {
        require(msg.sender == admin, "Only admin can do this action !");
        require(selector_index > 0, "Selector Can not be created!");
        require(
            participant_index > 0,
            "Participant can not vote any one selector!"
        );
        uint256 i;
        uint256 indexing;
        uint256 count = selectors[0].voteCount;
        for (i = 0; i < selector_index; i++) {
            if (selectors[i].voteCount > count) {
                count = selectors[i].voteCount;
                indexing = i;
            }
        }
        return selectors[indexing];
    }
}
