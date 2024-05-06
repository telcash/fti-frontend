import { useDispatch, useSelector } from "react-redux";
import { getJugadorSelected } from "./jugadoresSlice";
import { fetchSesiones, getSesionesStatus, selectAllSesiones } from "../sesion-individual/sesionIndividualSlice";
import { useEffect, useState } from "react";
import './jugadores.css';

const PORCENTAJE_ALERTA = 60;

const JugadoresNotificaciones = () => {

    const dispatch = useDispatch();

    const jugador = useSelector(getJugadorSelected)
    const sesiones = useSelector(selectAllSesiones);
    const sesionesStatus = useSelector(getSesionesStatus);

    const [fundamentosEvaluados, setFundamentosEvaluados] = useState([]);

    useEffect(() => {
        if(sesionesStatus === 'idle') {
            dispatch(fetchSesiones());
        }
    }, [dispatch, sesionesStatus]);

    useEffect(() => {
        if (sesiones.length > 0) {
            const sesionesJugador = sesiones.filter(s => s.jugador.id === jugador.id);
            const fundamentosNames = [];
            const fundamentos = [];
            sesionesJugador.forEach(s => {
                s.ejercicios.forEach(e => {
                    if(!fundamentosNames.includes(e.fundamento.nombre)) {
                        fundamentosNames.push(e.fundamento.nombre);
                        fundamentos.push({
                            nombre: e.fundamento.nombre,
                            valoracion: e.valoracion,
                            valoracionMaxima: e.valoracionMaxima,
                            porcentaje: 100 * e.valoracion / e.valoracionMaxima
                        });
                    } else {
                        const index = fundamentos.findIndex(f => f.nombre === e.fundamento.nombre);
                        fundamentos[index].valoracion += e.valoracion;
                        fundamentos[index].valoracionMaxima += e.valoracionMaxima;
                        fundamentos[index].porcentaje = 100 * fundamentos[index].valoracion / fundamentos[index].valoracionMaxima;
                    }
                })
            })
            setFundamentosEvaluados(fundamentos);
        }
    }, [sesiones, jugador]);

    return (
        <section className="jugador-notificaciones">
            <h2>Notificaciones</h2>
            <ul className="jugador-notificaciones-list">
                {fundamentosEvaluados.filter(f => f.porcentaje <= PORCENTAJE_ALERTA).map(f => (
                    <li className="notificacion" key={f.nombre}>
                        {`El jugador ${jugador.nombre} ${jugador.apellido}, de Id: ${jugador.id} tiene un ${f.porcentaje}% en el fundamento ${f.nombre}.`}
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default JugadoresNotificaciones;