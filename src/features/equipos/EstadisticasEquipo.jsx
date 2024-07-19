import { Avatar, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, FormLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchEquipos, getEquiposStatus, selectAllEquipos } from "./equiposSlice";
import { useEffect, useState } from "react";
import { fetchPartidos, getPartidosStatus, partidoSelected, selectAllPartidos } from "../partidos/partidosSlice";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import './equipos.css';

const EstadisticasEquipo = () => {

    const imgUrl = process.env.REACT_APP_API_STATIC_SERVER + "jugadores/"

    const dispatch = useDispatch();
    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);
    const partidos = useSelector(selectAllPartidos)
    const partidosStatus = useSelector(getPartidosStatus);

    const [equipo, setEquipo] = useState();
    const [fecha, setFecha] = useState();
    const [partidosFiltered, setPartidosFiltered] = useState([]);
    const [partidosSelected, setPartidosSelected] = useState([]);
    const [jtpTotales, setJtpTotales] = useState([]);    

    useEffect(() => {
        if(equiposStatus === 'idle') {
            dispatch(fetchEquipos());
        }
    }
    , [dispatch, equiposStatus]);

    useEffect(() => {
        if(partidosStatus === 'idle') {
            dispatch(fetchPartidos());
        }
    }
    , [dispatch, partidosStatus]);

    useEffect(() => {
        if(partidosFiltered.length > 0) {
            const jtpTotales = [];
            partidosFiltered.filter((p, i) => partidosSelected[i]).forEach(partido => {
                partido.jugadorToPartidos.forEach(jtp => {
                        const jtpEncontrado = jtpTotales.find(j => j.jugador.id === jtp.jugador.id);
                        if(jtpEncontrado) {
                            jtpEncontrado.minJugados += jtp.minJugados;
                            jtpEncontrado.partidosConvocado += jtp.convocado ? 1 : 0;
                            jtpEncontrado.partidosNoConvocado += jtp.convocado ? 0 : 1;
                            jtpEncontrado.partidosLesionado += jtp.lesionado ? 1 : 0;
                            jtpEncontrado.goles += jtp.goles;
                            jtpEncontrado.asistencias += jtp.asistencias;
                            jtpEncontrado.tarjetasAmarillas += jtp.tarjetasAmarillas;
                            jtpEncontrado.tarjetasRojas += jtp.tarjetasRojas;
                            jtpEncontrado.valoracion += jtp.valoracion;
                        } else {
                            jtpTotales.push({
                                jugador: jtp.jugador,
                                minJugados: jtp.minJugados,
                                partidosConvocado: jtp.convocado ? 1 : 0,
                                partidosNoConvocado: jtp.convocado ? 0 : 1,
                                partidosLesionado: jtp.lesionado ? 1 : 0,
                                goles: jtp.goles,
                                asistencias: jtp.asistencias,
                                tarjetasAmarillas: jtp.tarjetasAmarillas,
                                tarjetasRojas: jtp.tarjetasRojas,
                                valoracion: jtp.valoracion
                            });
                        }
                })
            })
            setJtpTotales(jtpTotales);
        } else {
            setJtpTotales([]);
        
        }
    }
    , [partidosFiltered, partidosSelected]);

    const onChangeEquipo = (e) => {
        const selectedEquipo = e.target.value;
        let partidosFiltered = [];
        let partidosSelected = [];
        setEquipo(selectedEquipo);
        partidosFiltered = partidos.filter(partido => (partido.equipoLocal.id === selectedEquipo.id) || (partido.equipoVisitante.id === selectedEquipo.id));
        partidosFiltered.forEach(p => partidosSelected.push(true));
        setPartidosFiltered(partidosFiltered);
        setPartidosSelected(partidosSelected);
        setFecha('');
    }

    const onChangeFecha = (e) => {
        let newFecha = e.target.value;
        let pSel = [];
        partidosFiltered.forEach((p, i) => {
            !newFecha ? pSel[i] = true : (p.fecha === newFecha ? pSel[i] = true : pSel[i] = false);
        });
        setPartidosSelected(pSel);
        setFecha(newFecha);
    }

    const handlePartidosSelected = (index) => {
        let pSel = [];
        partidosSelected.forEach((p, i) => pSel[i] = i === index ? !partidosSelected[i] : partidosSelected[i]);
        setPartidosSelected(pSel);
        setFecha('');
    }

    return (
        <section className="estadisticas-equipo">
            <h2>Estadísticas de equipo</h2>
            <div className="estadisticas-equipo-filtros">
                <FormControl sx={{ width: 300}}>
                    <InputLabel id="equipo-label">Equipo</InputLabel>
                    <Select
                        labelId="equipo-label"
                        id="equipo"
                        label="Equipo"
                        value={equipo || ''}
                        onChange={onChangeEquipo}
                        displayEmpty
                    >
                        <MenuItem value="" sx={{ height: 36 }}></MenuItem>
                        {equipos && Array.isArray(equipos) && equipos.map(e => <MenuItem key={e.id} value={e}>{e.nombre}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormGroup sx={{ width: 300, paddingLeft: 1, display: 'flex', flexDirection: 'row', columnGap: 2, borderWidth: 1, borderColor: 'lightgray', borderStyle: 'solid', borderRadius: 1}}>
                    {
                        partidosFiltered.length === 0 && <p>Seleccionar Jornada</p>
                    }
                    {
                        partidosFiltered && partidosFiltered.sort((a, b) => dayjs(a.fecha).valueOf() - dayjs(b.fecha).valueOf()).map((p, i) => 
                            <FormControlLabel control={<Checkbox checked={partidosSelected[i]} onChange={() => handlePartidosSelected(i)}/>} label={`J${i+1} ${dayjs(p.fecha).format('DD/MM/YY')}`} />
                        )
                    }
                </FormGroup>
                <FormControl sx={{ width: 300}}>
                    <InputLabel id="fecha-label">Fecha</InputLabel>
                    <Select
                        labelId="fecha-label"
                        id="fecha"
                        label="Fecha"
                        value={fecha || ''}
                        displayEmpty
                        onChange={(e) => {
                            onChangeFecha(e);
                        }}
                    >
                        <MenuItem value="" sx={{ height: 36 }}></MenuItem>
                        {equipo && partidosFiltered.sort((a, b) => dayjs(a.fecha).valueOf() - dayjs(b.fecha).valueOf()).map(p => <MenuItem key={p.id} value={p.fecha}>{dayjs(p.fecha).format('DD/MM/YYYY')}</MenuItem>)}
                    </Select>
                </FormControl>
            </div>
            {jtpTotales.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}}>
                        <TableHead sx={{backgroundColor:'#273237'}}>
                            <TableRow>
                                <TableCell align="center" sx={{color: 'white'}}></TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>Nombre</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>Apellidos</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>Min</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>Conv</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>No Conv</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>Les</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>Goles</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>Asistencias</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>TA</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>TR</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>Val</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jtpTotales && jtpTotales.map(jtp => (
                                <TableRow
                                    key={jtp.jugador.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center" sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                        <Avatar src={imgUrl + jtp.jugador.foto} />
                                    </TableCell>
                                    <TableCell align="center">{jtp.jugador.nombre}</TableCell>
                                    <TableCell align="center">{jtp.jugador.apellido}</TableCell>
                                    <TableCell align="center">{jtp.minJugados}</TableCell>
                                    <TableCell align="center">{jtp.partidosConvocado}</TableCell>
                                    <TableCell align="center">{jtp.partidosNoConvocado}</TableCell>
                                    <TableCell align="center">{jtp.partidosLesionado}</TableCell>
                                    <TableCell align="center">{jtp.goles}</TableCell>
                                    <TableCell align="center">{jtp.asistencias}</TableCell>
                                    <TableCell align="center">{jtp.tarjetasAmarillas}</TableCell>
                                    <TableCell align="center">{jtp.tarjetasRojas}</TableCell>
                                    <TableCell align="center">{jtp.valoracion}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </section>
    )
}

export default EstadisticasEquipo;