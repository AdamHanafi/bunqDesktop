import React from "react";
import { Typography } from "material-ui";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import IconButton from "material-ui/IconButton";
import Input from "material-ui/Input";
import Button from "material-ui/Button";
import Switch from "material-ui/Switch";
import { FormControlLabel } from "material-ui/Form";
import Card, { CardContent } from "material-ui/Card";
import { CircularProgress } from "material-ui/Progress";

import QRSvg from "../../Components/QR/QRSvg";

import { usersUpdate } from "../../Actions/users";
import {
    registrationClearApiKey,
    registrationLoadApiKey,
    registrationSetApiKey,
    registrationSetDeviceName,
    registrationSetEnvironment
} from "../../Actions/registration";
import { userLogin } from "../../Actions/user";
import UserItem from "./UserItem";
import { Redirect } from "react-router-dom";

const styles = {
    loginButton: {
        width: "100%",
        marginTop: 20
    },
    clearButton: {
        width: "100%",
        marginTop: 20
    },
    apiInput: {
        width: "100%",
        marginTop: 20
    },
    environmentToggle: {
        marginTop: 10
    },
    smallAvatar: {
        width: 50,
        height: 50
    }
};

class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            users: [],
            sandboxMode: false,
            apiKey: "",
            apiKeyValid: false,
            deviceName: "My Device",
            deviceNameValid: true,
            attemptingLogin: false,

            requestQrCodeBase64: false,
            requestUuid: false
        };
        this.checkerInterval = null;
    }

    componentDidMount() {
        if (this.props.derivedPassword !== false) {
            this.props.loadApiKey(this.props.derivedPassword);
        }
        if (this.props.apiKey !== false) {
            this.setState({ apiKey: this.props.apiKey });
        }
        if (this.props.deviceName !== false) {
            this.setState({ deviceName: this.props.deviceName });
        }
        this.setState({
            sandboxMode: this.props.environment === "SANDBOX"
        });

        this.checkForSingleUser();
        this.validateInputs(this.props.apiKey, this.props.deviceName);
    }

    componentDidUpdate() {
        this.checkForSingleUser();
    }

    /**
     * Checks if only 1 user type is set and logs in the user if this is the case
     */
    checkForSingleUser = () => {
        const userTypes = Object.keys(this.props.users);
        if (userTypes.length === 1) {
            // only one user we can instantly log in, check requirements again
            if (
                this.props.derivedPassword !== false &&
                this.props.apiKey !== false &&
                this.props.deviceName !== false &&
                this.props.userLoading === false
            ) {
                this.props.loginUser(userTypes[0], true);
            }
        }
    };

    setRegistration = () => {
        if (this.state.apiKey.length !== 64) {
            this.props.openSnackbar(
                "The API key you entered does not look valid"
            );
            return;
        }

        if (this.state.deviceName.length <= 0) {
            this.props.openSnackbar(
                "The device name has to be atleast 1 character."
            );
            return;
        } else if (this.state.deviceName.length > 32) {
            this.props.openSnackbar(
                "The device name can't be longer than 32 characters."
            );
            return;
        }

        if (this.state.deviceNameValid && this.state.apiKeyValid) {
            this.props.setDeviceName(this.state.deviceName);
            this.props.setEnvironment(
                this.state.sandboxMode ? "SANDBOX" : "PRODUCTION"
            );
            this.props.setApiKey(this.state.apiKey, this.props.derivedPassword);
        }
    };

    displayQrCode = () => {
        this.props.BunqJSClient
            .createCredentials()
            .then(({ uuid, status, qr_base64 }) => {
                this.setState({
                    requestQrCodeBase64: qr_base64,
                    requestUuid: uuid
                });

                // start checking if the code was scanned
                this.checkForScanEvent();
            })
            .catch(console.error);
    };

    checkForScanEvent = () => {
        this.checkerInterval = setInterval(() => {
            if (this.state.requestUuid !== false) {
                this.props.BunqJSClient
                    .checkCredentialStatus(this.state.requestUuid)
                    .then(result => {
                        console.log(result);

                        if (result.status === "ACCEPTED") {
                            this.setState(
                                {
                                    apiKey: result.api_key,
                                    requestQrCodeBase64: false,
                                    requestUuid: false
                                },
                                () =>
                                    this.validateInputs(
                                        this.state.apiKey,
                                        this.state.deviceName
                                    )
                            );

                            // reset the check event
                            clearInterval(this.checkerInterval);
                        }
                    })
                    .catch(console.error);
            }
        }, 5000);
    };

    clearApiKey = () => {
        this.props.clearApiKey();
        this.setState({ apiKey: "", apiKeyValid: false });
    };

    handleKeyChange = event => {
        this.setState(
            {
                apiKey: event.target.value
            },
            _ => this.validateInputs(this.state.apiKey, this.state.deviceName)
        );
    };
    handleNameChange = event => {
        this.setState(
            {
                deviceName: event.target.value
            },
            _ => this.validateInputs(this.state.apiKey, this.state.deviceName)
        );
    };
    handleCheckboxChange = (event, checked) => {
        this.setState({ sandboxMode: checked });
    };

    validateInputs = (apiKey, deviceName) => {
        this.setState({
            apiKeyValid: apiKey !== false && apiKey.length === 64,
            deviceNameValid:
                deviceName !== false &&
                deviceName.length >= 1 &&
                deviceName.length <= 32
        });
    };

    render() {
        if (
            this.props.derivedPassword === false &&
            this.props.registrationLoading === false
        ) {
            return <Redirect to="/password" />;
        } else if (
            this.props.derivedPassword !== false &&
            this.props.apiKey !== false &&
            this.props.userType !== false &&
            this.props.registrationLoading === false
        ) {
            // we have the required data and registration is no longer setting up
            return <Redirect to="/" />;
        }

        const { status_message, BunqJSClient, users } = this.props;
        const userItems = Object.keys(users).map(userKey => (
            <UserItem
                BunqJSClient={BunqJSClient}
                user={users[userKey]}
                userKey={userKey}
            />
        ));

        const currentSelectedEnvironmnent = this.state.sandboxMode
            ? "SANDBOX"
            : "PRODUCTION";
        // if apikey is unchanged and environment is unchanged we don't allow user to set apikey
        const unchangedApiKeyEnvironment =
            this.state.apiKey === this.props.apiKey &&
            currentSelectedEnvironmnent === this.props.environment;

        const buttonDisabled =
            unchangedApiKeyEnvironment ||
            // invalid inputs
            this.state.apiKeyValid === false ||
            this.state.deviceNameValid === false ||
            // user info is already being loaded
            this.props.userLoading === true ||
            // registration is loading
            this.props.registrationLoading === true;

        const apiKeyContent =
            this.props.apiKey === false ? (
                <CardContent>
                    <div style={{ textAlign: "center" }}>
                        {this.state.requestQrCodeBase64 === false ? (
                            <IconButton onClick={this.displayQrCode}>
                                <QRSvg />
                            </IconButton>
                        ) : (
                            <img
                                src={`data:image/png;base64, ${this.state
                                    .requestQrCodeBase64}`}
                                style={{ width: 200, height: 200, margin: 16 }}
                            />
                        )}
                    </div>

                    <Input
                        style={styles.apiInput}
                        error={!this.state.apiKeyValid}
                        placeholder="API Key"
                        label="API Key"
                        hint="Your personal API key"
                        onChange={this.handleKeyChange}
                        value={this.state.apiKey}
                        disabled={
                            // unchanged api key
                            this.state.apiKey === this.props.apiKey
                        }
                        onKeyPress={ev => {
                            if (
                                ev.key === "Enter" &&
                                buttonDisabled === false
                            ) {
                                this.setRegistration();
                                ev.preventDefault();
                            }
                        }}
                    />
                    <Input
                        style={styles.apiInput}
                        error={!this.state.deviceNameValid}
                        placeholder="Device Name"
                        label="Device Name"
                        hint="Device name so you can recognize it later"
                        onChange={this.handleNameChange}
                        value={this.state.deviceName}
                        disabled={
                            // unchanged api key
                            this.state.apiKey === this.props.apiKey
                        }
                        onKeyPress={ev => {
                            if (
                                ev.key === "Enter" &&
                                buttonDisabled === false
                            ) {
                                this.setRegistration();
                                ev.preventDefault();
                            }
                        }}
                    />
                    <FormControlLabel
                        style={styles.environmentToggle}
                        label="Enable sandbox mode?"
                        control={
                            <Switch
                                checked={this.state.sandboxMode}
                                onChange={this.handleCheckboxChange}
                                aria-label="enable or disable sandbox mode"
                            />
                        }
                    />

                    <Button
                        variant="raised"
                        disabled={buttonDisabled}
                        color={"primary"}
                        style={styles.loginButton}
                        onClick={this.setRegistration}
                    >
                        Set API Key
                    </Button>
                </CardContent>
            ) : (
                <CardContent>
                    <Typography variant="headline" component="h2">
                        You're logged in!
                    </Typography>
                    {/*<Typography variant="caption">*/}
                    {/*Click one of the accounts in the list to get started or*/}
                    {/*logout to change the key or environment.*/}
                    {/*</Typography>*/}
                    <Button
                        variant="raised"
                        color={"secondary"}
                        style={styles.clearButton}
                        onClick={this.clearApiKey}
                        disabled={this.props.userLoading}
                    >
                        Logout
                    </Button>
                </CardContent>
            );

        const cardContent = this.props.registrationLoading ? (
            <CardContent style={{ textAlign: "center" }}>
                <Typography variant="headline" component="h2">
                    Loading
                </Typography>
                <CircularProgress size={50} />
                <Typography variant="subheading">{status_message}</Typography>
            </CardContent>
        ) : (
            apiKeyContent
        );

        return (
            <Grid container spacing={16} justify={"center"}>
                <Helmet>
                    <title>{`BunqDesktop - Login`}</title>
                </Helmet>

                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <Card>{cardContent}</Card>
                </Grid>
                <Grid item xs={12} />

                {userItems}
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        status_message: state.application.status_message,

        derivedPassword: state.registration.derivedPassword,
        registrationLoading: state.registration.loading,
        environment: state.registration.environment,
        deviceName: state.registration.device_name,
        apiKey: state.registration.api_key,

        users: state.users.users,
        user: state.user.user,
        userType: state.user.user_type,
        userLoading: state.user.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        // clear api key from bunqjsclient and bunqdesktop
        clearApiKey: () => dispatch(registrationClearApiKey(BunqJSClient)),
        // set the api key and stores the encrypted version
        setApiKey: (api_key, derivedPassword) =>
            dispatch(registrationSetApiKey(api_key, derivedPassword)),
        // attempt to load the api key with our password if one is stored
        loadApiKey: derivedPassword =>
            dispatch(registrationLoadApiKey(derivedPassword)),

        setEnvironment: environment =>
            dispatch(registrationSetEnvironment(environment)),
        setDeviceName: device_name =>
            dispatch(registrationSetDeviceName(device_name)),

        // login a given usertype
        loginUser: (type, updated = false) =>
            dispatch(userLogin(BunqJSClient, type, updated)),

        // get latest user list from BunqJSClient
        usersUpdate: (updated = false) =>
            dispatch(usersUpdate(BunqJSClient, updated))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
