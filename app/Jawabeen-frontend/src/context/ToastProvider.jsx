import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  // Show toast
  const showToast = useCallback(
    ({ message, severity = "success", duration = 3000 }) => {
      setToast({ message, severity, duration, open: true });
    },
    []
  );

  // Close toast
  const handleClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Snackbar (Material UI Toast) */}
      <Snackbar
        open={toast?.open || false}
        autoHideDuration={toast?.duration || 3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // position
      >
        <Alert
          onClose={handleClose}
          severity={toast?.severity || "info"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};
