import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import JugadorAvatar from "./JugadorAvatar";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDispatch, useSelector } from "react-redux";
import { fetchSesiones, getSesionesStatus, selectAllSesiones } from "../sesion-individual/sesionIndividualSlice";
import { getJugadorSelected } from "./jugadoresSlice";
import { useEffect, useState } from "react";
import { Box, Button, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tabs } from "@mui/material";
import { paths, router } from "../../router/router";


const JugadorDesarrolloTactico = () => {

    const dispatch = useDispatch();

    const jugador = useSelector(getJugadorSelected);

    const sesiones = useSelector(selectAllSesiones);
    const sesionesStatus = useSelector(getSesionesStatus);

    const [sesionesJugador, setSesionesJugador] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedSesion, setSelectedSesion] = useState();
    const [tipoFundamento, setTipoFundamento] = useState('');
    const activeDates = sesiones.filter(sesion => sesion.jugador.id === jugador.id).map(sesion => dayjs(sesion.fecha));

    const onDateChange = (e) => {
        setSelectedDate(e);
        setSelectedSesion(sesionesJugador.find(s => dayjs(s.fecha).isSame(e, 'day')));
    }

    const onTipoFundamentoChange = (e, newValue) => setTipoFundamento(newValue);

    useEffect(() => {
        if(sesionesStatus === 'idle') {
            dispatch(fetchSesiones());
        }
    }
    , [sesionesStatus, dispatch]);

    useEffect(() => {
        if (sesiones.length > 0) {
            setSesionesJugador(sesiones.filter(s => s.jugador.id === jugador.id));
        }
    }
    , [sesiones, jugador]);

    return (
        <section className="jugador-desarrollo-tactico">
            <h2>Análisis Táctico</h2>
            <div className="jugador-desarrollo-tactico-info">
                <div className="jugador-desarrollo-tactico-info-jugador">
                    <JugadorAvatar fotoJugador={jugador.foto} nombre={jugador.nombre} apellido={jugador.apellido} posicion={jugador.posicion.nombre} />
                    <div className="jugador-desarrollo-tactico-info-jugador-leyendas">
                        <div className="jugador-desarrollo-tactico-info-jugador-leyendas-item">
                            <Box bgcolor="#A8D6A6" sx={{ width: 60, height: 20, borderRadius: '5%' }} />
                            <h5>+90% aciertos</h5>  
                        </div>
                        <div className="jugador-desarrollo-tactico-info-jugador-leyendas-item">
                            <Box bgcolor='#42A3D5' sx={{ width: 60, height: 20, borderRadius: '5%' }} />
                            <h5>Entre 80% y 90% aciertos</h5>
                        </div>
                        <div className="jugador-desarrollo-tactico-info-jugador-leyendas-item">
                            <Box bgcolor="#F5D16B" sx={{ width: 60, height: 20, borderRadius: '5%' }} />
                            <h5>Entre 70% y 80% aciertos</h5>
                        </div>
                        <div className="jugador-desarrollo-tactico-info-jugador-leyendas-item">
                            <Box bgcolor="#F26E71" sx={{ width: 60, height: 20, borderRadius: '5%' }} />
                            <h5>-70% aciertos</h5>
                        </div>
                    </div>
                </div>
                <div className="jugador-desarrollo-tactico-info-calendario">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                        <DateCalendar 
                            value={selectedDate}
                            onChange={onDateChange}
                            shouldDisableDate={(date) => !activeDates.some(activeDate => activeDate.isSame(date, 'day'))}
                        />
                    </LocalizationProvider>
                </div>
            </div>
            <div className="jugador-desarrollo-tactico-fundamentos">
                <div className="jugador-desarrollo-tactico-fundamentos-tabs">
                    <Tabs
                        value={tipoFundamento}
                        onChange={onTipoFundamentoChange}
                    >
                        <Tab sx={{mr: 5, ml: 5}} value="Defensivo" label="Fundamentos defensivos"/>
                        <Tab sx={{mr: 5, ml: 5}} value="Ofensivo" label="Fundamentos ofensivos"/>
                    </Tabs>
                </div>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}}>
                        <TableBody>
                            {selectedSesion && selectedSesion.ejercicios.filter( ejercicio => ejercicio.fundamento.tipo === tipoFundamento).map((ejercicio, index) => (
                                <TableRow key={ejercicio.id}>
                                    <TableCell align="left">{`${index + 1} - ${ejercicio.fundamento.nombre}`}</TableCell>
                                    <TableCell 
                                        align="center"
                                        width={150}
                                        sx={{
                                            backgroundColor: ejercicio.valoracion / ejercicio.valoracionMaxima > 0.9 ? '#A8D6A6' : 
                                                            ejercicio.valoracion / ejercicio.valoracionMaxima >= 0.8 ? '#42A3D5' :
                                                            ejercicio.valoracion / ejercicio.valoracionMaxima >= 0.7 ? '#F5D16B' :
                                                            '#F26E71',
                                            fontWeight: 'bolder',
                                            fontSize: '1.2rem'
                                        }}
                                    >
                                        {`${ejercicio.valoracion}/${ejercicio.valoracionMaxima}`}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </TableContainer>
            </div>
            <div>
                <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={() => router.navigate(paths.desarrolloTacticoIndividual, {replace: true})}>Regresar</Button>
            </div>
        </section>
    )
}

export default JugadorDesarrolloTactico;