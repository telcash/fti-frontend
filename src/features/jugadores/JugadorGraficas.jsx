import { useDispatch, useSelector } from "react-redux";
import JugadorAvatar from "./JugadorAvatar";
import { getJugadorSelected } from "./jugadoresSlice";
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select } from "@mui/material";
import { paths, router } from "../../router/router";
import { fetchSesiones, getSesionesStatus, selectAllSesiones } from "../sesion-individual/sesionIndividualSlice";
import { useEffect, useState } from "react";
import './jugadores.css';
import dayjs from "dayjs";
import { BarChart, PieChart } from "@mui/x-charts";

const GRAPH_WIDTH = 700;
const GRAPH_HEIGHT = 400;

const JugadorGraficas = () => {

    const dispatch = useDispatch();

    const jugador = useSelector(getJugadorSelected);
    const sesiones = useSelector(selectAllSesiones);
    const sesionesStatus = useSelector(getSesionesStatus);

    const [sesionesJugador, setSesionesJugador] = useState([]);
    const [sesionesSelected, setSesionesSelected] = useState([]);
    const [ejTotales, setEjTotales] = useState([]);
    const [tipoGrafica, setTipoGrafica] = useState();
    const [fundamento, setFundamento] = useState('');
    const [selectedSesion, setSelectedSesion] = useState();

    useEffect(() => {
        if(sesionesStatus === 'idle') {
            dispatch(fetchSesiones());
        }
    }
    , [dispatch, sesionesStatus]);

    useEffect(() => {
        let sJug = [];
        let sSel = [];
        if (sesiones.length > 0) {
            sJug = sesiones.filter(s => s.jugador.id === jugador.id).sort((a, b) => dayjs(a.fecha).valueOf() - dayjs(b.fecha).valueOf());
            setSesionesJugador(sJug);
        }
        sJug.forEach(s => sSel.push(false));
        setSesionesSelected(sSel);
    }
    , [sesiones, jugador]);

    useEffect(() => {
        const ejerciciosTotales = [];
        if (sesionesJugador.length > 0) {
            sesionesJugador.filter((s, i) => sesionesSelected[i]).forEach(sesion => {
                sesion.ejercicios.forEach(ej => {
                    const ejercicioEncontrado = ejerciciosTotales.find(e => e.fundamentoId === ej.fundamentoId);
                    if (ejercicioEncontrado) {
                        ejercicioEncontrado.valoracionMaxima += ej.valoracionMaxima;
                        ejercicioEncontrado.valoracion += ej.valoracion;
                    } else {
                        ejerciciosTotales.push({
                            fundamentoNombre: ej.fundamento.nombre,
                            fundamentoTipo: ej.fundamento.tipo,
                            valoracionMaxima: ej.valoracionMaxima,
                            valoracion: ej.valoracion,
                        })
                    }
                })
            })
        } 
        setEjTotales(ejerciciosTotales);
    }, [sesionesJugador, sesionesSelected])

    const handleSesionesSelected = (index) => {
        let sSel = [];
        sesionesSelected.forEach((s, i) => sSel[i] = i === index ? !sesionesSelected[i] : sesionesSelected[i]);
        setSesionesSelected(sSel);
    }

    const resetSesionesSelected = () => {
        let sSel = [];
        sesionesJugador.forEach(() => sSel.push(false));
        setSesionesSelected(sSel);
    }

    return (
        <section className="jugador-graficas">
            <h2>Gráficas</h2>
            <JugadorAvatar jugador={jugador} />
            <div className="jugador-graficas-filtros">
                <FormControl sx={{ width: 300}}>
                    <InputLabel id="tipo-graficas-label">Tipo de Gráfica</InputLabel>
                    <Select
                        labelId="tipo-graficas-label"
                        id="tipo-graficas"
                        label="Tipo de Gráfica"
                        value={tipoGrafica || ''}
                        onChange={(e) => {
                            setTipoGrafica(e.target.value);
                            setFundamento('');
                            resetSesionesSelected();
                        }}
                    >
                        <MenuItem value="barras">Diagrama de barras</MenuItem>
                        <MenuItem value="circular">Gráfica circular</MenuItem>
                    </Select>
                </FormControl>
                <FormGroup sx={{ width: 300, paddingLeft: 1, display: 'flex', flexDirection: 'row', columnGap: 2, borderWidth: 1, borderColor: 'lightgray', borderStyle: 'solid', borderRadius: 1}}>
                    {
                        sesionesJugador.length === 0 && <p>Seleccionar Jornada</p>
                    }
                    {
                        sesionesJugador && sesionesJugador.sort((a, b) => dayjs(a.fecha).valueOf() - dayjs(b.fecha).valueOf()).map((s, i) => 
                            <FormControlLabel control={<Checkbox checked={sesionesSelected[i]} onChange={() => handleSesionesSelected(i)}/>} label={`J${i+1} ${dayjs(s.fecha).format('DD/MM/YY')}`} />
                        )
                    }
                </FormGroup>
               {/*  <FormControl sx={{ width: 300}}>
                    <InputLabel id="sesiones-numero-label">Jornada</InputLabel>
                    <Select
                        labelId="sesiones-numero-label"
                        id="sesiones-numero"
                        label="Sesión"
                        value={selectedSesion || ''}
                        onChange={(e) => setSelectedSesion(e.target.value)}
                    >
                        {sesionesJugador && Array.isArray(sesionesJugador) && sesionesJugador.map((sesion, index) => (
                            <MenuItem
                                key={sesion.index}
                                value={sesion}
                                onChange={(e) => setSelectedSesion(e.target.value)}
                            >
                                {index + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl> */}
                <FormControl sx={{ width: 300}}>
                    <InputLabel id="fundamento-label">Fundamento</InputLabel>
                    <Select
                        labelId="fundamento-label"
                        id="fundamento"
                        label="Fundamento"
                        value={fundamento || ''}
                        onChange={(e) => setFundamento(e.target.value)}
                    >
                        {tipoGrafica === 'barras' && 
                            <MenuItem value="Defensivo">Defensivo</MenuItem>
                        }
                        {tipoGrafica === 'barras' && 
                            <MenuItem value="Ofensivo">Ofensivo</MenuItem>
                        }
                        {tipoGrafica === 'circular' &&
                            ejTotales && ejTotales.map((ejercicio, index) => (
                                <MenuItem
                                    key={index}
                                    value={ejercicio.fundamentoNombre}
                                >
                                    {ejercicio.fundamentoNombre}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </div>
            <div className="jugador-graficas-grafica">
                {tipoGrafica === 'barras' && sesionesSelected && fundamento &&
                    <BarChart
                        dataset={ejTotales.filter(ejercicio => ejercicio.fundamentoTipo === fundamento).map(ejercicio => {
                            return {
                                totales: ejercicio.valoracionMaxima,
                                aciertos: ejercicio.valoracion,
                                fundamento: ejercicio.fundamentoNombre,
                            }
                        })}
                        xAxis={[{ scaleType: 'band', dataKey: 'fundamento' }]}
                        series={[
                            { dataKey: 'totales', label: 'Totales'},
                            { dataKey: 'aciertos', label: 'Aciertos'}
                        ]}
                        width={GRAPH_WIDTH}
                        height={GRAPH_HEIGHT}
                    />
                }
                {tipoGrafica === 'circular' && sesionesSelected && fundamento &&
                    <PieChart
                        series={[
                            {
                                data: [
                                    {
                                        id: 0,
                                        value: ejTotales.filter(ejercicio => ejercicio.fundamentoNombre === fundamento).map(ejercicio => ejercicio.valoracion).reduce((acc, val) => acc + val, 0),
                                        label: `${fundamento} (Aciertos)`
                                    },
                                    {
                                        id: 1,
                                        value: ejTotales.filter(ejercicio => ejercicio.fundamentoNombre === fundamento).map(ejercicio => ejercicio.valoracionMaxima - ejercicio.valoracion).reduce((acc, val) => acc + val, 0),
                                        label: `${fundamento} (Errores)`
                                    }
                                ],
                                cx: 200,
                            }
                        ]}
                        width={GRAPH_WIDTH}
                        height={GRAPH_HEIGHT} 
                    />
                }
            </div>
            <div>
                <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={() => router.navigate(paths.graficas, {replace: true})}>Regresar</Button>
            </div>
        </section>
    )
}

export default JugadorGraficas;