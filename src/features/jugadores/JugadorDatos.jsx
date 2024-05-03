import { useDispatch, useSelector } from "react-redux";
import JugadorAvatar from "./JugadorAvatar"
import { getJugadorSelected } from "./jugadoresSlice";


const JugadorDatos = () => {

    const dispatch = useDispatch();
    const jugador = useSelector(getJugadorSelected);

    return (
        <div className="jugador-datos">
            <h2>Datos de Jugador</h2>
            <JugadorAvatar fotoJugador={jugador.foto} nombre={jugador.nombre} apellido={jugador.apellido} posicion={jugador.posicion.nombre} />
            <div className="jugador-datos-campos">
                <div className="jugador-datos-campo">
                    <h3>Fecha de Nacimiento</h3>
                    <p>{jugador.fNac}</p>
                </div>
                <div className="jugador-datos-campo">
                    <h3>Equipo</h3>
                    <p>{jugador.equipo.nombre}</p>
                </div>
                <div className="jugador-datos-campo">
                    <h3>Inicio de contrato</h3>
                    <p>{jugador.iniContrato}</p>
                </div>
                <div className="jugador-datos-campo">
                    <h3>Finalización de contrato</h3>
                    <p>{jugador.finContrato}</p>
                </div>
            </div>
        </div>
    )
}

export default JugadorDatos;