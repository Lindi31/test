import React from "react";
import Tooltip from "react-bootstrap/Tooltip";
import Overlay from "react-bootstrap/Overlay";
import "../pages/miscellaneous/AttenuationCalc.css";

const InfoTooltip: React.FC<{ show: boolean; target: any }> = ({
  show,
  target,
}) => (
  <Overlay target={target} show={show} placement="top">
    {(props) => (
      <Tooltip
        id="info-tooltip"
        {...props}
        className={`custom-tooltip ${show ? "show" : ""}`}
      ></Tooltip>
    )}
  </Overlay>
);

export default InfoTooltip;
