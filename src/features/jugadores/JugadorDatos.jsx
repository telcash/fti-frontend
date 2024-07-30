import { useSelector } from "react-redux";
import JugadorAvatar from "./JugadorAvatar"
import { getJugadorSelected } from "./jugadoresSlice";
import { Button } from "@mui/material";
import { paths, router } from "../../router/router";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import calculateAge from '../../utils/calculateAge';

const JugadorDatos = () => {

    const jugador = useSelector(getJugadorSelected);

    return (
        <div className="jugador-datos">
            <div>
                <h2>Datos de Jugador</h2>
                <JugadorAvatar 
                    jugador={jugador} 
                />
            </div>
            <div className="jugador-datos-campos">
                <div className="jugador-datos-campo">
                    <h3>Fecha de Nacimiento</h3>
                    <p>{jugador.fNac ? dayjs(jugador.fNac).format('DD/MM/YYYY') : ''}</p>
                </div>
                <div className="jugador-datos-campo">
                    <h3>Edad</h3>
                    <p>{calculateAge(jugador.fNac)}</p>
                </div>
                <div className="jugador-datos-campo">
                    <h3>Equipo</h3>
                    <p>{(jugador.equipo && jugador.equipo.nombre) ?? ''}</p>
                </div>
                <div className="jugador-datos-campo">
                    <h3>Inicio de contrato</h3>
                    <p>{jugador.iniContrato ? dayjs(jugador.iniContrato).format('DD/MM/YYYY') : ''}</p>
                </div>
                <div className="jugador-datos-campo">
                    <h3>Finalización de contrato</h3>
                    <p>{jugador.finContrato ? dayjs(jugador.finContrato).format('DD/MM/YYYY') : ''}</p>
                </div>
            </div>
            <div>
                <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={() => router.navigate(paths.jugadores, {replace: true})}>Regresar</Button>
            </div>
        </div>
    )
}

export default JugadorDatos;