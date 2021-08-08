import React, { useState } from 'react';
import Fab from '@material-ui/core/Fab';
import Popover from '@material-ui/core/Popover';

const SaveButton = (props) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const HandleFabClick = (event) => {
        setOpen(prev => !prev);
        setAnchorEl(event.currentTarget);        
    }

    const handleClose = e => {
        setOpen(false);
        setAnchorEl(null);
    }


    return (
        <div>       
            <Fab color={props.color} style={{marginBottom: "10px", marginRight: "10px"}} onClick={e => HandleFabClick(e)}>
                {props.icon}
            <Popover 

                open={open}
                anchorEl={anchorEl}
                onClose={e => handleClose(e)}

                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                  }}
                                
            >
            <div style={{position: "relative", backgroundColor: props.backgroundColor}}>
                <div style={{display: "grid"}}>
                    {props.children}
                </div>
            </div>
            </Popover>
            </Fab>
        </div>  
    );
}

export default SaveButton;