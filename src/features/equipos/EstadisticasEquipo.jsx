import { Avatar, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchEquipos, getEquiposStatus, selectAllEquipos } from "./equiposSlice";
import { useEffect, useState } from "react";
import { fetchPartidos, getPartidosStatus, selectAllPartidos } from "../partidos/partidosSlice";
import './equipos.css';

const EstadisticasEquipo = () => {

    const imgUrl = process.env.REACT_APP_API_STATIC_SERVER + "jugadores/"

    const dispatch = useDispatch();
    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);
    const partidos = useSelector(selectAllPartidos)
    const partidosStatus = useSelector(getPartidosStatus);

    const [equipo, setEquipo] = useState();
    const [equipoRival, setEquipoRival] = useState();
    const [fecha, setFecha] = useState();
    const [partidosFiltered, setPartidosFiltered] = useState([]);
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
            partidosFiltered.forEach(partido => {
                partido.jugadorToPartidos.forEach(jtp => {
                    if(!fecha || (partido.fecha === fecha)) {
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
                    }
                })
            })
            setJtpTotales(jtpTotales);
        } else {
            setJtpTotales([]);
        
        }
    }
    , [fecha, partidosFiltered]);

    const onChangeEquipo = (e) => {
        const selectedEquipo = e.target.value;
        let partidosFiltered = [];
        if(!equipoRival || (selectedEquipo.id !== equipoRival.id)) {
            setEquipo(selectedEquipo);
        }
        if(!equipoRival) {
            partidosFiltered = partidos.filter(partido => (partido.equipoLocal.id === selectedEquipo.id) || (partido.equipoVisitante.id === selectedEquipo.id));
            setPartidosFiltered(partidosFiltered);
        } else {
            partidosFiltered = partidos.filter(partido => ((partido.equipoLocal.id === selectedEquipo.id) && (partido.equipoVisitante.id === equipoRival.id)) || ((partido.equipoVisitante.id === selectedEquipo.id) && (partido.equipoLocal.id === equipoRival.id)));
            setPartidosFiltered(partidosFiltered);
        }
    }

    const onChangeEquipoRival = (e) => {
        const selectedEquipoRival = e.target.value;
        let partidosFiltered = [];
        if(equipo && (selectedEquipoRival.id !== equipo.id)) {
            setEquipoRival(selectedEquipoRival);
            partidosFiltered = partidos.filter(partido => ((partido.equipoLocal.id === equipo.id) && (partido.equipoVisitante.id === selectedEquipoRival.id)) || ((partido.equipoVisitante.id === equipo.id) && (partido.equipoLocal.id === selectedEquipoRival.id)));
            setPartidosFiltered(partidosFiltered);
        }
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
                    >
                        {equipos && equipos.map(e => <MenuItem key={e.id} value={e}>{e.nombre}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl sx={{ width: 300}}>
                    <InputLabel id="equipo-rival-label">Equipo rival</InputLabel>
                    <Select
                        labelId="equipo-rival-label"
                        id="equipo-rival"
                        label="Equipo rival"
                        value={equipoRival || ''}
                        onChange={onChangeEquipoRival}
                    >
                        {equipo && equipos && equipos.map(e => <MenuItem key={e.id} value={e}>{e.nombre}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl sx={{ width: 300}}>
                    <InputLabel id="fecha-label">Fecha</InputLabel>
                    <Select
                        labelId="fecha-label"
                        id="fecha"
                        label="Fecha"
                        value={fecha || ''}
                        onChange={(e) => {
                            setFecha(e.target.value)
                        }}
                    >
                        {(equipo && equipoRival) && partidosFiltered.map(p => <MenuItem key={p.id} value={p.fecha}>{p.fecha}</MenuItem>)}
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
                                <TableCell align="center" sx={{color: 'white'}}>Apellido</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>M. Jugados</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>P. Convocados</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>P. No Convocados</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>P. Lesionados</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>Goles</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>Asistencias</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>T. Amarillas</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>T. Rojas</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>Valoracion</TableCell>
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