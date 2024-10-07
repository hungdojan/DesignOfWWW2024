// import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { GoogleOAuthProvider } from "@react-oauth/google"

ReactDOM.createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId='595472474143-dac5lb3gpst8nkch25buqsm97kamahb3.apps.googleusercontent.com'>
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    </GoogleOAuthProvider>
  )