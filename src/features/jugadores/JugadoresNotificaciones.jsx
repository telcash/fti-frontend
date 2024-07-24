import './jugadores.css';
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { getNotificaciones, setNotificaciones } from '../notificaciones/notificacionesSlice';

const JugadoresNotificaciones = () => {

    const dispatch = useDispatch();
    const notificaciones = useSelector(getNotificaciones);

    const [notificacionesActuales, setNotificacionesActuales] = useState(notificaciones)

    const borrarNotificaciones = () => {
        dispatch(setNotificaciones([]));
        setNotificacionesActuales([]);
    }

    const borrarNotificacion = (index) => {
        const notificaciones = notificacionesActuales.filter((notificacion, i) => i !== index);
        dispatch(setNotificaciones(notificaciones));
        setNotificacionesActuales(notificaciones);
    }

    return (

        <section className="jugador-notificaciones">
            <h2>Notificaciones</h2>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}}>
                    <TableBody>
                        {notificacionesActuales && notificacionesActuales.map((notificacion, index) => (
                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>{notificacion}</TableCell>
                                <TableCell>
                                    <div className="action-buttons">
                                        <IconButton onClick={() => borrarNotificacion(index)} color='error'>
                                            <DeleteIcon color="primary" />
                                        </IconButton>
                                        
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Button onClick={borrarNotificaciones}>Borrar todas las notificaciones</Button>
        </section>
    )
}

export default JugadoresNotificaciones;