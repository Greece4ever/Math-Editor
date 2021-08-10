import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';
import CopyrightIcon from '@material-ui/icons/Copyright';


const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, open } = props;

  return (
    <Dialog onClose={() => onClose()} aria-labelledby="simple-dialog-title" open={open}>
      <footer>
      <DialogTitle id="simple-dialog-title">
        <div style={{    display: 'flex',    alignItems: 'center',    flexWrap: 'wrap',}}>
            <CopyrightIcon style={{width: "24x", height: "24px"}} />
            <span style={{marginLeft: "5px"}}>Copyright - Footer</span>
          </div>
      </DialogTitle>
      <List>
        {props.Icons.map((icon) => (
          <ListItem>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <img style={{width: "32px"}} src={icon.src}></img>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={icon.author} />
          </ListItem>
        ))}
      </List>
      </footer>
    </Dialog>
  );
}

export default SimpleDialog;

