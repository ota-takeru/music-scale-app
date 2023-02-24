import React from "react";
import styled from "styled-components";

const Contaienr = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 70px;
  padding: 0 auto;
  justify-content: center;
  // justify-content: ${(props) => (props.form = true ? "left" : "center")};
`;
const SubContainer = ({ children, props }) => {
  // console.log(props.form);
  return <Contaienr>{children}</Contaienr>;
};

export default SubContainer;
