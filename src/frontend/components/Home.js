import React, { useEffect, useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { Box, Button, TextField, Typography } from "@mui/material";
import AddCampaignsModal from "./AddCampaignsModal";
import { ethers } from "ethers";
import ContractAddress from "../contractsData/FundContract-address.json";
import ContractAbi from "../contractsData/FundContract.json";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [fundValue, setFundValue] = useState("");
  const [fundInputIndex, setFundInputIndex] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const { sdk, connected, account } = useSDK();

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //dealing with smart contract

  const getEthProvider = async () => {
    //getting our contract using ethers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log("provider = ", provider);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("signer = ", signer);
    const fundingContract = new ethers.Contract(
      ContractAddress.address,
      ContractAbi.abi,
      signer
    );
    console.log("fundingContract", fundingContract);
    return fundingContract;
  };

  const getAllCampaigns = async () => {
    const contract = await getEthProvider();
    console.log("contract", contract);
    const resp = await contract.getCampaigns();
    const finalCampaignResp = resp?.map((item) => {
      const deadlineInNumber = item.deadline.toNumber();
      const difference = new Date(deadlineInNumber).getTime() - Date.now();
      const remainingDays = difference / (1000 * 3600 * 24);
      const daysInNumber = Math.ceil(remainingDays);

      const amountCollectedValue = item.amountCollected._hex;
      const amountCollectedBigNumber =
        ethers.BigNumber.from(amountCollectedValue);
      const amountCollectedEtherValue = ethers.utils.formatEther(
        amountCollectedBigNumber
      );

      const targetValue = item.target._hex;
      const targetBigNumber = ethers.BigNumber.from(targetValue);
      const targetEtherValue = ethers.utils.formatEther(targetBigNumber);

      return {
        amountCollected: amountCollectedEtherValue,
        deadline: daysInNumber,
        description: item.description,
        donations: item.donations,
        donators: item.donators,
        image: item.image,
        owner: item.owner,
        target: targetEtherValue,
        title: item.title,
      };
    });
    setCampaigns(finalCampaignResp);
    console.log("finalCampaignResp", finalCampaignResp);
  };

  useEffect(() => {
    getAllCampaigns();
  }, [open]);

  const handleSubmitFund = async (index) => {
    if (!fundValue.length) return;
    console.log("[index]", [index]);
    console.log(
      "ethers.utils.parseEther(fundAmount)",
      ethers.utils.parseEther(fundValue)
    );
    try {
      const contract = await getEthProvider();
      console.log("contract", contract);
      const resp = await (
        await contract.donateToCampaign([index], {
          value: ethers.utils.parseEther(fundValue), //we can pass amount directly like this
        })
      ).wait();
      if (resp?.status) {
        getAllCampaigns();
        setFundValue("");
        setFundInputIndex("")
      }
      console.info("contract call successs", resp);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  console.log("fundInputIndex", fundInputIndex);
  return (
    <div>
      <Button disabled={connected} variant="contained" onClick={connect}>
        Connect
      </Button>
      {connected && (
        <Box padding="10px 0">{account && `Connected account: ${account}`}</Box>
      )}
      {connected && (
        <Button onClick={handleOpen} variant="contained">
          Add Campaigns
        </Button>
      )}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        gap="20px"
        padding="20px"
      >
        {!campaigns.length ? (
          <Typography>No Active Campaigns yet</Typography>
        ) : (
          campaigns?.map((item, index) => {
            return (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding="20px"
                flexDirection="column"
                key={item.title + index}
                border="1px solid #ccc"
              >
                <img
                  style={{ objectFit: "cover" }}
                  height="200"
                  width="200"
                  src={item.image}
                  alt="fundImage"
                />
                <Typography>Owner : {item.owner}</Typography>
                <Typography>Title : {item.title}</Typography>
                <Typography>Description : {item.description}</Typography>
                <Typography>Deadline : {item.deadline} days</Typography>
                <Typography>Target : {item.target} ETH</Typography>
                <Typography>
                  Amount Collected : {item.amountCollected} ETH
                </Typography>
                {item?.donators?.length !== 0 && (
                  <Box>
                    <Typography
                      sx={{ textDecoration: "underline" }}
                      textAlign="start"
                    >
                      Donators{" "}
                    </Typography>
                    {item?.donators?.map((it,ind) => {
                      return (
                        <Box key={it}>
                          <Typography>
                            {ind + 1}. {it}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                )}
                {index === fundInputIndex && (
                  <Box display="flex" padding="10px 0" gap="10px">
                    <TextField
                      id="outlined-basic"
                      label="Fund"
                      variant="outlined"
                      value={fundValue}
                      name="name"
                      onChange={(e) => setFundValue(e.target.value)}
                      placeholder="ETH 0.1"
                      type="number"
                    />
                    <Button
                      disabled={!fundValue?.length || fundValue <= 0}
                      variant="outlined"
                      onClick={() => handleSubmitFund(index)}
                    >
                      Pay Fund
                    </Button>
                  </Box>
                )}
                <Button
                  onClick={() => {
                    if (fundInputIndex === 0 || fundInputIndex) {
                      setFundInputIndex("");
                      setFundValue("");
                    } else {
                      setFundInputIndex(index);
                    }
                  }}
                  variant="outlined"
                >
                  {(fundInputIndex === 0 || fundInputIndex) &&
                  fundInputIndex === index
                    ? "Not Interested"
                    : "Participate"}
                </Button>
              </Box>
            );
          })
        )}
      </Box>
      <AddCampaignsModal
        account={account}
        open={open}
        handleClose={handleClose}
        getEthProvider={getEthProvider}
      />
    </div>
  );
};

export default Home;
