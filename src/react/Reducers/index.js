import { combineReducers } from "redux";

import application from "./application";
import accounts from "./accounts";
import modal from "./modal";
import user from "./user";
import users from "./users";
import registration from "./registration";
import snackbar from "./snackbar";
import theme from "./options";
import main_drawer from "./main_drawer";
import options from "./options";
import options_drawer from "./options_drawer";
import payments from "./payments";
import payment_info from "./payment_info";
import payment_filter from "./payment_filter";

export default combineReducers({
    application,
    accounts,
    modal,
    user,
    users,
    registration,
    snackbar,
    theme,
    main_drawer,
    options,
    options_drawer,
    payment_info,
    payment_filter,
    payment_filter,
    payments
});
