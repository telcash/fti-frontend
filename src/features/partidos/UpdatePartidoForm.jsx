import { useDispatch, useSelector } from "react-redux";
import { fetchEquipos, getEquiposStatus, selectAllEquipos } from "../equipos/equiposSlice";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getPartidoSelected, updatePartido } from "./partidosSlice";
import { paths, router } from "../../router/router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { fetchJugadorToPartidos } from "../jugador-to-partido/jugadorToPartidoSlice";
import './partidos.css';

const UpdatePartidoForm = () => {
    const dispatch = useDispatch();

    const partido = useSelector(getPartidoSelected);

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);

    const [fecha, setFecha] = useState(dayjs(partido.fecha));
    const [equipoLocal, setEquipoLocal] = useState(partido.equipoLocal.nombre);
    const [equipoVisitante, setEquipoVisitante] = useState(partido.equipoVisitante.nombre);
    const [resultado, setResultado] = useState(partido.resultado);
    const [jugadoresToPartido, setJugadoresToPartido] = useState([])

    const onFechaChanged = e => setFecha(e);
    const onEquipoLocalChanged = e => setEquipoLocal(e.target.value);
    const onEquipoVisitanteChanged = e => setEquipoVisitante(e.target.value);
    const onResultadoChanged = e => setResultado(e.target.value);

    const onSavePartidoClicked = () => {
        try {
            dispatch(updatePartido(
                {
                    id: 1,
                    partido: {
                        fecha: fecha,
                        resultado: resultado,
                        equipoLocalId: equipos.filter(equipo => equipo.nombre === equipoLocal)[0].id,
                        equipoVisitanteId: equipos.filter(equipo => equipo.nombre === equipoVisitante)[0].id
                    }
                }
            ));
            router.navigate(paths.gestionPartidos, {replace: true});
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
                    setJugadoresToPartido(response.payload.filter(jtp => jtp.partidoId === partido.id));
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
                                    <MenuItem value={equipo.nombre}>{equipo.nombre}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
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
                    <TextField
                        id="resultado"
                        label="Resultado"
                        value={resultado}
                        onChange={onResultadoChanged} 
                        sx={{minWidth: 300}}
                    />
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
                        </Table>
                    </TableContainer>
                </div>
                <div className="addpartido-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onSavePartidoClicked}>Actualizar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.gestionPartidos, {replace: true})}>Cancelar</Button>
                </div>
            </form>
        </section>
    )
}

export default UpdatePartidoForm;