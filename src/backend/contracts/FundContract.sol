// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract FundContract {
    struct FundCampaign {
        address owner; //types the campaing object have
        string title;
        string description;
        uint256 target; //targetamount
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators; //array of address donators
        uint256[] donations; //array of numbers for donations
    }

    mapping(uint256 => FundCampaign) public fundCampaigns; //we pass keyType in uint and get struct FundCampaign back

    uint256 public numberOfCampaigns = 0;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public {
        console.log("_owner = ", _owner);
        console.log("_title = ", _title);
        console.log("_description = ", _description);
        console.log("_target = ", _target);
        console.log("_deadline = ", _deadline);
        console.log("_image = ", _image);
        //called mapping and passing uint and getting the struct back
        FundCampaign storage campaign = fundCampaigns[numberOfCampaigns]; //storing data on 0 index and storing data on bl
        console.log("campaign = ", campaign.deadline);
        console.log("numberOfCampaigns = ", numberOfCampaigns);
        console.log("block.timestamp = ", block.timestamp);
        require(
            campaign.deadline < block.timestamp, //if deadline is in past it will throw error
            "The deadline should be a date in the future."
        );
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++; //after storing on 0 index it becomes 1
    }

    function getCampaigns() public view returns (FundCampaign[] memory) {
        //function will return an array of FundCampaign structs.
        FundCampaign[] memory allCampaigns = new FundCampaign[]( //This line declares a dynamic array of FundCampaign structs called allCampaigns.
            numberOfCampaigns //numberOfCampaigns is used to determine the initial size of this array.
        );
        console.log("numberOfCamp = ", numberOfCampaigns); //become 1 on adding first campaign
        for (uint i = 0; i < numberOfCampaigns; i++) {
            console.log("i : ", i);
            FundCampaign storage item = fundCampaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }

    function donateToCampaign(uint256 _id) public payable {
        //payable address can recieve ether's
        uint256 amount = msg.value; //the value passed by this const resp = await (
        //     await contract.donateToCampaign([index], {
        //       value: ethers.utils.parseEther(fundValue), //we can pass amount directly like this
        //     })
        //   ).wait();
        console.log("amount = ", amount); //use get the amount directly
        FundCampaign storage campaign = fundCampaigns[_id];
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent, ) = payable(campaign.owner).call{value: amount}(""); //the owner of the contract will recieve the money and gets reflected in his account
        console.log("campaign.amountCollected = ", campaign.amountCollected);
        console.log("amoun = ", amount);
        console.log("sent = ", sent);
        if (sent) {
            campaign.amountCollected = campaign.amountCollected + amount; //adding fund to previously added amount
        }
    }
}

// pragma solidity ^0.8.9;
// import "hardhat/console.sol";

// contract FundContract {
//     struct FundCampaign {
//         address owner; //types the campaing object have
//         string title;
//         string description;
//         uint256 target; //targetamount
//         uint256 deadline;
//         uint256 amountCollected;
//         string image;
//         address[] donators; //array of address donators
//         uint256[] donations; //array of numbers for donations
//     }

//     mapping(uint256 => FundCampaign) public fundCampaigns;

//     uint256 public numberOfCampaigns = 0;

//     function createCampaign(
//         address _owner,
//         string memory _title,
//         string memory _description,
//         uint256 _target,
//         uint256 _deadline,
//         string memory _image
//     ) public returns (uint256) {
//         console.log("_owner = ", _owner);
//         console.log("_title = ", _title);
//         console.log("_description = ", _description);
//         console.log("_target = ", _target);
//         console.log("_deadline = ", _deadline);
//         console.log("_image = ", _image);

//         FundCampaign storage campaign = fundCampaigns[numberOfCampaigns];
//         console.log("campaign = ", campaign.deadline);
//         console.log("numberOfCampaigns = ", numberOfCampaigns);
//         require(
//             campaign.deadline < block.timestamp, //if deadline is in past it will throw error
//             "The deadline should be a date in the future."
//         );
//         campaign.owner = _owner;
//         campaign.title = _title;
//         campaign.description = _description;
//         campaign.target = _target;
//         campaign.deadline = _deadline;
//         campaign.amountCollected = 0;
//         campaign.image = _image;

//         numberOfCampaigns++;
//         return numberOfCampaigns - 1;
//     }

//     function getCampaigns() public view returns (FundCampaign[] memory) {
//         FundCampaign[] memory allCampaigns = new FundCampaign[](
//             numberOfCampaigns
//         );
//         console.log("numberOfCampaigns", numberOfCampaigns);
//         for (uint i = 0; i < numberOfCampaigns; i++) {
//             console.log("i : ", i);
//             FundCampaign storage item = fundCampaigns[i];
//             allCampaigns[i] = item;
//         }
//         return allCampaigns;
//     }

//     function donateToCampaign(uint256 _id) public payable {
//         uint256 amount = msg.value;

//         FundCampaign storage campaign = fundCampaigns[_id];

//         campaign.donators.push(msg.sender);
//         campaign.donations.push(amount);

//         (bool sent, ) = payable(campaign.owner).call{value: amount}("");

//         if (sent) {
//             campaign.amountCollected = campaign.amountCollected + amount;
//         }
//     }

//     function getDonators(
//         uint256 _id
//     ) public view returns (address[] memory, uint256[] memory) {
//         return (fundCampaigns[_id].donators, fundCampaigns[_id].donations);
//     }
// }
