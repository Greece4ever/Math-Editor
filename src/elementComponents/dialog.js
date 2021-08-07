import { Dialog } from "@material-ui/core";
import React, { useState } from "react";


import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/TableRow';

import { Grid } from "@material-ui/core";


import { Latex } from "../components/replace";
import { convertLatex } from "../components/renderMain"
import Paper from '@material-ui/core/Paper';
import { Box } from "@material-ui/core";

import SimpleTable from './table';

function convertDict(latex_array)
{
    let obj = [];
    for (let i=0; i < latex_array.length; i++)
    {
        let dict;
        if (latex_array[i][0] === "sqrt")
            dict = ({"first": convertLatex("sqrt {x + 1}"), "second": "sqrt {x + 1}"});
        else if (latex_array[i][1] === "$1_$2")
            dict = ({"first": convertLatex("x0"), "second": "x0"})    
        else
            dict = ({"first": convertLatex(latex_array[i][1]), "second": latex_array[i][0]})

        dict["third"] = latex_array[i][2];

        obj.push(dict);

    }
    return obj;
}



const HelpDialog = (props) => {

    const [latexTable, setLatexTable] = useState(convertDict(Latex));

    return (
        <Dialog  maxWidth={"xl"}  open={props.open}>

            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send updates
                    occasionally.
                </DialogContentText>

            {/* 
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send updates
                    occasionally.
                </DialogContentText>

                <Grid  style={{width: "50%", float: "left"}}>
                <TableContainer component={Paper}>

                    <Table >


                    <TableHead>
                        <TableRow>
                            <TableCell >Latex Symbol</TableCell>
                            <TableCell align="right">Markdown Symbol</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {latexTable.map( (row) => 
                        <TableRow>
                        <TableCell dangerouslySetInnerHTML={{__html: row.latex }} component="th" scope="row">
                            
                        </TableCell>
                        <TableCell align="right">{row.markdown}</TableCell>

                        </TableRow>

                    )}                    

                    </TableBody>
                    </Table>
                </TableContainer>

                </Grid>

                <Grid  style={{width: "50%", float: "right"}}>
                <TableContainer component={Paper}>
                    

                    <Table>

                    <TableHead>

                        <TableRow hover={true}>
                            <TableCell>Latex Symbols</TableCell>
                            <TableCell>Markdown Symbols</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        <TableRow   hover={true}>
                            <TableCell >Latex Symbols</TableCell>
                            <TableCell   >Markdown Symbols</TableCell>
                        </TableRow>



                    {latexTable.map( (row) => 
                        <TableRow>
                            <TableCell  dangerouslySetInnerHTML={{__html: row.latex }} component="th" scope="row"></TableCell>
                            <TableCell   scope="row" align="right">{row.markdown}</TableCell>
                        </TableRow>

                    )}   


                    </TableBody>
                    </Table>
                </TableContainer>

                </Grid>



            </DialogContent> */}
            

            <SimpleTable  first={"Latex"} second={"Markdown"} table={latexTable}></SimpleTable>
            </DialogContent>



        </Dialog>
    )
}

export default HelpDialog;