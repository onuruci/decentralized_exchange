import React from "react";
import { useState } from "react";

import Header from "./components/Header";
import logoImg from "./common/dex_logo.png";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Intruduction from "./components/IntoductionDex";
import Faucet from "./components/Faucet";
import Swap from "./components/Swap";
import Liquidity from "./components/Liquidity";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function App() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <div>
      <Header logoImg={logoImg} />
      <div
        style={{ maxWidth: "750px", marginLeft: "auto", marginRight: "auto" }}
      >
        <Box sx={{ width: "100%", marginLeft: "auto" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              aria-label="basic tabs example"
              indicatorColor="secondary"
              sx={{
                marginRight: "auto",
                alignContent: "center",
              }}
              centered
            >
              <Tab label="Intro" {...a11yProps(0)} />
              <Tab label="Faucet" {...a11yProps(1)} />
              <Tab label="Swap" {...a11yProps(2)} />
              <Tab label="Menage Liquidity" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Intruduction />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Faucet />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Swap />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Liquidity />
          </TabPanel>
        </Box>
      </div>
    </div>
  );
}

export default App;
