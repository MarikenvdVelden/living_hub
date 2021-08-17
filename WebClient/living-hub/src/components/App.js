import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Divider, Container } from "semantic-ui-react";
import history from "../history";

import LoginPage from "./LoginPage";
import AuthRoute from "./AuthRoute";
import HeaderMenu from "./HeaderMenu";
import QueryPage from "./QueryPage";
import EditRecords from "./EditRecords";

// Change to add new components to the header
// The first item will be the opening page after login
const items = [
  { label: "Search", path: "/home", Component: QueryPage },
  {
    label: "Edit/Delete Records",
    path: "/edit",
    position: "right",
    Component: EditRecords,
  },
  {
    label: "Manage Users/Access",
    path: "#",
    position: "right",
    Component: "",
  },
  {
    label: "Login/Logout",
    path: "/login",
    position: "right",
    Component: LoginPage,
  },
];

const App = () => {
  const createNavigation = (items) => {
    return items.map((item) => {
      return (
        <AuthRoute
          key={item.path}
          path={item.path}
          Component={item.Component}
        />
      );
    });
  };

  return (
    <Router history={history}>
      {/* rendering the headerMenu items */}
      <HeaderMenu items={items} />
      <Divider />
      <Container style={{ marginTop: "4em" }}>
        <Switch>
          <Route exact path="/" render={() => <LoginPage items={items} />} />
          {createNavigation(items)}
          <QueryPage />
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
