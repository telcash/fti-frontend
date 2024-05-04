import React, { useEffect, useState } from "react";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchEquipos, getEquiposStatus, selectAllEquipos } from "../equipos/equiposSlice";
import { fetchJugadores, getJugadoresStatus, jugadorSelected, selectAllJugadores } from "./jugadoresSlice";
import JugadorAvatar from "./JugadorAvatar";
import { router } from '../../router/router';
import './jugadores.css';

const Jugadores = () => {

    const dispatch = useDispatch();

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);
    const jugadores = useSelector(selectAllJugadores);
    const jugadoresStatus = useSelector(getJugadoresStatus);

    const [equipo, setEquipo] = useState('');
    const [jugadoresEquipo, setJugadoresEquipo] = useState([]);

    const onEquipoChanged = e => setEquipo(e.target.value);

    const handleJugadorClick = (jugador) => {
        dispatch(jugadorSelected(jugador));
        router.navigate('/jugador-datos');
    }

    useEffect(() => {
        if(equiposStatus === 'idle') {
            dispatch(fetchEquipos());
        }
    }, [equiposStatus, dispatch])

    useEffect(() => {
        if(jugadoresStatus === 'idle') {
            dispatch(fetchJugadores());
        }
    }  , [jugadoresStatus, dispatch])

    useEffect(() => {
        if(equipo) {
            setJugadoresEquipo(jugadores.filter(jugador => {
                if(jugador.equipo) {
                    return jugador.equipo.nombre === equipo;
                }
                return false;
            }));
        }
    }   , [equipo, equipos, jugadores]);


    return (
        <div className="jugadores-cancha">
            <InputLabel id="equipo-label">Seleccionar equipo</InputLabel>
            <Select
                labelId="equipo-label"
                id="equipo"
                value={equipo}
                label="Seleccionar equipo"
                onChange={onEquipoChanged}
                sx={{width: 300}}
            >
                {
                    equipos.map((equipo, index) => (
                        <MenuItem key={index} value={equipo.nombre}>{equipo.nombre}</MenuItem>
                    ))
                }
            </Select>
            <div className="jugadores-avatar-list">
                {
                    jugadoresEquipo.map((jugador, index) => (
                        <div key={index} onClick={() => handleJugadorClick(jugador)}>
                            <JugadorAvatar
                                nombre={jugador.nombre}
                                apellido={jugador.apellido}
                                fotoJugador={jugador.foto}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Jugadores;