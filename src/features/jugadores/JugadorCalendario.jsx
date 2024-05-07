import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSesiones, getSesionesStatus, selectAllSesiones } from '../sesion-individual/sesionIndividualSlice';
import { getJugadorSelected } from './jugadoresSlice';

const JugadorCalendario = () => {

    const dispatch = useDispatch();

    const jugador = useSelector(getJugadorSelected);

    const sesiones = useSelector(selectAllSesiones);
    const sesionesStatus = useSelector(getSesionesStatus);

    const [selectedDate, setSelectedDate] = useState(dayjs());
    const activeDates = sesiones.filter(sesion => sesion.jugador.id === jugador.id).map(sesion => dayjs(sesion.fecha));

    const onDateChange = (e) => setSelectedDate(e);

    useEffect(() => {
        if(sesionesStatus === 'idle') {
            dispatch(fetchSesiones());
        }
    }
    , [sesionesStatus, dispatch]);

    return (
        <section className="jugador-calendario">
            <h2>Calendario</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DateCalendar 
                    value={selectedDate}
                    onChange={onDateChange}
                    shouldDisableDate={(date) => !activeDates.some(activeDate => activeDate.isSame(date, 'day'))}
                />
            </LocalizationProvider>
        </section>
    )
}

export default JugadorCalendario;