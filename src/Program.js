import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


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

class Program extends Component {
    constructor(props) {
        super(props);
        console.log(`Program.programs=${JSON.stringify(this.props.user.programs)}`)
        this.state = {
            programs: this.props.user.programs || [],
        }
    }
    render() {
        const { classes } = this.props;

        return (
            <div>
                <hr />
                {this.state.programs.map(elem => (
                    <div key={elem.SearchWord}>
                        <p>{elem.SearchWord}</p>
                        <Grid container spacing={40} alignItems="flex-end">
                            {elem.Programs.map(program => (
                                <Grid item key={program.ProgramId} xs={12} sm={6} md={4}>
                                    <Card className={classes.card}>
                                        <CardHeader className={classes.cardHeader}/>
                                        <CardContent className={classes.cardContent}>
                                            <Typography paragraph>
                                                {program.Date}
                                            </Typography>
                                            <Typography paragraph>
                                                {program.Station}<br />
                                                {program.Title}
                                                <a href={program.ProgramId}>詳細</a>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                ))}
            </div>
        )
    }
}

export default withStyles(styles)(Program)
