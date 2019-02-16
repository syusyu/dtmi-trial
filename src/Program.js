import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Input from '@material-ui/core/Input';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import Button from '@material-ui/core/Button';


const styles = {
    card: {
        // maxWidth: 200,
        // maxHeight: 60,
        fontSize: 11,
        padding: 0,
        // margin: 5,
    },
    cardHeader: {
        // maxHeight: 10,
        padding: 0,
        margin: 0,
    },
    cardContent: {
        padding: 0,
        margin: 5,
        wordWrap: 'break-word'
    },
};

const dummy = [
    {
        searchWord: "Netherlands"
    },
    {
        searchWord: "Bolivia"
    },
    {
        searchWord: "日本代表"
    },
    {
        searchWord: "Rotterdam"
    },
    {
        searchWord: "Singapore"
    },
    {
        searchWord: "Barcelona"
    },
]

class SearchWordDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            word: null
        }
    }
    close() {
        this.props.onClose()
    }

    changeWord(event) {
        this.setState({word: event.target.value});
    }

    addWord() {
        this.props.onClose(this.state.word)
    };

    render() {
        const { classes, onClose, ...other } = this.props;

        return (
            <Dialog onClose={() => this.close()} aria-labelledby="simple-dialog-title" {...other} >
                <DialogTitle id="simple-dialog-title">Add search word</DialogTitle>
                <div>
                    <Input value={this.state.value} onChange={e => this.changeWord(e)} autoFocus />
                    <Button variant="outlined" onClick={() => this.addWord()}>
                        Add
                    </Button>
                </div>
            </Dialog>
        );
    }
}


class Program extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchWords: dummy,
            open: false,
        }
    }
    initializeSearchWords() {
        this.setState({
            searchWords: dummy
        })
    }
    deleteSearchWord(key) {
        this.setState({
            searchWords: this.state.searchWords.filter(e => e.searchWord !== key)
        })
    }
    openDialog() {
        this.setState({
            open: true,
        });
    }
    closeDialog(word) {
        console.log(`closeDialog.word=${word}`)
        if (word) {
            this.addSearchWord(word)
        }
        this.setState({
            open: false,
        });
    }
    addSearchWord(word) {
        this.state.searchWords.push({searchWord: word})
    }
    render() {
        const { classes } = this.props;
        const programs = this.props.programs || this.state.searchWords

        return (
            <div>
                <Grid container spacing={40} alignItems="flex-end">
                    {programs.map(program => (
                        <Grid item key={program.searchWord} xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                <CardHeader className={classes.cardHeader} action={
                                    <IconButton onClick={() => this.deleteSearchWord(program.searchWord)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                }/>
                                <CardContent className={classes.cardContent}>
                                    <Typography paragraph>
                                        {program.searchWord}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <SearchWordDialog
                    open={this.state.open}
                    onClose={(word) => this.closeDialog(word)}
                />
                <Fab color="primary" aria-label="Add" className={classes.fab} onClick={() => this.openDialog()}>
                    <AddIcon />
                </Fab>
                <Button variant="outlined" onClick={() => this.initializeSearchWords()}>
                    Init
                </Button>
            </div>
        )
    }
}

export default withStyles(styles)(Program)
