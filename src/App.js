import React from "react";
import { Provider as StoreProvider } from "react-redux";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";

import Home from "./components/Home";
import Hall from "./components/Hall";
import Context, { Provider as ContextProvider } from "./Context";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";

import store from "./store";

const App = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default () => {
  return (
    <App>
      <ThemeProvider theme={theme}>
        <StoreProvider store={store}>
          <Router>
            <Switch>
              <Route path="/halls/:id">
                <ContextProvider value={Context}>
                  <Hall />
                </ContextProvider>
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </Router>
        </StoreProvider>
      </ThemeProvider>
    </App>
  );
};
