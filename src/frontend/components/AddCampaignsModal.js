import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { ethers } from "ethers";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: "15px",
};

const AddCampaignsModal = ({ open, handleClose, getEthProvider, account }) => {
  const [inputValues, setInputValues] = useState({
    name: "",
    title: "",
    story: "",
    goal: "",
    date: "",
    image: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputValues((last) => ({
      ...last,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("inputValues", inputValues);
      const contractInfo = await getEthProvider();
      console.log("contractInfo", contractInfo);
      console.log(
        "Values : ",
        account,
        inputValues.title,
        inputValues.story,
        ethers.utils.parseUnits(inputValues.goal, 18),    //send goal in ethers to blockchain
        new Date(inputValues.date).getTime(),            //send goal in ethers to blockchain
        inputValues.image                                 //send image url 
      );
      const resp = await contractInfo.createCampaign(
        account,
        inputValues.title,
        inputValues.story,
        ethers.utils.parseUnits(inputValues.goal, 18),
        new Date(inputValues.date).getTime(),
        inputValues.image
      );
      console.log("resp", resp);
      const finalResp = await resp.wait();
      console.log("finalResp", finalResp);
      if (finalResp?.blockHash) {
        setInputValues({
          name: "",
          title: "",
          story: "",
          goal: "",
          date: "",
          image: "",
        });
        handleClose();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCancel = () => {
    handleClose();
    setInputValues({
      name: "",
      title: "",
      story: "",
      goal: "",
      date: "",
      image: "",
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h5">Add Campaign</Typography>
        <form
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            id="outlined-basic"
            label="Your Name"
            variant="outlined"
            value={inputValues.name}
            name="name"
            onChange={handleChange}
            placeholder="Your Name"
            type="text"
          />
          <TextField
            id="outlined-basic"
            label="Campaign Title"
            variant="outlined"
            value={inputValues.title}
            name="title"
            onChange={handleChange}
            placeholder="Campaign Title"
            type="text"
          />
          <TextField
            id="outlined-basic"
            label="Story"
            variant="outlined"
            value={inputValues.story}
            name="story"
            onChange={handleChange}
            placeholder="Story"
            type="text"
          />
          <TextField
            id="outlined-basic"
            label="Goal"
            variant="outlined"
            value={inputValues.goal}
            name="goal"
            onChange={handleChange}
            placeholder="Goal"
            type="number"
          />
          <TextField
            id="outlined-basic"
            label="End Date"
            variant="outlined"
            value={inputValues.date}
            name="date"
            onChange={handleChange}
            placeholder="End Date"
            type="date"
          />
          <TextField
            id="outlined-basic"
            label="Image URL"
            variant="outlined"
            value={inputValues.image}
            name="image"
            onChange={handleChange}
            placeholder="Place image URL of your campaign"
            type="url"
          />
          <Box display="flex" justifyContent="end" gap="10px">
            <Button
              onClick={handleCancel}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddCampaignsModal;
