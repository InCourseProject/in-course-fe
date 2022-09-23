import React from "react";
import styled from "@emotion/react";
import { useNavigate } from "react-router-dom";


const Post = () => {
  const navigate = useNavigate();
    return (
      <div>
        Post 입니다.
        {/* 이동이 편하게끔 달아놓은 버튼입니다! */}
        <button onClick={() => navigate("login")}>로그인하기</button>
      </div> 
    );
};

export default Post;