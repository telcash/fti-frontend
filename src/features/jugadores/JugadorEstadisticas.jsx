import { useDispatch, useSelector } from "react-redux";
import { getJugadorSelected } from "./jugadoresSlice";
import './jugadores.css';
import { fetchJugadorToPartidos, selectAllJugadorToPartidos } from "../jugador-to-partido/jugadorToPartidoSlice";
import { useEffect, useState } from "react";
import JugadorAvatar from "./JugadorAvatar";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { Button } from "@mui/material";
import { paths, router } from "../../router/router";

const GRAPH_WIDTH = 350;
const GRAPH_HEIGHT = 200;

const JugadorEstadisticas = () => {

    const dispatch = useDispatch();

    const jugador = useSelector(getJugadorSelected);
    const jugadorToPartidos = useSelector(selectAllJugadorToPartidos);

    const [jugadorSelectedToPartidos, setJugadorSelectedToPartidos] = useState([]);

    const [minutos, setMinutos] = useState(0);
    const [convocado, setConvocado] = useState(0);
    const [noConvocado, setNoConvocado] = useState(0);
    const [lesionado, setLesionado] = useState(0);
    const [goles, setGoles] = useState(0);
    const [asistencias, setAsistencias] = useState(0);
    const [tarjetasAmarillas, setTarjetasAmarillas] = useState(0);
    const [tarjetasRojas, setTarjetasRojas] = useState(0);
    const [valoracion, setValoracion] = useState(0);

    useEffect(() => {
        dispatch(fetchJugadorToPartidos());
    }
    , [dispatch]);

    useEffect(() => {
        if (jugadorToPartidos.length > 0) {
            setJugadorSelectedToPartidos(jugadorToPartidos.filter(jtp => jtp.jugador.id === jugador.id));
        }
    }
    , [jugadorToPartidos, jugador]);

    useEffect(() => {
        if (jugadorSelectedToPartidos.length > 0) {
            setMinutos(jugadorSelectedToPartidos.reduce((acc, jtp) => acc + jtp.minJugados, 0));
            setConvocado(jugadorSelectedToPartidos.filter(jtp => jtp.convocado).length);
            setNoConvocado(jugadorSelectedToPartidos.filter(jtp => !jtp.convocado).length);
            setLesionado(jugadorSelectedToPartidos.filter(jtp => jtp.lesionado).length);
            setGoles(jugadorSelectedToPartidos.reduce((acc, jtp) => acc + jtp.goles, 0));
            setAsistencias(jugadorSelectedToPartidos.reduce((acc, jtp) => acc + jtp.asistencias, 0));
            setTarjetasAmarillas(jugadorSelectedToPartidos.reduce((acc, jtp) => acc + jtp.tarjetasAmarillas, 0));
            setTarjetasRojas(jugadorSelectedToPartidos.reduce((acc, jtp) => acc + jtp.tarjetasRojas, 0));
            const partidosJugados = jugadorSelectedToPartidos.filter( jtp => jtp.minJugados > 0);
            const val = partidosJugados.length > 0 ? partidosJugados.reduce((acc, jtp) => acc + jtp.valoracion, 0) / partidosJugados.length : 0;
            setValoracion(val);
            //setValoracion(jugadorSelectedToPartidos.reduce((acc, jtp) => acc + jtp.valoracion, 0) / jugadorSelectedToPartidos.length);
        }
    }
    , [jugadorSelectedToPartidos]);

    return (
        <section className="jugador-estadisticas">
            <div>
                <h2>Datos Deportivos</h2>
                <div>
                    <JugadorAvatar jugador={jugador}/>
                </div>
            </div>
            <div className="jugador-estadisticas-campos">
                <div className="jugador-estadisticas-campo">
                    <h3>Apodo</h3>
                    <p>{jugador.apodo ?? '---'}</p>
                </div>
                <div className="jugador-estadisticas-campo">
                    <h3>Peso</h3>
                    <p>{jugador.peso ?? '---'}</p>
                </div>
                <div className="jugador-estadisticas-campo">
                    <h3>Altura</h3>
                    <p>{jugador.altura ?? '---'}</p>
                </div>
                <div className="jugador-estadisticas-campo">
                    <h3>Teléfono</h3>
                    <p>{jugador.telefono ?? '---'}</p>
                </div>
                <div className="jugador-estadisticas-campo">
                    <h3>Nacionalidad</h3>
                    <p>{jugador.nacionalidad ?? '---'}</p>
                </div>
            </div>
            <div className="stat-graphs">
                <div className="graph">
                    <h4>Convocatorias</h4>
                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: convocado, label: 'Convocado' },
                                    { id: 1, value: noConvocado, label: 'No Convocado' },
                                    { id: 2, value: lesionado, label: 'Lesionado' }
                                ],
                                cx: 90,
                            }
                        ]}
                        width={GRAPH_WIDTH}
                        height={GRAPH_HEIGHT}
                    />
                </div>
                <div className="graph">
                    <h4>Minutos</h4>
                    <BarChart
                        dataset={
                            jugadorSelectedToPartidos.map((jugador, index) => {
                                return {
                                    minutos: jugador.minJugados,
                                    index: index + 1
                                }
                            })
                        }
                        xAxis={[
                            {
                                scaleType: 'band',
                                dataKey: 'index',
                            }
                        ]}
                        series={[
                            {
                                dataKey: 'minutos'
                            }
                        ]}
                        width={GRAPH_WIDTH}
                        height={GRAPH_HEIGHT}
                    />
                </div>
                <div className="graph">
                    <h4>Valoración</h4>
                    <LineChart
                        dataset={
                            jugadorSelectedToPartidos.map((jugador, index) => {
                                return {
                                    valoracion: jugador.valoracion,
                                    index: index + 1
                                }
                            })
                        }
                        xAxis={[
                            {
                                dataKey: 'index'
                            }
                        ]}
                        series={[
                            {
                                dataKey: 'valoracion'
                            }
                        ]}
                        width={GRAPH_WIDTH}
                        height={GRAPH_HEIGHT}
                    />
                </div>
                <div className="graph">
                    <h4>Tarjetas</h4>
                    <BarChart
                        dataset={jugadorSelectedToPartidos.map((jugador, index) => {
                            return {
                                amarilla: jugador.tarjetasAmarillas,
                                roja: jugador.tarjetasRojas,
                                index: index + 1
                            }
                        })}
                        xAxis={[{ scaleType: 'band', dataKey: 'index' }]}
                        series={[
                            { dataKey: 'amarilla', label: 'Amarillas', color: '#ffc107'},
                            { dataKey: 'roja', label: 'Rojas', color: '#dc3545'}
                        ]}
                        width={GRAPH_WIDTH}
                        height={GRAPH_HEIGHT}
                    />
                </div>
                <div className="graph">
                    <h4>G/A</h4>
                    <BarChart
                        dataset={jugadorSelectedToPartidos.map((jugador, index) => {
                            return {
                                goles: jugador.goles,
                                asistencias: jugador.asistencias,
                                index: index + 1
                            }
                        })}
                        xAxis={[{ scaleType: 'band', dataKey: 'index' }]}
                        yAxis={[{ tickMinStep: 1}]}
                        series={[
                            { dataKey: 'goles', label: 'Goles', color: '#007bff'},
                            { dataKey: 'asistencias', label: 'Asistencias', color: '#273237'}
                        ]}
                        width={GRAPH_WIDTH}
                        height={GRAPH_HEIGHT}
                    />
                </div>
            </div>
            <div className="stats-labels">
                <div className="stat-label">
                    <h3>{minutos}</h3>
                    <h4>Minutos</h4>
                </div>
                <div className="stat-label">
                    <h3>{convocado}</h3>
                    <h4>Convocado</h4>
                </div>
                <div className="stat-label">
                    <h3>{noConvocado}</h3>
                    <h4>No Convocado</h4>
                </div>
                <div className="stat-label">
                    <h3>{lesionado}</h3>
                    <h4>Lesionado</h4>
                </div>
                <div className="stat-label">
                    <h3>{goles}</h3>
                    <h4>Goles</h4>
                </div>
                <div className="stat-label">
                    <h3>{asistencias}</h3>
                    <h4>Asistencias</h4>
                </div>
                <div className="stat-label">
                    <h3>{tarjetasAmarillas}</h3>
                    <h4>Tarjetas Amarillas</h4>
                </div>
                <div className="stat-label">
                    <h3>{tarjetasRojas}</h3>
                    <h4>Tarjetas Rojas</h4>
                </div>
                <div className="stat-label">
                    <h3>{valoracion.toFixed(1)}</h3>
                    <h4>Valoración</h4>
                </div>
            </div>
            <div>
                <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={() => router.navigate(paths.estadisticasJugador, {replace: true})}>Regresar</Button>
            </div>
        </section>
    )
}

export default JugadorEstadisticas;