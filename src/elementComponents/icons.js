import React, { useState } from 'react';
import Fab from '@material-ui/core/Fab';

import SaveButtton from './save';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ImageIcon from '@material-ui/icons/Image';
import SettingsIcon from '@material-ui/icons/Settings';

import HelpIcon from '@material-ui/icons/Help';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

import logo from './pdf.svg';
import logoSVG from './svg.svg';
import logoPNG from './png-file-format.svg';
import CopyrightIcon from '@material-ui/icons/Copyright';
import SimpleDialog from './dialog2'



const Icons = (props) => {
    // <div>Icons made by <a href="https://www.flaticon.com/authors/dimitry-miroliubov" title="Dimitry Miroliubov">Dimitry Miroliubov</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
    // <div>Icons made by <a href="https://www.flaticon.com/authors/vitaly-gorbachev" title="Vitaly Gorbachev">Vitaly Gorbachev</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
    // <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>


    return (
        <div style={{ position: "absolute", right: 0, bottom: 0, display: "grid"}}>

             
            <SaveButtton backgroundColor={"#3f51b5"} color={ "primary" } icon={<SettingsIcon  />}>
                <Fab style={{margin: "10px", backgroundColor: "#2a2d2f", color: "#f1ff1a"}}>
                    <Brightness3Icon />
                </Fab>

                <Fab style={{margin: "10px", backgroundColor: "#2a2d2f", color: "white"}}>
                    <HelpIcon />
                </Fab>
                <Fab style={{margin: "10px", backgroundColor: "#2a2d2f", color: "white"}}>
                    <CopyrightIcon/>
                </Fab>

            </SaveButtton>

            <SaveButtton backgroundColor={"#f50057"} color={ "secondary" } icon={ <SaveAltIcon /> }>

                <Fab  style={{margin: "10px", background: "#2a2d2f"}}>
                    {/* <PictureAsPdfIcon style={{color: "red"}} /> */}
                    <img style={{width: "32px"}} src={logo}></img>
                </Fab>
                <Fab style={{margin: "10px", backgroundColor: "#2a2d2f"}}>
                <img style={{width: "32px"}} src={logoSVG}></img>
                </Fab>
                <Fab style={{margin: "10px", backgroundColor: "#2a2d2f"}}>
                    <img style={{width: "32px"}} src={logoPNG}></img>
                </Fab>

                
            </SaveButtton>

        </div>  
    );
}

export default Icons;