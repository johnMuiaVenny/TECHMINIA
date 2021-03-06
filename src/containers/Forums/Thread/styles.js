import styled from "styled-components";

export const Section = styled.section`
  margin: 3em auto;

  &:first-child {
    margin-top: 0;
  }
`;

export const CenteredSection = styled(Section)`
  text-align: center;
`;

export const SectionSheet = styled.section`
  position: relative;
  width: 80%;
  max-width: 80%;
  margin-top: 20px;
  border-radius: 20px;
  padding: 30px 60px;
  height: 80%;
  background-color: white;
  box-shadow: 0 0 5px #d8d8d8;
  margin-bottom: 20px;
  height: auto;
  @media (min-width: 1200px) {
    width: 80% !important;
    max-width: 80% !important;
  }
`;

export const AtPrefix = styled.span`
  color: black;
  margin-left: 0.4em;
`;
