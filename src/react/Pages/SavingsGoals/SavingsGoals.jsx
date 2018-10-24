import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";

import FileUploadIcon from "../../Components/CustomSVG/FileUpload";
import FileDownloadIcon from "../../Components/CustomSVG/FileDownload";
import AddIcon from "@material-ui/icons/Add";

import SavingsGoalListItem from "./SavingsGoalListItem";
import NavLink from "../../Components/Routing/NavLink";
import ExportDialog from "../../Components/ExportDialog";
import ImportDialog from "../../Components/ImportDialog";
import TranslateTypography from "../../Components/TranslationHelpers/Typography";

import { openSnackbar } from "../../Actions/snackbar";
import { setSavingsGoal } from "../../Actions/savings_goals";

const styles = {
    paper: {
        padding: 16
    },
    newRuleButton: {
        width: "100%"
    },
    buttonIcons: {
        marginLeft: 8
    }
};

class SavingsGoals extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            openExportDialog: false,
            openImportDialog: false
        };
    }

    openImportDialog = event => this.setState({ openImportDialog: true });
    closeImportDialog = event => this.setState({ openImportDialog: false });
    openExportDialog = event => this.setState({ openExportDialog: true });
    closeExportDialog = event => this.setState({ openExportDialog: false });

    importData = savingsGoalsReceived => {
        this.closeImportDialog();

        // check if ruleCollection info is an arrray
        // if (
        //     ruleCollectionsReceived &&
        //     typeof ruleCollectionsReceived === "object" &&
        //     ruleCollectionsReceived.constructor === Array
        // ) {
        //     // received object is an array so attempt to loop through them
        //     ruleCollectionsReceived.forEach(ruleCollectionObject => {
        //         // parse a single category rule
        //         this.importSingleRuleCollection(ruleCollectionObject);
        //     });
        // } else if (ruleCollectionsReceived["category-rules"]) {
        //     // parse array inside category-rules key and loop through them
        //     ruleCollectionsReceived["category-rules"].forEach(ruleCollectionObject => {
        //         // parse a single category rule
        //         this.importSingleRuleCollection(ruleCollectionObject);
        //     });
        // } else {
        //     // parse a single category rule
        //     this.importSingleRuleCollection(ruleCollectionsReceived);
        // }
    };
    render() {
        const { t, savingsGoals, accounts } = this.props;

        const savingsGoalsList = Object.keys(savingsGoals).map(savingsGoalId => (
            <SavingsGoalListItem accounts={accounts} savingsGoal={savingsGoals[savingsGoalId]} />
        ));
        const savingsGoalsArray = Object.values(savingsGoals);

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Savings goals")}`}</title>
                </Helmet>

                <ImportDialog
                    title={t("Import savings goal")}
                    showAsNewButton={true}
                    closeModal={this.closeImportDialog}
                    importData={this.importData}
                    open={this.state.openImportDialog}
                />

                <ExportDialog
                    closeModal={this.closeExportDialog}
                    title={t("Export savings goals")}
                    open={this.state.openExportDialog}
                    object={savingsGoalsArray}
                />

                <Grid item xs={12} sm={3}>
                    <Paper style={styles.paper}>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component={NavLink}
                                    to={`/rule-page/null`}
                                    style={styles.newRuleButton}
                                >
                                    {t("New")}
                                    <AddIcon style={styles.buttonIcons} />
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Button variant="outlined" style={styles.newRuleButton} onClick={this.openImportDialog}>
                                    {t("Import")}
                                    <FileDownloadIcon style={styles.buttonIcons} />
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Button variant="outlined" style={styles.newRuleButton} onClick={this.openExportDialog}>
                                    {t("Export")}
                                    <FileUploadIcon style={styles.buttonIcons} />
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={9}>
                    <Grid container spacing={8}>
                        <Grid item xs={12}>
                            <Paper style={styles.paper}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={3} md={6}>
                                        <TranslateTypography variant="h5">Savings goals</TranslateTypography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {savingsGoalsList}
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,

        savingsGoals: state.savings_goals.savings_goals
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        setSavingsGoal: rule_collection => dispatch(setSavingsGoal(rule_collection))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(SavingsGoals));
