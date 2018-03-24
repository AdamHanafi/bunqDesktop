import React from "react";
import { connect } from "react-redux";
import Countdown from "react-countdown-now";

import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import Divider from "material-ui/Divider";
import List, { ListItem, ListSubheader, ListItemText } from "material-ui/List";
import Typography from "material-ui/Typography";
import { CircularProgress } from "material-ui/Progress";

import CardListItem from "./CardListItem";
import AccountListItem from "../../Components/AccountList/AccountListItem";

import { cardUpdate } from "../../Actions/card";
import {
    cardUpdateCvc2Codes,
    cardCvc2CodesClear
} from "../../Actions/card_cvc2";

const styles = {
    gridContainer: {
        height: "calc(100vh - 50px)",
        overflow: "hidden"
    },
    cardInfoContainer: {
        marginTop: "calc(6vh + 20px)"
    },
    cardInfoPaper: {
        padding: 12,
        marginTop: 20,
        height: 370
    },
    loadCvcbutton: {
        width: "100%"
    }
};

class Card extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedCardIndex: 0,
            carouselStyle: {
                transform: "translateY(0px)"
            }
        };
    }

    componentDidMount() {
        this.props.cardUpdate(this.props.user.id);
    }

    cardUpdateCvc2Codes = event => {
        const cardInfo = this.props.cards[this.state.selectedCardIndex];
        this.props.cardUpdateCvc2Codes(
            this.props.user.id,
            cardInfo.CardDebit.id
        );
    };

    handleCardClick = index => {
        this.setState({ selectedCardIndex: index });
    };

    countDownRenderer = ({ total, days, hours, minutes, seconds }) => {
        return `Expires in: ${minutes}:${seconds}`;
    };

    render() {
        let filteredCards = [];
        let cards = [];
        if (this.props.cards !== false) {
            // first filter the cards
            filteredCards = this.props.cards.filter(card => {
                return !(card.CardDebit && card.CardDebit.status !== "ACTIVE");
            });
            // then generate the items seperately
            cards = filteredCards.map((card, index) => (
                <CardListItem
                    BunqJSClient={this.props.BunqJSClient}
                    card={card.CardDebit}
                    onClick={this.handleCardClick.bind(this, index)}
                />
            ));
        }

        if (this.props.cardsLoading) {
            return (
                <Grid
                    container
                    spacing={24}
                    style={styles.gridContainer}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <CircularProgress size={75} />
                        <Typography
                            variant="display1"
                            style={{ textAlign: "center" }}
                        >
                            Loading cards...
                        </Typography>
                    </Grid>
                </Grid>
            );
        }

        if (cards.length === 0) {
            return (
                <Grid
                    container
                    spacing={24}
                    style={styles.gridContainer}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12}>
                        <Typography
                            variant="display1"
                            style={{ textAlign: "center" }}
                        >
                            You don't have any cards
                        </Typography>
                    </Grid>
                </Grid>
            );
        }

        const cardInfo = filteredCards[this.state.selectedCardIndex]
            .CardDebit;
        const translateOffset = this.state.selectedCardIndex * 410;
        const carouselTranslate = "translateY(-" + translateOffset + "px)";

        // account connected to the currently selected card
        const connectedAccounts = cardInfo.pin_code_assignment.map(
            assignment => {
                // try to find the connected accoutn by ID
                const currentAccount = this.props.accounts.find(
                    account => account.id == assignment.monetary_account_id
                );

                let connectedText = "";
                switch (assignment.type) {
                    case "PRIMARY":
                        connectedText = "Primary card";
                        break;
                    case "SECONDARY":
                        connectedText = "Secondary card";
                        break;
                }

                // return the accout item for this account
                return (
                    <React.Fragment>
                        <ListSubheader style={{ height: 28 }}>
                            {connectedText}
                        </ListSubheader>
                        {!currentAccount ? (
                            <ListItem divider>
                                <ListItemText
                                    primary="No account found for this card"
                                    secondary="This likely means this card is connected to a Joint account"
                                />
                            </ListItem>
                        ) : (
                            <AccountListItem
                                BunqJSClient={this.props.BunqJSClient}
                                clickable={false}
                                account={currentAccount}
                            />
                        )}
                    </React.Fragment>
                );
            }
        );
        // cvcLoading: state.card_cvc2.loading,
        // cvcCardId: state.card_cvc2.card_id,
        // cvcUserId: state.card_cvc2.user_id,
        // cvc2Codes: state.card_cvc2.cvc2_codes

        let displayCvcInfo = null;
        if (cardInfo.type === "MASTERCARD") {
            // if id is different but not null we don't show the cvc list
            const idsSet =
                this.props.cvcCardId === cardInfo.id &&
                this.props.cvcCardId !== null;

            let cvc2CodeList = null;
            if (idsSet) {
                cvc2CodeList =
                    this.props.cvc2Codes.length > 0 ? (
                        <List>
                            {this.props.cvc2Codes.map(cvc2_code => {
                                const timeMs =
                                    cvc2_code.expiry_time.getTime() + 3600000;
                                return (
                                    <ListItem>
                                        <ListItemText
                                            primary={`CVC: ${cvc2_code.cvc2}`}
                                            secondary={
                                                <Countdown
                                                    date={timeMs}
                                                    onComplete={
                                                        this.props
                                                            .cardCvc2CodesClear
                                                    }
                                                    renderer={
                                                        this.countDownRenderer
                                                    }
                                                />
                                            }
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    ) : (
                        <Typography
                            variant="body2"
                            style={{ textAlign: "center" }}
                        >
                            No CVC codes available
                        </Typography>
                    );
            }

            displayCvcInfo = (
                <React.Fragment>
                    {cvc2CodeList}
                    <Button
                        style={styles.loadCvcbutton}
                        onClick={this.cardUpdateCvc2Codes}
                        disabled={this.props.cvcLoading}
                    >
                        {cvc2CodeList !== null ? (
                            "Update CVC Codes"
                        ) : (
                            "View CVC Codes"
                        )}
                    </Button>
                </React.Fragment>
            );
        }

        return (
            <Grid container spacing={24} style={styles.gridContainer}>
                <Grid item xs={6}>
                    <ul
                        className="carousel"
                        style={{ transform: carouselTranslate }}
                    >
                        {cards}
                    </ul>
                </Grid>
                <Grid item xs={6}>
                    <Grid
                        container
                        spacing={24}
                        alignItems={"center"}
                        style={styles.cardInfoContainer}
                    >
                        <Grid item xs={12}>
                            <Paper style={styles.cardInfoPaper}>
                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant={"title"}>
                                            {cardInfo.name_on_card}
                                        </Typography>
                                        <Typography variant={"subheading"}>
                                            {cardInfo.second_line}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography
                                            variant={"body2"}
                                            style={{ textAlign: "right" }}
                                        >
                                            Expires: <br />
                                            {cardInfo.expiry_date}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <br />
                                <List dense>
                                    <Divider />
                                    {connectedAccounts}
                                </List>

                                {displayCvcInfo}
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        accounts: state.accounts.accounts,
        cards: state.cards.cards,
        cardsLoading: state.cards.loading,

        cvcLoading: state.card_cvc2.loading,
        cvcCardId: state.card_cvc2.card_id,
        cvcUserId: state.card_cvc2.user_id,
        cvc2Codes: state.card_cvc2.cvc2_codes
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        cardUpdate: userId => dispatch(cardUpdate(BunqJSClient, userId)),
        // list all cvc2 codes
        cardUpdateCvc2Codes: (userId, cardId) =>
            dispatch(cardUpdateCvc2Codes(BunqJSClient, userId, cardId)),
        cardCvc2CodesClear: () => dispatch(cardCvc2CodesClear())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
