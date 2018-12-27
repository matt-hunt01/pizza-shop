import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

// dogs  https://nx9zvp49q7.lp.gql.zone/graphql
// todo  https://8v9r9kpn7q.lp.gql.zone/graphql

const client = new ApolloClient({
  uri: "https://core-graphql.dev.waldo.photos/pizza"
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
