import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import config from '../config.json';

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = `${config.auth.domain}`;
  const clientId = `${config.auth.clientID}`;
  const clientAddress = `${config.network.client.protocol}://${config.network.client.domain}:${config.network.client.port}`;

  const history = useHistory();

  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || clientAddress);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;