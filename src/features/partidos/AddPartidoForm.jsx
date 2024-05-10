import { useDispatch, useSelector } from "react-redux"
import { fetchEquipos, getEquiposStatus, selectAllEquipos } from "../equipos/equiposSlice";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from "react";
import { addPartido } from "./partidosSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Button, FormControl, InputLabel, MenuItem, Select, Input, TableContainer, Table, TableHead, Paper, TableRow, TableCell, TableBody, Avatar } from "@mui/material";
import './partidos.css';
import { paths, router } from "../../router/router";
import { fetchJugadores, getJugadoresStatus, selectAllJugadores } from "../jugadores/jugadoresSlice";
import { addJugadorToPartido } from "../jugador-to-partido/jugadorToPartidoSlice";

const imgUrl = process.env.REACT_APP_API_STATIC_SERVER + "jugadores/";

const AddPartidoForm = () => {
    const dispatch = useDispatch();

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);

    const jugadores = useSelector(selectAllJugadores);
    const jugadoresStatus = useSelector(getJugadoresStatus);

    const [fecha, setFecha] = useState(dayjs());
    const [equipoLocal, setEquipoLocal] = useState('');
    const [equipoVisitante, setEquipoVisitante] = useState('');
    const [golesLocal, setGolesLocal] = useState(0);
    const [golesVisitante, setGolesVisitante] = useState(0);

    const [jugadoresEnEquipos, setJugadoresEnEquipos] = useState([]);
    const [jugadoresToPartido, setJugadoresToPartido] = useState([]);
    
    
    useEffect(() => {
        if(jugadoresEnEquipos.length > 0) {
            const newJugadoresToPartido = [];
            const jugadoresIds = jugadoresEnEquipos.map(jugador => jugador.id);
            jugadoresToPartido.forEach(jtp => {
                if(jugadoresIds.includes(jtp.jugadorId)) {
                    newJugadoresToPartido.push(jtp);
                }
            });
            jugadoresEnEquipos.forEach(jugador => {
                if(!newJugadoresToPartido.map(jtp => jtp.jugadorId).includes(jugador.id)) {
                    newJugadoresToPartido.push({
                        jugadorId: jugador.id,
                        convocado: true,
                        lesionado: false,
                        minJugados: 0,
                        goles: 0,
                        asistencias: 0,
                        tarjetasAmarillas: 0,
                        tarjetasRojas: 0,
                        valoracion: 0,
                    });
                }
            });
            setJugadoresToPartido(newJugadoresToPartido);
        }
    }, [jugadoresEnEquipos, jugadoresToPartido]);


    const onConvocadoChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorId === id) {
                return {...jtp, convocado: e.target.value === 'Si' ? true : false}
            }
            return jtp;
        });
        setJugadoresToPartido(updatedJtp);
    }

    const onLesionadoChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorId === id) {
                return {...jtp, lesionado: e.target.value === 'Si' ? true : false}
            }
            return jtp;
        });
        setJugadoresToPartido(updatedJtp)
    }

    const onMinJugadosChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorId === id) {
                return {...jtp, minJugados: e.target.value}
            }
            return jtp;
        })
        setJugadoresToPartido(updatedJtp);
    }

    const onGolesChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorId === id) {
                return {...jtp, goles: e.target.value}
            }
            return jtp;
        })
        setJugadoresToPartido(updatedJtp);
    }

    const onAsistenciasChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorId === id) {
                return {...jtp, asistencias: e.target.value}
            }
            return jtp;
        })
        setJugadoresToPartido(updatedJtp);
    }

    const onTarjetasAmarillasChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorId === id) {
                return {...jtp, tarjetasAmarillas: e.target.value}
            }
            return jtp;
        })
        setJugadoresToPartido(updatedJtp);
    }

    const onTarjetasRojasChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorId === id) {
                return {...jtp, tarjetasRojas: e.target.value}
            }
            return jtp;
        })
        setJugadoresToPartido(updatedJtp);
    }

    const onValoracionChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorId === id) {
                return {...jtp, valoracion: e.target.value}
            }
            return jtp;
        })
        setJugadoresToPartido(updatedJtp);
    }

    useEffect(() => {
        const jugadoresVisitantes = jugadores.filter(jugador => jugador.equipo && jugador.equipo.nombre === equipoVisitante);
        const jugadoresLocales = jugadores.filter(jugador => jugador.equipo && jugador.equipo.nombre === equipoLocal);
        const jugadoresTotales = jugadoresVisitantes.concat(jugadoresLocales);
        setJugadoresEnEquipos(jugadoresTotales);
    }, [equipoLocal, equipoVisitante, jugadores]);

    const onFechaChanged = e => setFecha(e);
    
    const onEquipoLocalChanged = e => {
        const selectedEquipo = e.target.value;
        if(selectedEquipo !== equipoVisitante) {
            setEquipoLocal(selectedEquipo);
        }
    }

    const onEquipoVisitanteChanged = e => {
        const selectedEquipo = e.target.value;
        if(selectedEquipo !== equipoLocal) {
            setEquipoVisitante(selectedEquipo);
        }
    }

    const onGolesLocalChanged = e => setGolesLocal(e.target.value);
    const onGolesVisitanteChanged = e => setGolesVisitante(e.target.value);

    const onSavePartidoClicked = () => {
        try {
            dispatch(addPartido(
                {
                    fecha: fecha,
                    equipoLocalId: equipos.filter(equipo => equipo.nombre === equipoLocal)[0].id,
                    equipoVisitanteId: equipos.filter(equipo => equipo.nombre === equipoVisitante)[0].id,
                    golesLocal: golesLocal,
                    golesVisitante: golesVisitante,
                }
            ))
            .then((response) => {
                const partidoId = response.payload.id;
                if(partidoId) {
                    const jugadoresPromises = jugadoresToPartido.map((jtp) => {
                        return dispatch(
                            addJugadorToPartido({
                                partidoId: partidoId,
                                jugadorId: jtp.jugadorId,
                                convocado: jtp.convocado,
                                lesionado: jtp.lesionado,
                                minJugados: jtp.minJugados,
                                goles: jtp.goles,
                                asistencias: jtp.asistencias,
                                tarjetasAmarillas: jtp.tarjetasAmarillas,
                                tarjetasRojas: jtp.tarjetasRojas,
                                valoracion: jtp.valoracion,
                            })
                        )
                    });
                    Promise.all(jugadoresPromises)
                    .then(() => {
                        router.navigate(paths.gestionPartidos, {replace: true});
                    });
                }
            });
        } catch (error) {
            console.error('Failed to save partido', error);
        } finally {
            setFecha(dayjs());
            setEquipoLocal('');
            setEquipoVisitante('');
            setGolesLocal(0);
            setGolesVisitante(0);
            //setResultado('');
        }
    }

    useEffect(() => {
        if(equiposStatus === 'idle') {
            dispatch(fetchEquipos());
        }
    }, [equiposStatus, dispatch])

    useEffect(() => {
        if(jugadoresStatus === 'idle') {
            dispatch(fetchJugadores());
        }
    }   , [jugadoresStatus, dispatch]);

    return (
        <section className="addpartido">
            <h2>Salvar partido</h2>
            <form className="addpartido-form">
                <div className="addpartido-form-fields">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                        <DatePicker 
                            label="Fecha"
                            value={fecha}
                            onChange={onFechaChanged}
                        />
                    </LocalizationProvider>
                    <div className="addpartido-equipo-goles">
                        <FormControl sx={{minWidth: 300}}>
                            <InputLabel id="equipolocal-label">Equipo Local</InputLabel>
                            <Select
                                labelId="equipolocal-label"
                                id="equipolocal"
                                value={equipoLocal}
                                label="Equipo Local"
                                onChange={onEquipoLocalChanged}
                            >
                                {
                                    equipos.map((equipo) => (
                                        <MenuItem key={equipo.id} value={equipo.nombre}>{equipo.nombre}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <Input
                            sx={{width: 200}}
                            size="small"
                            placeholder="Goles equipo local"
                            type="number"
                            onChange={onGolesLocalChanged}
                            inputProps={{
                                min: 0,
                                max: 100,
                            }}
                        />
                    </div>
                    <div className="addpartido-equipo-goles">
                        <FormControl sx={{minWidth: 300}}>
                            <InputLabel id="equipovisitante-label">Equipo Visitante</InputLabel>
                            <Select
                                labelId="equipovisitante-label"
                                id="equipovisitante"
                                value={equipoVisitante}
                                label="Equipo Visitante"
                                onChange={onEquipoVisitanteChanged}
                            >
                                {
                                    equipos.map((equipo) => (
                                        <MenuItem value={equipo.nombre}>{equipo.nombre}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <Input
                            sx={{width: 200 }}
                            size="small"
                            placeholder="Goles equipo local"
                            type="number"
                            onChange={onGolesVisitanteChanged}
                            inputProps={{
                                min: 0,
                                max: 100,
                            }}
                        />
                    </div>
                </div>


                <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="lista jugadores">
                            <TableHead sx={{backgroundColor:'#273237'}}>
                                <TableRow>
                                    <TableCell align="center" sx={{color: 'white'}}>Imagen</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Nombre</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Apellido</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Convocado</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Lesionado</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Min Jugados</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Goles</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Asistencias</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Tarjetas Amarillas</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Tarjetas Rojas</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Valoración</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {jugadoresEnEquipos.length > 0 && jugadoresEnEquipos.map((jugador) => (
                                    <TableRow
                                        key={jugador.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>
                                            <Avatar src={imgUrl + jugador.foto} />
                                        </TableCell>
                                        <TableCell align="center">{jugador.nombre}</TableCell>
                                        <TableCell align="center">{jugador.apellido}</TableCell>
                                        <TableCell align="center">
                                            <FormControl sx={{minWidth: 100}}>
                                                <Select
                                                    labelId="convocado-label"
                                                    id="convocado"
                                                    defaultValue={'Si'}
                                                    label="Convocado"
                                                    onChange={(e) => onConvocadoChanged(e, jugador.id)}
                                                >
                                                    <MenuItem value="Si">Si</MenuItem>
                                                    <MenuItem value="No">No</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="center">
                                            <FormControl sx={{minWidth: 100}}>
                                                <Select
                                                    labelId="lesionado-label"
                                                    id="lesionado"
                                                    label="Lesionado"
                                                    defaultValue={'No'}
                                                    onChange={(e) => onLesionadoChanged(e, jugador.id)}
                                                >
                                                    <MenuItem value="Si">Si</MenuItem>
                                                    <MenuItem value="No">No</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Input
                                                sx={{minWidth: 100}}
                                                defaultValue={0}
                                                size="small"
                                                type="number"
                                                inputProps={{min: 0, max: 120, step: 1}}
                                                onChange={(e) => onMinJugadosChanged(e, jugador.id)}
                                            >
                                            </Input>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Input
                                                sx={{minWidth: 100}}
                                                size="small"
                                                type="number"
                                                defaultValue={0}
                                                inputProps={{min: 0, max: 20, step: 1}}
                                                onChange={(e) => onGolesChanged(e, jugador.id)}
                                            >
                                            </Input>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Input
                                                sx={{minWidth: 100}}
                                                size="small"
                                                type="number"
                                                defaultValue={0}
                                                inputProps={{min: 0, max: 20, step: 1}}
                                                onChange={(e) => onAsistenciasChanged(e, jugador.id)}
                                            >
                                            </Input>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Input
                                                sx={{minWidth: 100}}
                                                size="small"
                                                type="number"
                                                defaultValue={0}
                                                inputProps={{min: 0, max: 2, step: 1}}
                                                onChange={(e) => onTarjetasAmarillasChanged(e, jugador.id)}
                                            >
                                            </Input>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Input
                                                sx={{minWidth: 100}}
                                                size="small"
                                                type="number"
                                                inputProps={{min: 0, max: 1, step: 1}}
                                                defaultValue={0}
                                                onChange={(e) => onTarjetasRojasChanged(e, jugador.id)}
                                            >
                                            </Input>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Input
                                                sx={{minWidth: 100}}
                                                size="small"
                                                type="number"
                                                defaultValue={0}
                                                inputProps={{min: 0, max: 10, step: 1}}
                                                onChange={(e) => onValoracionChanged(e, jugador.id)}
                                            >
                                            </Input>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                




                <div className="addpartido-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onSavePartidoClicked}>Salvar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.gestionPartidos, {replace: true})}>Cancelar</Button>
                </div>
            </form>
        </section>
    )
}

export default AddPartidoForm;