import React from "react";
import { _getPost } from '../../redux/modules/formSlice'
import styled from "@emotion/styled";
import HomeComponent from "./components/HomeComponent";
import HeaderBar from "../../components/layout/HeaderBar";
import NaviBar from "../../components/layout/NaviBar";
const Home = () => {

  return (
    <>
      <HeaderBar />
      <HomeComponent />
      <NaviBar />
    </>
  );
};

export default Home;

const StWrap = styled.div`
  width: 100%;
`