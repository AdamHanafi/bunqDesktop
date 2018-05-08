import React from "react";
import DateTimePicker from "material-ui-pickers/DateTimePicker/index.js";

import Select from "material-ui/Select";
import Grid from "material-ui/Grid";
import Input from "material-ui/Input";
import TextField from "material-ui/TextField";
import Collapse from "material-ui/transitions/Collapse";
import { FormControl } from "material-ui/Form";
import { ListItem, ListItemText } from "material-ui/List";

import TranslateMenuItem from "../../Components/TranslationHelpers/MenuItem";
import scheduleTexts from "../../Helpers/ScheduleTexts";

const styles = {
    textField: {
        width: "100%"
    },
    formControl: {
        width: "100%"
    }
};

export default props => {
    const {
        t,
        schedulePayment,
        recurrenceUnit,
        recurrenceSize,
        scheduleEndDate,
        scheduleStartDate,

        handleChangeDirect,
        handleChange
    } = props;

    let scheduledPaymentText = null;
    if (schedulePayment) {
        const scheduleTextResult = scheduleTexts(
            t,
            scheduleStartDate,
            scheduleEndDate,
            recurrenceSize,
            recurrenceUnit
        );

        scheduledPaymentText = (
            <ListItem>
                <ListItemText
                    primary={scheduleTextResult.primary}
                    secondary={scheduleTextResult.secondary}
                />
            </ListItem>
        );
    }

    return (
        <Grid item xs={12}>
            <Collapse in={schedulePayment}>
                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        <DateTimePicker
                            helperText={t("Start date")}
                            format="MMMM DD, YYYY HH:mm"
                            disablePast
                            style={styles.textField}
                            value={scheduleStartDate}
                            onChange={handleChangeDirect("scheduleStartDate")}
                            ampm={false}
                            cancelLabel={t("Cancel")}
                            clearLabel={t("Clear")}
                            okLabel={t("Ok")}
                            todayLabel={t("Today")}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <DateTimePicker
                            helperText={t("End date")}
                            emptyLabel={t("No end date")}
                            format="MMMM DD, YYYY HH:mm"
                            style={styles.textField}
                            value={scheduleEndDate}
                            onChange={date => {
                                // reset to current time if
                                if (date > scheduleStartDate) {
                                    handleChangeDirect("scheduleEndDate")(date);
                                } else {
                                    handleChangeDirect("scheduleEndDate")(
                                        scheduleStartDate
                                    );
                                }
                            }}
                            clearable={true}
                            ampm={false}
                            cancelLabel={t("Cancel")}
                            clearLabel={t("Clear")}
                            okLabel={t("Ok")}
                            todayLabel={t("Today")}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            style={styles.textField}
                            value={recurrenceSize}
                            disabled={recurrenceUnit === "ONCE"}
                            onChange={handleChange("recurrenceSize")}
                            helperText={"Repeat every"}
                            type={"number"}
                            inputProps={{
                                min: 0,
                                step: 1
                            }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl style={styles.formControl}>
                            <Select
                                style={styles.textField}
                                value={recurrenceUnit}
                                input={<Input name="field" id="field-helper" />}
                                onChange={handleChange("recurrenceUnit")}
                            >
                                <TranslateMenuItem value={"ONCE"}>
                                    Once
                                </TranslateMenuItem>
                                <TranslateMenuItem value={"HOURLY"}>
                                    Hours
                                </TranslateMenuItem>
                                <TranslateMenuItem value={"DAILY"}>
                                    Days
                                </TranslateMenuItem>
                                <TranslateMenuItem value={"WEEKLY"}>
                                    Weeks
                                </TranslateMenuItem>
                                <TranslateMenuItem value={"MONTHLY"}>
                                    Months
                                </TranslateMenuItem>
                                <TranslateMenuItem value={"YEARLY"}>
                                    Years
                                </TranslateMenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        {scheduledPaymentText}
                    </Grid>
                </Grid>
            </Collapse>
        </Grid>
    );
};
