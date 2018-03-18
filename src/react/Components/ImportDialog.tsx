import * as React from "react";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle
} from "material-ui/Dialog";
import Slide from "material-ui/transitions/Slide";

const Transition = props => <Slide direction="right" {...props} />;

class ImportDialog extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            importContent: "",
            importContentError: false
        };
    }

    importContentChange = event => {
        this.setState(
            { importContent: event.target.value },
            this.validateImportData
        );
    };

    importData = (asNew: boolean = false) => {
        if (!this.state.importContentError) {
            const data = JSON.parse(this.state.importContent);

            // if imported as new item, reset ID
            if (asNew && data.id) {
                data.id = null;
            }

            this.props.importData(data);
        }
    };
    importDataNew = event => this.importData(true);
    importDataOverwrite = event => this.importData(false);

    validateImportData = () => {
        let jsonIsInvalid = false;
        try {
            JSON.parse(this.state.importContent);
        } catch (ex) {
            jsonIsInvalid = true;
        }
        this.setState({
            importContentError: jsonIsInvalid
        });
    };

    render() {
        const { open, closeModal, title } = this.props;

        return (
            <Dialog
                transition={Transition}
                keepMounted
                open={open}
                onClose={closeModal}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <TextField
                        onChange={this.importContentChange}
                        value={this.state.importContent}
                        error={this.state.importContentError}
                        multiline
                        rows="8"
                        style={{
                            width: 450
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="raised"
                        onClick={closeModal}
                        color="secondary"
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="raised"
                        onClick={this.importDataOverwrite}
                        color="primary"
                    >
                        Import and overwrite
                    </Button>

                    <Button
                        variant="raised"
                        onClick={this.importDataNew}
                        color="primary"
                    >
                        Import as new
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default ImportDialog;
