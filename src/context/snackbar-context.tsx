import React, { useState, useTransition, useLayoutEffect, createContext, useContext, useRef } from 'react';
import { Snackbar } from '@mui/material';

interface SnackbarContextType {
  showMessage: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [showing, startTransition] = useTransition();

  const showMessage = (message: string) => {
    startTransition(() => {
      setToasts(message); // Update state asynchronously
      setSnackbarOpen(true);
    });
  };

  const handleToastClose = () => {
    startTransition(() => {
      setSnackbarOpen(false);
      setToasts(null); // Update state asynchronously
    });
  };

  useLayoutEffect(() => {
    const snackbarElement = document.querySelector('.MuiSnackbar-root') as HTMLElement;
    if (snackbarElement) {
      snackbarElement.style.bottom = '30px'; 
      snackbarElement.style.left = '300px'; 
    }
  }, [toasts]);

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={10000}
          onClose={() => handleToastClose()}
          message={toasts}
        />
    </SnackbarContext.Provider>
  );
};






// import React, { createContext, useState, useContext } from 'react';
// import { Snackbar } from '@mui/material';

// interface SnackbarContextType {
//   showMessage: (message: string) => void;
// }

// const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

// export const useSnackbar = () => {
//   const context = useContext(SnackbarContext);
//   if (!context) {
//     throw new Error('useSnackbar must be used within a SnackbarProvider');
//   }
//   return context;
// };

// export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
//   const [snackbarMessage, setSnackbarMessage] = useState<string>('');

//   const showMessage = (message: string) => {
//     setSnackbarMessage(message);
//     setSnackbarOpen(true);
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   return (
//     <SnackbarContext.Provider value={{ showMessage }}>
//       {children}
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={handleSnackbarClose}
//         message={snackbarMessage}
//       />
//     </SnackbarContext.Provider>
//   );
// };
