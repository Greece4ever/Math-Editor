import React, { useEffect, useRef, useState } from 'react';
import Fab from '@material-ui/core/Fab';

import SaveButtton from './save';
import SettingsIcon from '@material-ui/icons/Settings';

import HelpIcon from '@material-ui/icons/Help';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

import logoPDF from './pdf.svg';
import logoSVG from './svg.svg';
import logoPNG from './png-file-format.svg';
import CopyrightIcon from '@material-ui/icons/Copyright';
import SimpleDialog from './dialog2'
import HelpDialog from './dialog';
import { useDidMountEffect } from '../components/hooks'

const createIcons = () => {
    let ret = [];
    let icons = [logoPDF, logoSVG, logoPNG];
    let creators = [
        <div>Icons made by <a href="https://www.flaticon.com/authors/dimitry-miroliubov" title="Dimitry Miroliubov">Dimitry Miroliubov</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>,
        <div>Icons made by <a href="https://www.flaticon.com/authors/vitaly-gorbachev" title="Vitaly Gorbachev">Vitaly Gorbachev</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>,
        <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
    ]

    for (let i=0; i < icons.length; i++)
    {
        ret.push({"src" : icons[i], "author" : creators[i]});
    }

    return ret;
}

function isEventInElement(event, element)   {
    var rect = element.getBoundingClientRect();
    var x = event.clientX;
    if (x < rect.left || x >= rect.right) return false;
    var y = event.clientY;
    if (y < rect.top || y >= rect.bottom) return false;
    return true;
}

let _trans = 56 + 10;

const Icons = (props) => {
    const [helpDialogOpen, setHelpDialogOpen] = useState(false);
    const [cDialogOpen, setCdialogOpen] = useState(false);
    const [icons, setIcons] = useState(createIcons());
    const [dark, setDark] = useState(false);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [saveOpen,     setSaveOpen]     = useState(false);

    const [mpos, setMpos] = useState({clientX: window.innerHeight, clientY: window.innerHeight});
    const mainRef = React.useRef();
    
    const saveRef    = useRef(saveOpen);
    const settingRef = useRef(settingsOpen);
    saveRef.current = saveOpen;
    settingRef.current = settingsOpen;

    useDidMountEffect(() => {
        localStorage.setItem("dark", `${dark}`);
        props.setDarkMode(dark);
    }, [dark])

    const [translate, setTranslate] = useState(`translate(0, 0)`);
 
    useEffect(() => {
        window.addEventListener("mousemove", (e) => {
            setMpos(e);
        })

        return () => window.removeEventListener("mousemove", () => {}) 
    }, [])

    useEffect(() => {
        let timeout = setTimeout(() => {
            if ( !(saveRef.current || settingRef.current) )
                onMouseLeave();            
        }, 1.5 * 1000)

        return () => {clearTimeout(timeout)}
    }, [])

    useDidMountEffect(() => {        
        if (settingsOpen || saveOpen || isEventInElement(mpos, mainRef.current))
            return;
        
        onMouseLeave();
    }, [saveOpen, settingsOpen])

    useDidMountEffect(() => {
        if (helpDialogOpen || cDialogOpen)
            setTranslate(`translate(${0}, 0)`);
        else
            onMouseLeave();
    }, [cDialogOpen, helpDialogOpen])

    const onMouseOver = () => {
        setTranslate(`translate(${0}, 0)`);
    }

    const onMouseLeave = () => {
        if ( !(settingsOpen || saveOpen) )
                setTranslate(`translate(${_trans}px, 0)`);
    }    

    return (
        <div ref={mainRef} onMouseLeave={e => onMouseLeave(e)} onMouseEnter={e => onMouseOver(e)} style={{position: "absolute", right: 0, bottom: 0, display: "grid"}}>
            <HelpDialog open={helpDialogOpen} setOpen={setHelpDialogOpen} />
            <SimpleDialog onClose={setCdialogOpen} Icons={icons} open={cDialogOpen} />

            <SaveButtton disabled={ translate === `translate(${_trans}px, 0)` ? true : false } open={settingsOpen} setOpen={setSettingsOpen} style={{ transition: "transform 1s", transform: translate  }} backgroundColor={"#3f51b5"} color={ "primary" } icon={<SettingsIcon  />}>
                <Fab onClick={() => setDark(prev => !prev)} style={{margin: "10px", backgroundColor: "#2a2d2f", color: "#f1ff1a"}}>
                    <Brightness3Icon />
                </Fab>

                <Fab onClick={() => setHelpDialogOpen(true)} style={{margin: "10px", backgroundColor: "#2a2d2f", color: "white"}}>
                    <HelpIcon />
                </Fab>
                <Fab onClick={() => setCdialogOpen(true)} style={{margin: "10px", backgroundColor: "#2a2d2f", color: "white"}}>
                    <CopyrightIcon/>
                </Fab>

            </SaveButtton>

            <SaveButtton disabled={ translate === `translate(${_trans}px, 0)` ? true : false } open={saveOpen} setOpen={setSaveOpen} style={{ transition: "transform 1s",  transform: translate }} backgroundColor={"#f50057"} color={ "secondary" } icon={ <SaveAltIcon /> }>

                <Fab onClick={e => props.save("pdf")} style={{margin: "10px", background: "#2a2d2f"}}>
                    <img style={{width: "32px"}} src={logoPDF}></img>
                </Fab>

                <Fab onClick={e => props.save("svg")} style={{margin: "10px", backgroundColor: "#2a2d2f"}}>
                    <img style={{width: "32px"}} src={logoSVG}></img>
                </Fab>

                <Fab onClick={e => props.save("png")} style={{margin: "10px", backgroundColor: "#2a2d2f"}}>
                    <img style={{width: "32px"}} src={logoPNG}></img>
                </Fab>

            </SaveButtton>

        </div>  
    );
}

export default Icons;