import { useSelector } from "react-redux";
import JugadorAvatar from "./JugadorAvatar"
import { getJugadorSelected } from "./jugadoresSlice";
import { Button } from "@mui/material";
import { paths, router } from "../../router/router";

const JugadorDatos = () => {

    const jugador = useSelector(getJugadorSelected);

    return (
        <div className="jugador-datos">
            <h2>Datos de Jugador</h2>
            <JugadorAvatar 
                jugador={jugador} 
            />
            <div className="jugador-datos-campos">
                <div className="jugador-datos-campo">
                    <h3>Fecha de Nacimiento</h3>
                    <p>{jugador.fNac ?? ''}</p>
                </div>
                <div className="jugador-datos-campo">
                    <h3>Equipo</h3>
                    <p>{(jugador.equipo && jugador.equipo.nombre) ?? ''}</p>
                </div>
                <div className="jugador-datos-campo">
                    <h3>Inicio de contrato</h3>
                    <p>{jugador.iniContrato ?? ''}</p>
                </div>
                <div className="jugador-datos-campo">
                    <h3>Finalización de contrato</h3>
                    <p>{jugador.finContrato ?? ''}</p>
                </div>
            </div>
            <div>
                <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={() => router.navigate(paths.jugadores, {replace: true})}>Regresar</Button>
            </div>
        </div>
    )
}

export default JugadorDatos;