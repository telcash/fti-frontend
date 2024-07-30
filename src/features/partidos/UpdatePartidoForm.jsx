import { useDispatch, useSelector } from "react-redux";
import { fetchEquipos, getEquiposStatus, selectAllEquipos } from "../equipos/equiposSlice";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getPartidoSelected, updatePartido } from "./partidosSlice";
import { paths, router } from "../../router/router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Avatar, Button, FormControl, Input, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { fetchJugadorToPartidos, updateJugadorToPartido } from "../jugador-to-partido/jugadorToPartidoSlice";
import './partidos.css';

const imgUrl = process.env.REACT_APP_API_STATIC_SERVER + "jugadores/";

const UpdatePartidoForm = () => {
    const dispatch = useDispatch();

    const partido = useSelector(getPartidoSelected);

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);

    const [fecha, setFecha] = useState(dayjs(partido.fecha));
    const [equipoLocal, setEquipoLocal] = useState(partido.equipoLocal.nombre);
    const [equipoVisitante, setEquipoVisitante] = useState(partido.equipoVisitante.nombre);
    const [golesLocal, setGolesLocal] = useState(partido.golesLocal);
    const [golesVisitante, setGolesVisitante] = useState(partido.golesVisitante);
    const [jugadoresToPartido, setJugadoresToPartido] = useState([]);

    const onConvocadoChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorToPartidoId === id) {
                return {...jtp, convocado: e.target.value === 'Si' ? true : false}
            }
            return jtp;
        });
        setJugadoresToPartido(updatedJtp);
    }

    const onLesionadoChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorToPartidoId === id) {
                return {...jtp, lesionado: e.target.value === 'Si' ? true : false}
            }
            return jtp;
        });
        setJugadoresToPartido(updatedJtp)
    }

    const onTitularChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorToPartidoId === id) {
                return {...jtp, titular: e.target.value === 'Si' ? true : false}
            }
            return jtp;
        });
        setJugadoresToPartido(updatedJtp)
    }

    const onMinJugadosChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorToPartidoId === id) {
                return {...jtp, minJugados: e.target.value}
            }
            return jtp;
        })
        setJugadoresToPartido(updatedJtp);
    }

    const onGolesChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorToPartidoId === id) {
                return {...jtp, goles: e.target.value}
            }
            return jtp;
        })
        setJugadoresToPartido(updatedJtp);
    }

    const onAsistenciasChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorToPartidoId === id) {
                return {...jtp, asistencias: e.target.value}
            }
            return jtp;
        })
        setJugadoresToPartido(updatedJtp);
    }

    const onTarjetasAmarillasChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorToPartidoId === id) {
                return {...jtp, tarjetasAmarillas: e.target.value}
            }
            return jtp;
        })
        setJugadoresToPartido(updatedJtp);
    }

    const onTarjetasRojasChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorToPartidoId === id) {
                return {...jtp, tarjetasRojas: e.target.value}
            }
            return jtp;
        })
        setJugadoresToPartido(updatedJtp);
    }

    const onValoracionChanged = (e, id) => {
        const updatedJtp = jugadoresToPartido.map(jtp => {
            if(jtp.jugadorToPartidoId === id) {
                return {...jtp, valoracion: e.target.value}
            }
            return jtp;
        })
        setJugadoresToPartido(updatedJtp);
    }

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

    const onUpdatePartidoClicked = () => {
        try {
            dispatch(updatePartido(
                {
                    id: partido.id,
                    partido: {
                        fecha: fecha,
                        golesLocal: golesLocal,
                        golesVisitante: golesVisitante,
                        equipoLocalId: equipos.filter(equipo => equipo.nombre === equipoLocal)[0].id,
                        equipoVisitanteId: equipos.filter(equipo => equipo.nombre === equipoVisitante)[0].id
                    }
                }
            ))
            .then(() => {
                const jtpPromises = jugadoresToPartido.map(jtp => dispatch(updateJugadorToPartido(
                    {
                        id: jtp.jugadorToPartidoId,
                        jugadorToPartido: {
                            convocado: jtp.convocado,
                            lesionado: jtp.lesionado,
                            minJugados: jtp.minJugados,
                            titular: jtp.titular,
                            goles: jtp.goles,
                            asistencias: jtp.asistencias,
                            tarjetasAmarillas: jtp.tarjetasAmarillas,
                            tarjetasRojas: jtp.tarjetasRojas,
                            valoracion: jtp.valoracion
                        }
                    }
                )));
                Promise.all(jtpPromises).then(() => {
                    router.navigate(paths.gestionPartidos, {replace: true});
                })
            })
        } catch (error) {
            console.error('Failed to save partido', error);
        }
    }

    useEffect(() => {
        if(equiposStatus === 'idle') {
            dispatch(fetchEquipos());
        }
    }, [equiposStatus, dispatch])

    useEffect(() => {
        dispatch(fetchJugadorToPartidos())
            .then((response) => {
                setJugadoresToPartido(response.payload.filter(jtp => jtp.partido.id === partido.id));
            })
    }, [dispatch, partido.id])

    
    return (
        <section className="addpartido">
            <h2>Actualizar partido</h2>
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
                                    equipos && Array.isArray(equipos) && equipos.map((equipo) => (
                                        <MenuItem value={equipo.nombre}>{equipo.nombre}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <Input
                            sx={{width: 200}}
                            value={partido.golesLocal || 0}
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
                                    equipos && Array.isArray(equipos) && equipos.map((equipo) => (
                                        <MenuItem value={equipo.nombre}>{equipo.nombre}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <Input
                            sx={{width: 200}}
                            value={partido.golesVisitante || 0}
                            size="small"
                            placeholder="Goles equipo visitante"
                            type="number"
                            onChange={onGolesVisitanteChanged}
                            inputProps={{
                                min: 0,
                                max: 100,
                            }}
                        />
                    </div>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="lista jugadores">
                            <TableHead sx={{backgroundColor:'#273237'}}>
                                <TableRow>
                                    <TableCell align="center" sx={{color: 'white'}}>Imagen</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Nombre</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Apellido</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Conv</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Les</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Min</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>PT</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Goles</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Asistencias</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>TA</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>TR</TableCell>
                                    <TableCell align="center" sx={{color: 'white'}}>Val</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {jugadoresToPartido && Array.isArray(jugadoresToPartido) && jugadoresToPartido.map((jtp) => (
                                    <TableRow
                                        key={jtp.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>
                                            <Avatar src={imgUrl + jtp.jugador.foto} />
                                        </TableCell>
                                        <TableCell align="center">{jtp.jugador.nombre}</TableCell>
                                        <TableCell align="center">{jtp.jugador.apellido}</TableCell>
                                        <TableCell align="center">
                                            <FormControl sx={{minWidth: 100}}>
                                                <Select
                                                    labelId="convocado-label"
                                                    id="convocado"
                                                    value={jtp.convocado ? 'Si' : 'No'}
                                                    label="Convocado"
                                                    onChange={(e) => onConvocadoChanged(e, jtp.jugadorToPartidoId)}
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
                                                    value={jtp.lesionado ? 'Si' : 'No'}
                                                    label="Lesionado"
                                                    onChange={(e) => onLesionadoChanged(e, jtp.jugadorToPartidoId)}
                                                >
                                                    <MenuItem value="Si">Si</MenuItem>
                                                    <MenuItem value="No">No</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Input
                                                sx={{minWidth: 100}}
                                                size="small"
                                                type="number"
                                                value={jtp.minJugados}
                                                inputProps={{min: 0, max: 120, step: 1}}
                                                onChange={(e) => onMinJugadosChanged(e, jtp.jugadorToPartidoId)}
                                            >
                                            </Input>
                                        </TableCell>
                                        <TableCell align="center">
                                            <FormControl sx={{minWidth: 100}}>
                                                <Select
                                                    labelId="titular-label"
                                                    id="titular"
                                                    value={jtp.titular ? 'Si' : 'No'}
                                                    label="PT"
                                                    onChange={(e) => onTitularChanged(e, jtp.jugadorToPartidoId)}
                                                >
                                                    <MenuItem value="Si">Si</MenuItem>
                                                    <MenuItem value="No">No</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Input
                                                sx={{minWidth: 100}}
                                                size="small"
                                                type="number"
                                                value={jtp.goles}
                                                inputProps={{min: 0, max: 20, step: 1}}
                                                onChange={(e) => onGolesChanged(e, jtp.jugadorToPartidoId)}
                                            >
                                            </Input>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Input
                                                sx={{minWidth: 100}}
                                                size="small"
                                                type="number"
                                                value={jtp.asistencias}
                                                inputProps={{min: 0, max: 20, step: 1}}
                                                onChange={(e) => onAsistenciasChanged(e, jtp.jugadorToPartidoId)}
                                            >
                                            </Input>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Input
                                                sx={{minWidth: 100}}
                                                size="small"
                                                type="number"
                                                value={jtp.tarjetasAmarillas}
                                                inputProps={{min: 0, max: 2, step: 1}}
                                                onChange={(e) => onTarjetasAmarillasChanged(e, jtp.jugadorToPartidoId)}
                                            >
                                            </Input>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Input
                                                sx={{minWidth: 100}}
                                                size="small"
                                                type="number"
                                                value={jtp.tarjetasRojas}
                                                inputProps={{min: 0, max: 1, step: 1}}
                                                onChange={(e) => onTarjetasRojasChanged(e, jtp.jugadorToPartidoId)}
                                            >
                                            </Input>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Input
                                                sx={{minWidth: 100}}
                                                size="small"
                                                type="number"
                                                value={jtp.valoracion}
                                                inputProps={{min: 0, max: 10, step: 1}}
                                                onChange={(e) => onValoracionChanged(e, jtp.jugadorToPartidoId)}
                                            >
                                            </Input>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className="addpartido-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onUpdatePartidoClicked}>Actualizar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.gestionPartidos, {replace: true})}>Cancelar</Button>
                </div>
            </form>
        </section>
    )
}

export default UpdatePartidoForm;