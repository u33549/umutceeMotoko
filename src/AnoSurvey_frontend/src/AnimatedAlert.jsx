import React, { useState, useEffect } from "react";
import { Alert, AlertTitle, Slide } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import zIndex from "@mui/material/styles/zIndex";

const iconMapping = {
  success: <CheckCircleIcon fontSize="inherit" />,
  error: <ErrorIcon fontSize="inherit" />,
  info: <InfoIcon fontSize="inherit" />,
  warning: <WarningIcon fontSize="inherit" />,
};

const AnimatedAlert = ({ severity, text, trigger }) => {
  const [show, setShow] = useState(false);
  const [alertProps, setAlertProps] = useState({ severity: "", text: "" });

  useEffect(() => {
    if (trigger) {
      if (show) {
        setShow(false);
        setTimeout(() => {
          setAlertProps({ severity, text });
          setShow(true);
        }, 500); // Mevcut alertin kapanması için kısa bir gecikme
      } else {
        setAlertProps({ severity, text });
        setShow(true);
      }
    }
  }, [trigger, severity, text]);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <Slide direction="down" in={show} mountOnEnter unmountOnExitd  >
      <Alert severity={alertProps.severity} icon={iconMapping[alertProps.severity]} variant="filled" sx={{zIndex:1000, position: "fixed", top: "3rem", width: "50%",left:"25%" }}>
        <AlertTitle>{alertProps.severity.charAt(0).toUpperCase() + alertProps.severity.slice(1)}</AlertTitle>
        {alertProps.text}
      </Alert>
    </Slide>
  );
};

export default AnimatedAlert;