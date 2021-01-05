import React from 'react';
import Container from '@material-ui/core/Container';
import { Button, Fab, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import RestoreIcon from '@material-ui/icons/Restore';

import config from '../const';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '90%',
        marginLeft: '5%',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2)
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function Home() {
    const classes = useStyles();
    const [data, setData] = React.useState(null);
    const [reset, setReset] = React.useState(false);

    const getData = async () => {
        const tmp = data ? undefined : await axios.get(config.url + config.port + '/data/all')
            .catch(err => console.log(err))
        if (tmp && tmp.data && tmp.data.length > 0) {
            setData(tmp.data.sort((a, b) => { return parseInt(a.creation) - parseInt(b.creation) }));
        }
    }

    const del = (id) => {
        console.log(id)
        axios.delete(config.url + config.port + '/data/' + id)
            .then(res => {
                if (res.status === 200) {
                    alert("Data deleted")
                    window.location.reload();
                }
            })
            .catch(err => console.log(err))
    }

    const finish = (id, finished) => {
        const obj = {
            finished: finished !== "" ? "" : new Date().getTime()
        }
        console.log(obj)
        axios.put(config.url + config.port + '/data/' + id, obj)
            .then(res => {
                if (res.status === 200) {
                    alert("Data updated");
                    window.location.reload();
                }
            })
    }

    const parseDate = (date) => {
        var day = new Date(date).getDate();
        var month = new Date(date).getMonth() + 1;
        var year = new Date(date).getFullYear();

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }

        return day + "/" + month + "/" + year
    }

    let tmp = data ? null : getData();

    return (
        <Container component="main" maxWidth="md">
            <div className={classes.paper}>
                {data ?
                    <Paper elevation={3} style={{ width: "100%" }}>
                        <div className={classes.form}>
                            <br />
                            <Fab size='small' variant="outlined" color="primary" onClick={() => window.location.href = "/new"}><AddIcon size=' small' /></Fab>
                            <br /><br />
                            {data.map((value, index) => {
                                console.log(value)
                                // if (value.finished !== "") {
                                //     setReset(true)
                                // }
                                return (
                                    <Accordion>

                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >

                                            <Typography className={classes.heading} style={{ textDecoration: value.finished !== "" ? 'line-through' : "", color: value.finished !== "" ? "#00e676" : "" }}>{value.title}</Typography>
                                            <Typography className={classes.heading}>&nbsp;{value.finished !== "" ? " -  " + parseDate(value.finished * 1) : ""}</Typography>

                                        </AccordionSummary>

                                        <AccordionDetails>

                                            <div style={{ textAlign: 'left' }}>
                                                <Typography className={classes.heading}>Category: {value.category}</Typography><br />
                                                <Typography className={classes.heading}>Description: {value.description}</Typography><br />
                                                <br />
                                                {value.finished === "" ?
                                                    <Fab size='small' variant="outlined" color="secondary" style={{ backgroundColor: "#00e676", color: 'white' }} onClick={() => finish(value.id, value.finished)}><DoneIcon size=' small' /></Fab>
                                                    :
                                                    <Fab size='small' variant="outlined" color="secondary" style={{ backgroundColor: "#00e676", color: 'white' }} onClick={() => finish(value.id)}><RestoreIcon size=' small' /></Fab>
                                                }&nbsp;
                                                <Fab size='small' variant="outlined" color="primary" onClick={() => window.location.href = "/edit/" + value.id}><EditIcon size='small' /></Fab>
                                                &nbsp;
                                                <Fab size='small' variant="outlined" color="secondary" onClick={() => del(value.id)}><DeleteForeverIcon size=' small' /></Fab>
                                            </div>

                                        </AccordionDetails>

                                    </Accordion>
                                )
                            })}
                        </div>
                    </Paper>
                    : null}
            </div>
        </Container>
    )
}