import React from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import './App.css';
import Home from './components/Home';
import New from './components/New';
import Menu from './components/Menu';
import Edit from './components/Edit';

function App() {
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: 'dark',
          primary: {
            main: '#2196f3'
          },
          secondary: {
            main: '#ff1744'
          }
        },
      }),
    [true],
  );
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Menu />
          <Switch>
            <Route path="/edit" component={Edit} />
            <Route path="/home" component={Home} />
            <Route path="/new" component={New} />
            <Redirect to="/home" />

          </Switch>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
