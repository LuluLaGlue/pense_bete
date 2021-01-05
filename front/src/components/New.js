import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Button, Paper, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

export default function New() {
    const classes = useStyles();
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [cat, setCat] = React.useState(null);
    const [newCat, setNewCat] = React.useState(null);

    const create = () => {
        const obj = {
            title: title,
            description: description,
            category: newCat || category,
            creation: new Date().getTime()
        }

        console.log(obj)

        axios.post(config.url + config.port + '/data', obj)
            .then(res => {
                if (res.status === 200) {
                    alert("Data created")
                    window.location.href = "/home"
                }
            })
            .catch(err => console.log(err))
    }

    const getCat = async () => {
        const tmp = cat ? undefined : await axios.get(config.url + config.port + '/data/list/cat')
            .catch(err => console.log(err))
        if (tmp && tmp.data && tmp.data.length > 0) {
            setCat(tmp.data);
        }
    }

    let tmp = cat ? null : getCat();

    return (
        <Container component="main" maxWidth="md">

            <div className={classes.paper}>

                <Paper elevation={3} style={{ width: "100%" }}>

                    <div className={classes.form}>
                        <Typography variant="h6" style={{ textAlign: "left" }}>Title</Typography>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="title"
                            label="Title"
                            name="title"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <br />
                        <Typography variant="h6" style={{ textAlign: "left" }}>Description</Typography>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            multiline
                            id="desc"
                            label="Description"
                            name="desc"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <br />
                        <Accordion>

                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >

                                <Typography className={classes.heading}>Category</Typography>

                            </AccordionSummary>

                            <AccordionDetails>

                                <div style={{ textAlign: 'left' }}>
                                    <FormControl className={classes.formControl}>

                                        <Select
                                            value={category}
                                            onChange={(e) => { setCategory(e.target.value) }}
                                            displayEmpty
                                            className={classes.selectEmpty}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >

                                            <MenuItem value="" disabled>Category</MenuItem>
                                            <MenuItem value={"newCat"}>New Category</MenuItem>
                                            {cat ?
                                                cat.map((value, index) => {
                                                    return (<MenuItem value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</MenuItem>)
                                                })
                                                : null}

                                        </Select>

                                        <FormHelperText>Category</FormHelperText>

                                    </FormControl>
                                    {category === "newCat" ?
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                            multiline
                                            id="cat"
                                            label="Category"
                                            name="cat"
                                            onChange={(e) => setNewCat(e.target.value)}
                                        />
                                        : null}
                                </div>

                            </AccordionDetails>

                        </Accordion>
                        <br />
                        <Button variant="outlined" onClick={() => create()}><SendIcon />&nbsp;Créer</Button>
                    </div>

                </Paper>

            </div>

        </Container>
    )
}