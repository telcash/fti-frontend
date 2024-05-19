import './jugadores.css';
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
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
            {notificacionesActuales && notificacionesActuales.map((notificacion, index) => (
                <div key={index} className="jugador-notificaciones-item">
                    <p>{notificacion}</p>
                    <Button onClick={() => borrarNotificacion(index)} color='error'>X</Button>
                </div>
            ))
            }
            <Button onClick={borrarNotificaciones}>Borrar todas las notificaciones</Button>
        </section>
    )
}

export default JugadoresNotificaciones;