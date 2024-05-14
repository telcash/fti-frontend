import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSesiones, getSesionesStatus, selectAllSesiones, sesionSelected } from '../sesion-individual/sesionIndividualSlice';
import { getJugadorSelected } from './jugadoresSlice';
import { Button } from '@mui/material';
import { paths, router } from '../../router/router';

const JugadorCalendario = () => {

    const dispatch = useDispatch();

    const jugador = useSelector(getJugadorSelected);

    const sesiones = useSelector(selectAllSesiones);
    const sesionesStatus = useSelector(getSesionesStatus);

    const [sesionesJugador, setSesionesJugador] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const activeDates = sesiones.filter(sesion => sesion.jugador.id === jugador.id).map(sesion => dayjs(sesion.fecha));

    const onDateChange = (e) => setSelectedDate(e);

    useEffect(() => {
        if(sesionesStatus === 'idle') {
            dispatch(fetchSesiones());
        }
    }
    , [sesionesStatus, dispatch]);

    useEffect(() => {
        if (sesiones) {
            setSesionesJugador(sesiones.filter(sesion => sesion.jugador.id === jugador.id));
        }
    }
    , [sesiones, jugador]);

    const handleOnViewSesion = () => {
        console.log(selectedDate);
        console.log(sesionesJugador);
        const sesion = sesionesJugador.find(sesion => dayjs(sesion.fecha).isSame(selectedDate, 'day'));
        if (sesion) {
            dispatch(sesionSelected(sesion));
            router.navigate(paths.jugadorCalendarioSesion, { replace: true });
        }
    }

    return (
        <section className="jugador-calendario">
            <h2>Calendario</h2>
            <div className="jugador-calendario-calendario">
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                    <DateCalendar
                        value={selectedDate}
                        onChange={onDateChange}
                        shouldDisableDate={(date) => !activeDates.some(activeDate => activeDate.isSame(date, 'day'))}
                    />
                </LocalizationProvider>
            </div>
            <div className="jugador-calendario-acciones">
                <Button variant="contained" color="primary"
                    onClick={handleOnViewSesion}
                >
                    Ver sesion
                </Button>
                <Button variant="contained" color="primary"
                    onClick={() => router.navigate(paths.calendario, { replace: true })}
                >
                    Regresar
                </Button>
            </div>
        </section>
    )
}

export default JugadorCalendario;