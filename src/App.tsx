import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { StoreContext, rootStore } from './stores';
import AppRouter from './router/AppRouter';
import './styles/global.scss';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <StoreContext.Provider value={rootStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
    </StoreContext.Provider>
  );
}

export default App;
