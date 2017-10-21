import React from "react";
import ReactDOM from "react-dom";
import store from "store";
import BunqJSClient from "@bunq-community/bunq-js-client";
import App from "./App";
import { generateGUID } from './Helpers/Utils';

import analytics from 'universal-analytics'

require("../scss/main.scss");

let userGUID = store.get('user-guid');

if (!userGUID) {
    userGUID = generateGUID();
    store.set('user-guid', userGUID);
}

// create a new bunq js client and inject into the app
const BunqJSClientInstance = new BunqJSClient(store);
const analyticsInstance = analytics('UA-87358128-5',  userGUID);

ReactDOM.render(
    <App analytics={analyticsInstance} BunqJSClient={BunqJSClientInstance} />,
    document.getElementById("app")
);
