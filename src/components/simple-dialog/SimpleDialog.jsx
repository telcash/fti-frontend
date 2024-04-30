import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";


export default function SimpleDialog(props) {
    const { title, contentText, onClose, selectedValue, open } = props;

    const handleClose = (value) => {
        onClose(value);
    };


    return (
        <Dialog 
            onClose={handleClose} 
            open={open}
            PaperProps={{style: {boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)'}}}
            slotProps={{ backdrop: { style: { backgroundColor: 'rgba(255,255,255,0.1)' } } }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {contentText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose('Cancelar')} autoFocus>Cancelar</Button>
                <Button onClick={() => handleClose('Eliminar')}>Eliminar</Button>
            </DialogActions>
        </Dialog>
    )
}