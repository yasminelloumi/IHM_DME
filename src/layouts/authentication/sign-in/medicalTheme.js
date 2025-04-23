export const medicalTheme = {
  palette: {
    primary: {
      main: '#0288d1',
      light: '#5eb8ff',
      dark: '#005b9f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00796b',
      light: '#48a999',
      dark: '#004c40',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f9ff',
      paper: '#ffffff',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ffa000',
    },
    success: {
      main: '#388e3c',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      background: 'linear-gradient(135deg, #0288d1 0%, #0288d1 0%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'rgba(227, 242, 253, 0.3)',
            '&.Mui-focused': {
              backgroundColor: 'rgba(227, 242, 253, 0.5)',
            },
            '& .MuiInputAdornment-root': {
              color: '#0288d1',
            },
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            color: '#f5f5f5',
            '&.Mui-checked': {
              color: '#0288d1',
            },
            '&.Mui-checked + .MuiSwitch-track': {
              backgroundColor: 'rgba(2, 136, 209, 0.5)',
            },
          },
          '& .MuiSwitch-track': {
            backgroundColor: '#e0e0e0',
            opacity: 1,
            borderRadius: 20,
          },
        },
      },
    },
  }
};

export const signInStyles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
  },
  formContainer: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(2, 136, 209, 0.15)',
    overflow: 'hidden',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    padding: '2rem 2rem 1rem',
    textAlign: 'center',
  },
  toggleContainer: {
    display: 'flex',
    margin: '0 2rem',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    backgroundColor: 'rgba(2, 136, 209, 0.08)',
  },
  toggleButton: (active) => ({
    flex: 1,
    padding: '12px',
    backgroundColor: active ? 'transparent' : 'transparent',
    color: 'white',
    fontWeight: active ? 600 : 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: active ? 'linear-gradient(135deg, #0288d1 0%, #0288d1 0%)' : 'transparent',
    '&:hover': {
      background: active ? 'linear-gradient(135deg, #0277bd 0%, #0288d1 0%)' : 'rgba(255, 255, 255, 0.1)',
    },
  }),
  formContent: {
    padding: '2rem',
  },
  inputField: {
    marginBottom: '1.5rem',
    '& .MuiInputBase-root': {
      paddingLeft: '8px',
    },
    '& .MuiInputAdornment-root': {
      marginRight: '8px',
    },
  },
  rememberMe: {
    display: 'flex',
    alignItems: 'center',
    margin: '1.5rem 0',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: 'rgba(240, 245, 255, 0.5)',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    fontWeight: 600,
    marginTop: '1rem',
    background: 'linear-gradient(135deg, #0288d1 0%, #0288d1)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(135deg, #0277bd 0%,  #0277bd 0%)',
    },
    '&:disabled': {
      background: '#e0e0e0',
      color: '#9e9e9e'
    },
  },
  footer: {
    padding: '1.5rem 2rem',
    textAlign: 'center',
    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  },
  footerLink: {
    color: '#0288d1',
    fontWeight: 600,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  icon: {
    primary: {
      color: '#0288d1',
      fontSize: '1.5rem',
    },
    secondary: {
      color: '#0288d1',
      fontSize: '1.5rem',
    },
  }
};