import { useDispatch, useSelector } from "react-redux";
import { getJugadorSelected } from "./jugadoresSlice";
import './jugadores.css';
import { fetchJugadorToPartidos, selectAllJugadorToPartidos } from "../jugador-to-partido/jugadorToPartidoSlice";
import { useEffect, useState } from "react";
import JugadorAvatar from "./JugadorAvatar";

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
        console.log(jugadorSelectedToPartidos);
        if (jugadorSelectedToPartidos.length > 0) {
            setMinutos(jugadorSelectedToPartidos.reduce((acc, jtp) => acc + jtp.minJugados, 0));
            setConvocado(jugadorSelectedToPartidos.filter(jtp => jtp.convocado).length);
            setNoConvocado(jugadorSelectedToPartidos.filter(jtp => !jtp.convocado).length);
            setLesionado(jugadorSelectedToPartidos.filter(jtp => jtp.lesionado).length);
            setGoles(jugadorSelectedToPartidos.reduce((acc, jtp) => acc + jtp.goles, 0));
            setAsistencias(jugadorSelectedToPartidos.reduce((acc, jtp) => acc + jtp.asistencias, 0));
            setTarjetasAmarillas(jugadorSelectedToPartidos.reduce((acc, jtp) => acc + jtp.tarjetasAmarillas, 0));
            setTarjetasRojas(jugadorSelectedToPartidos.reduce((acc, jtp) => acc + jtp.tarjetasRojas, 0));
            setValoracion(jugadorSelectedToPartidos.reduce((acc, jtp) => acc + jtp.valoracion, 0) / jugadorSelectedToPartidos.length);
        }
    }
    , [jugadorSelectedToPartidos]);

    return (
        <section className="jugador-estadisticas">
            <div>
                <JugadorAvatar fotoJugador={jugador.foto} nombre={jugador.nombre} apellido={jugador.apellido} posicion={jugador.posicion}/>
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
                    <h3>{valoracion}</h3>
                    <h4>Valoracion</h4>
                </div>
            </div>
            <div className="stat-graphs">
                
            </div>
        </section>
    )
}

export default JugadorEstadisticas;