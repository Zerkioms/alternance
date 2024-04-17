import {
  authService,
} from "@univlr-dsi/univlr-dsi-security-oidc-js-vuejs3";
import { WebStorageStateStore } from "oidc-client-ts";
import router from "@/router/index";

const appSettings = {
  auth: {
    // Where the tokens will be stored
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
    // URL to the authentication server (including realm)
    authority: import.meta.env.VITE_APP_AUTH_OIDC_AUTHORITY,
    client_id: import.meta.env.VITE_APP_AUTH_OIDC_CLIENT_ID,
    client_secret: import.meta.env.VITE_APP_AUTH_OIDC_CLIENT_SECRET,
    // Where to redirect the user to after successful authentication
    redirect_uri: import.meta.env.VITE_APP_AUTH_OIDC_REDIRECT_URI,
    // Where to redirect the user to after logging the user out
    post_logout_redirect_uri: import.meta.env.VITE_APP_AUTH_OIDC_POST_LOGOUT,
    // Indicate the the authorization code flow should be used
    response_type: "code",
    // "openid" tells the server that this client uses oidc for authentication
    scope: import.meta.env.VITE_APP_AUTH_OIDC_SCOPE,
    auth_token_name: import.meta.env.VITE_APP_AUTH_TOKEN_NAME,
    // Enable automatic (silent) renewal of the access token
    automaticSilentRenew: true,
    filterProtocolClaims: true,
  },
  api_base_url: import.meta.env.VITE_APP_URL_PROJET_API,
  logLevel: import.meta.env.VITE_APP_LOG_LEVEL?.toUpperCase() || "DEBUG",
};

const authPluginOptions = {
  router: router,
  authSettings: appSettings.auth,
  logLevel: appSettings.logLevel,
  /** Afficher une notification suite au login */
  showLoginSuccess: false,
  /** Afficher une notification suite au logout */
  showLogoutSuccess: false,
};

const apiClientPluginOptions = {
  authService: authService,
  apiBaseUrl: appSettings.api_base_url,
};

export { appSettings, authPluginOptions, apiClientPluginOptions };
