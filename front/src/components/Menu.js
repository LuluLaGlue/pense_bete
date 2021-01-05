import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.primary.main
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        textAlign: 'left',
        marginLeft: '10px'
    },
}));

export default function Menu() {
    const classes = useStyles();

    return (
        <div className={classes.root}>

            <AppBar position="static">

                <Toolbar>

                    <Typography variant="h6" className={classes.title}>YEEET</Typography>

                    <Button color="inherit" onClick={() => window.location.href = "/home"}>Home</Button>

                </Toolbar>

            </AppBar>

        </div>
    );
}