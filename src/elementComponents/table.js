import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'hidden',
  },
  table: {
    minWidth: 700,
  },
});

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const data = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function SimpleTable(props) {
  const { classes } = props;

  return (
    <div style={{margin: "0 auto"}} className={classes.root}>
      <Table className={classes.table}>
        <TableHead style={{background: "radial-gradient(#dbdbdb, transparent)"}}>
          <TableRow hover={true}>
            <TableCell>{props.first}</TableCell>
            <TableCell>{props.second}</TableCell>
            <TableCell>Description</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>

          {props.table.map(n => {
            return (
              <TableRow hover={true}   key={n.id}>
                <TableCell dangerouslySetInnerHTML={{__html: n.first}} component="th" scope="row">
                  {/* {n.first} */}
                </TableCell>
                <TableCell style={{"fontFamily": "math"}}><code>{n.second}</code></TableCell>
                <TableCell style={{"fontFamily": "math"}}> <blockquote>{n.third}</blockquote> </TableCell>

              </TableRow>
            );
          })}

        </TableBody>
      </Table>
     </div>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
