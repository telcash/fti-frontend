import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { paths, router } from "../../router/router";
import { getJugadorSelected } from "./jugadoresSlice";
import { fetchSesiones, getSesionesStatus, getSesionSelected, selectAllSesiones } from "../sesion-individual/sesionIndividualSlice";
import { useDispatch, useSelector } from "react-redux";
import JugadorAvatar from "./JugadorAvatar";
import { useEffect, useState } from "react";
import dayjs from "dayjs";



const JugadorSesion = () => {

    const dispatch = useDispatch();

    const jugador = useSelector(getJugadorSelected);
    const sesion = useSelector(getSesionSelected);

    const sesiones = useSelector(selectAllSesiones);
    const sesionesStatus = useSelector(getSesionesStatus);

    const [sesionesJugador, setSesionesJugador] = useState([]);

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

    return (
        <section className="jugador-sesion">
            <div>
                <h2>Sesión de Jugador</h2>
                <JugadorAvatar jugador={jugador}/>
            </div>
            <h4>Fecha: {dayjs(sesion.fecha).format('DD/MM/YYYY')}</h4>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="lista sesiones">
                    <TableHead sx={{backgroundColor:'#273237'}}>
                        <TableRow>
                            <TableCell align="center" sx={{color: 'white'}}>Fundamento</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Tipo</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Táctica</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Física</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Toma de Decisiones</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Técnica</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Psicológica</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Fundamentos Totales</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Observaciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sesion && sesion.ejercicios && sesion.ejercicios.map((ejercicio) => (
                            <TableRow
                                key={ejercicio.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{ejercicio.fundamento.nombre}</TableCell>
                                <TableCell align="center">{ejercicio.fundamento.tipo}</TableCell>
                                <TableCell align="center">{ejercicio.valoracion}</TableCell>
                                <TableCell align="center">{ejercicio.valoracionFisica}</TableCell>
                                <TableCell align="center">{ejercicio.valoracionTactica}</TableCell>
                                <TableCell align="center">{ejercicio.valoracionTecnica}</TableCell>
                                <TableCell align="center">{ejercicio.valoracionPsicologica}</TableCell>
                                <TableCell align="center">{ejercicio.valoracionMaxima}</TableCell>
                                <TableCell align="center">{ejercicio.observaciones}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button variant="contained" color="primary" onClick={() => router.navigate(paths.jugadorCalendario, { replace: true })}>Regresar</Button>
        </section>
    )
}

export default JugadorSesion;