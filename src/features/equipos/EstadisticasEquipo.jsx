import { Avatar, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, FormLabel, Button } from "@mui/material";
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
    const [jornadasOpen, setJornadasOpen] = useState(false);

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
                if (partido.jugadorToPartidos) {
                    partido.jugadorToPartidos.forEach(jtp => {
                            const jtpEncontrado = jtpTotales.find(j => j.jugador.id === jtp.jugador.id);
                            if(jtpEncontrado) {
                                jtpEncontrado.minJugados += jtp.minJugados;
                                jtpEncontrado.partidosJugados += jtp.minJugados > 0 ? 1 : 0;
                                jtpEncontrado.partidosTitular += jtp.titular ? 1 : 0;
                                jtpEncontrado.partidosSuplente = jtpEncontrado.partidosJugados - jtpEncontrado.partidosTitular;
                                jtpEncontrado.partidosConvocado += jtp.convocado ? 1 : 0;
                                jtpEncontrado.partidosNoConvocado += jtp.convocado ? 0 : 1;
                                jtpEncontrado.partidosLesionado += jtp.lesionado ? 1 : 0;
                                jtpEncontrado.goles += jtp.goles;
                                jtpEncontrado.asistencias += jtp.asistencias;
                                jtpEncontrado.tarjetasAmarillas += jtp.tarjetasAmarillas;
                                jtpEncontrado.tarjetasRojas += jtp.tarjetasRojas;
                                jtpEncontrado.valoracion = jtp.minJugados > 0 ? (jtpEncontrado.valoracion * (jtpEncontrado.partidosJugados - 1) + jtp.valoracion)/jtpEncontrado.partidosJugados : jtpEncontrado.valoracion;
                            } else {
                                jtpTotales.push({
                                    jugador: jtp.jugador,
                                    minJugados: jtp.minJugados,
                                    partidosJugados: jtp.minJugados > 0 ? 1 : 0,
                                    partidosTitular: jtp.titular ? 1 : 0,
                                    partidosSuplente: jtp.titular ? 0 : 1,
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
                }
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
                {!jornadasOpen && <FormControl sx={{ width: 300}}>
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
                </FormControl>}
                {   jornadasOpen &&
                    <FormGroup sx={{minHeight: 56, paddingLeft: 1, display: 'flex', flexDirection: 'row', columnGap: 2, borderWidth: 1, borderColor: 'lightgray', borderStyle: 'solid', borderRadius: 1}}>
                        {
                            partidosFiltered && partidosFiltered.sort((a, b) => dayjs(a.fecha).valueOf() - dayjs(b.fecha).valueOf()).map((p, i) => 
                                <FormControlLabel control={<Checkbox checked={partidosSelected[i]} onChange={() => handlePartidosSelected(i)}/>} label={`J${i+1} ${dayjs(p.fecha).format('DD/MM/YY')}`} />
                            )
                        }
                        <Button sx={{color: 'red'}} onClick={() => setJornadasOpen(false)}>X</Button>
                    </FormGroup>
                }
                {   !jornadasOpen &&
                    <Button 
                    variant="outlined"
                    sx={{ 
                        width: 300,
                        height: 56,
                        borderColor: 'rgba(0, 0, 0, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(0, 0, 0, 0.6)',
                        textTransform: 'none',
                        fontFeatureSettings: 'normal',
                        fontFamily: 'Roboto!important',
                        fontWeight: '400!important',
                        letterSpacing: 0.15,
                        lineHeight: 23,
                        textSizeAdjust: '100%',
                        fontSize: '16px!important'
                    }}
                    onClick={() => {
                        if (equipo && partidosFiltered.length > 0) {
                            setJornadasOpen(true)
                        }
                    }}
                    >
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'center'}}>
                            <p style={{ margin: 0, flex: 3, textAlign: 'left'}}>Jornadas</p>
                            <div style={{flex: 1, textAlign: 'right', lineHeight: '56px', fontSize: '8px'}}>▼</div>
                        </div>
                    </Button>
                }
                {!jornadasOpen && 
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
                }
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
                                <TableCell align="center" sx={{color: 'white'}}>PJ</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>PT</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>PS</TableCell>
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
                                    <TableCell align="center">{jtp.partidosJugados}</TableCell>
                                    <TableCell align="center">{jtp.partidosTitular}</TableCell>
                                    <TableCell align="center">{jtp.partidosSuplente}</TableCell>
                                    <TableCell align="center">{jtp.partidosConvocado}</TableCell>
                                    <TableCell align="center">{jtp.partidosNoConvocado}</TableCell>
                                    <TableCell align="center">{jtp.partidosLesionado}</TableCell>
                                    <TableCell align="center">{jtp.goles}</TableCell>
                                    <TableCell align="center">{jtp.asistencias}</TableCell>
                                    <TableCell align="center">{jtp.tarjetasAmarillas}</TableCell>
                                    <TableCell align="center">{jtp.tarjetasRojas}</TableCell>
                                    <TableCell align="center">{jtp.valoracion.toFixed(1)}</TableCell>
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