import React from "react";
import { Route, Switch } from "react-router-dom";

import PrivateRoute from "./Components/Routing/PrivateRoute";
import PublicRoute from "./Components/Routing/PublicRoute";

import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login/Login.jsx";
import LoginPassword from "./Pages/LoginPassword";
import Pay from "./Pages/Pay";
import PaymentInfo from "./Pages/PaymentInfo";
import NotFound from "./Pages/NotFound";
import ApplicationInfo from "./Pages/ApplicationInfo";

// router react component
export default class Routes extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Route
                render={wrapperProps => (
                    <Switch
                        key={wrapperProps.location.key}
                        location={wrapperProps.location}
                    >
                        <PrivateRoute
                            exact
                            path="/"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <Dashboard
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/pay"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <Pay {...props} {...this.props.childProps} />
                            )}
                        />

                        <PrivateRoute
                            path="/payment/:paymentId"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <PaymentInfo
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <Route
                            path="/login"
                            render={props => (
                                <Login {...props} {...this.props.childProps} />
                            )}
                        />

                        <Route
                            path="/application-info"
                            render={props => (
                                <ApplicationInfo {...props} {...this.props.childProps} />
                            )}
                        />

                        <PublicRoute
                            path="/password"
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <LoginPassword {...props} {...this.props.childProps} />
                            )}
                        />

                        <Route
                            render={props => (
                                <NotFound
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />
                    </Switch>
                )}
            />
        );
    }
}
