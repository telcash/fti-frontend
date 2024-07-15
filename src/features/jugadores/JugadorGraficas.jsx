import { useDispatch, useSelector } from "react-redux";
import JugadorAvatar from "./JugadorAvatar";
import { getJugadorSelected } from "./jugadoresSlice";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
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
        if (sesiones.length > 0) {
            setSesionesJugador(sesiones.filter(s => s.jugador.id === jugador.id).sort((a, b) => dayjs(a.fecha).valueOf() - dayjs(b.fecha).valueOf()));
        }
    }
    , [sesiones, jugador]);


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
                        onChange={(e) => setTipoGrafica(e.target.value)}
                    >
                        <MenuItem value="barras">Diagrama de barras</MenuItem>
                        {/* <MenuItem value="lineal">Gráfica lineal</MenuItem> */}
                        <MenuItem value="circular">Gráfica circular</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ width: 300}}>
                    <InputLabel id="sesiones-numero-label">Sesión</InputLabel>
                    <Select
                        labelId="sesiones-numero-label"
                        id="sesiones-numero"
                        label="Sesión"
                        value={selectedSesion || ''}
                        onChange={(e) => setSelectedSesion(e.target.value)}
                    >
                        {sesionesJugador && sesionesJugador.map((sesion, index) => (
                            <MenuItem
                                key={sesion.index}
                                value={sesion}
                                onChange={(e) => setSelectedSesion(e.target.value)}
                            >
                                {index + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
                            selectedSesion && selectedSesion.ejercicios.map(ejercicio => (
                                <MenuItem
                                    key={ejercicio.fundamento.id}
                                    value={ejercicio.fundamento.nombre}
                                >
                                    {ejercicio.fundamento.nombre}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </div>
            <div className="jugador-graficas-grafica">
                {tipoGrafica === 'barras' && selectedSesion && fundamento &&
                    <BarChart
                        dataset={selectedSesion.ejercicios.filter(ejercicio => ejercicio.fundamento.tipo === fundamento).map(ejercicio => {
                            return {
                                valorIdeal: ejercicio.valoracionMaxima,
                                valorObtenido: ejercicio.valoracion,
                                fundamento: ejercicio.fundamento.nombre,
                            }
                        })}
                        xAxis={[{ scaleType: 'band', dataKey: 'fundamento' }]}
                        series={[
                            { dataKey: 'valorIdeal', label: 'Valor Ideal'},
                            { dataKey: 'valorObtenido', label: 'Valor Obtenido'}
                        ]}
                        width={GRAPH_WIDTH}
                        height={GRAPH_HEIGHT}
                    />
                }
                {/* {tipoGrafica === 'lineal' && selectedSesion && fundamento &&
                    <h3>Gráfica lineal</h3>
                } */}
                {tipoGrafica === 'circular' && selectedSesion && fundamento &&
                    <PieChart
                        series={[
                            {
                                data: [
                                    {
                                        id: 0,
                                        value: selectedSesion.ejercicios.filter(ejercicio => ejercicio.fundamento.nombre === fundamento).map(ejercicio => ejercicio.valoracion).reduce((acc, val) => acc + val, 0),
                                        label: `${fundamento} (A favor)`
                                    },
                                    {
                                        id: 1,
                                        value: selectedSesion.ejercicios.filter(ejercicio => ejercicio.fundamento.nombre === fundamento).map(ejercicio => ejercicio.valoracionMaxima - ejercicio.valoracion).reduce((acc, val) => acc + val, 0),
                                        label: `${fundamento} (En contra)`
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