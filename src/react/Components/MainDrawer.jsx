import React from "react";
import { connect } from "react-redux";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import Drawer from "material-ui/Drawer";
import List, { ListItem, ListItemText, ListItemIcon } from "material-ui/List";
import Hidden from "material-ui/Hidden";
import Typography from "material-ui/Typography";
import Avatar from "material-ui/Avatar";
import PowerSettingsIcon from "material-ui-icons/PowerSettingsNew";
import ArrowUpwardIcon from "material-ui-icons/ArrowUpward";
import ArrowDownwardIcon from "material-ui-icons/ArrowDownward";
import HomeIcon from "material-ui-icons/Home";
import SettingsIcon from "material-ui-icons/Settings";
import ShareIcon from "material-ui-icons/Share";

import NavLink from "./Routing/NavLink";
import { closeMainDrawer } from "../Actions/main_drawer";
import { openOptionsDrawer } from "../Actions/options_drawer";

const styles = {
    list: {
        width: 250,
        paddingBottom: 50,
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        WebkitAppRegion: "no-drag"
    },
    listItem: {
        paddingTop: 0,
        paddingBottom: 0
    },
    listFiller: {
        flex: "1 1 100%"
    },
    listBottomItem: {
        flex: 0
    },
    avatar: {
        width: 50,
        height: 50
    },
    bunqLink: {
        marginBottom: 20,
        color: "inherit",
        textDecoration: "none"
    }
};

class MainDrawer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    closeApp() {
        window.close();
    }

    openOptions = () => {
        // open the options drawer and open the main drawer
        this.props.closeMainDrawer();
        this.props.openOptionsDrawer();
    };

    render() {
        const {
            classes,
            theme,
            open,
            userType,
            derivedPassword,
            apiKey
        } = this.props;

        // if true, disable certain items in the menu
        const disableNavigationItems =
            userType === false || derivedPassword === false || apiKey === false;
        const navigationItems = disableNavigationItems
            ? null
            : [
                  <ListItem
                      button
                      style={styles.listBottomItem}
                      component={NavLink}
                      to="/"
                  >
                      <ListItemIcon>
                          <HomeIcon />
                      </ListItemIcon>
                      <Typography type="subheading">Dashboard</Typography>
                  </ListItem>,
                  <ListItem
                      button
                      style={styles.listBottomItem}
                      component={NavLink}
                      to="/pay"
                  >
                      <ListItemIcon>
                          <ArrowUpwardIcon />
                      </ListItemIcon>
                      <Typography type="subheading">Pay</Typography>
                  </ListItem>,
                  <ListItem
                      button
                      style={styles.listBottomItem}
                      component={NavLink}
                      to="/request"
                  >
                      <ListItemIcon>
                          <ArrowDownwardIcon />
                      </ListItemIcon>
                      <Typography type="subheading">Request</Typography>
                  </ListItem>,
                  <ListItem
                      button
                      style={styles.listBottomItem}
                      component={NavLink}
                      to="/bunqme-tab"
                  >
                      <ListItemIcon>
                          <ShareIcon />
                      </ListItemIcon>
                      <Typography type="subheading">Bunq.me Requests</Typography>
                  </ListItem>
              ];

        const drawerList = (
            <List style={styles.list}>
                <NavLink to="/application-info" style={styles.bunqLink}>
                    <ListItem button>
                        <ListItemIcon>
                            <Avatar
                                style={styles.avatar}
                                src="./images/512x512.png"
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary="BunqDesktop"
                            secondary={`Version ${process.env.CURRENT_VERSION}`}
                        />
                    </ListItem>
                </NavLink>

                {navigationItems}

                <ListItem style={styles.listFiller} />

                <ListItem
                    button
                    style={styles.listBottomItem}
                    onClick={this.openOptions}
                >
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <Typography type="subheading">Settings</Typography>
                </ListItem>

                <ListItem
                    button
                    style={styles.listBottomItem}
                    onClick={this.closeApp}
                >
                    <ListItemIcon>
                        <PowerSettingsIcon />
                    </ListItemIcon>
                    <Typography type="subheading">Quit BunqDesktop</Typography>
                </ListItem>
            </List>
        );

        return [
            <Hidden mdUp>
                <Drawer
                    type="temporary"
                    open={open}
                    onRequestClose={this.props.closeDrawer}
                    className="options-drawer"
                    anchor={theme.direction === "rtl" ? "right" : "left"}
                    SlideProps={{
                        style: { top: 50 }
                    }}
                >
                    {drawerList}
                </Drawer>
            </Hidden>,
            <Hidden mdDown implementation="css">
                <Drawer
                    type="permanent"
                    open={open}
                    onRequestClose={this.props.closeDrawer}
                    anchor="left"
                    className="options-drawer"
                    classes={{
                        paper: classes.drawerPaper
                    }}
                >
                    {drawerList}
                </Drawer>
            </Hidden>
        ];
    }
}

const mapStateToProps = state => {
    return {
        open: state.main_drawer.open,

        // used to determine if we need to disable certain items in the menu
        derivedPassword: state.registration.derivedPassword,
        apiKey: state.registration.api_key,
        userType: state.user.user_type
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closeDrawer: () => dispatch(closeMainDrawer()),
        openOptionsDrawer: () => dispatch(openOptionsDrawer()),
        closeMainDrawer: () => dispatch(closeMainDrawer())
    };
};

MainDrawer.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(
    connect(mapStateToProps, mapDispatchToProps)(MainDrawer)
);
