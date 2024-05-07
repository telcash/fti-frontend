import React, { useEffect, useState } from "react";
import { Box, InputLabel, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchEquipos, getDraggablePositions, getEquipoCancha, getEquiposStatus, selectAllEquipos, selectDraggablePositions, selectEquipoCancha } from "../equipos/equiposSlice";
import { fetchJugadores, getJugadoresStatus, jugadorSelected, selectAllJugadores } from "./jugadoresSlice";
import JugadorAvatar from "./JugadorAvatar";
import { paths, router } from '../../router/router';
import './jugadores.css';
import Draggable from "react-draggable";
import { useLocation } from "react-router-dom";

const Jugadores = () => {

    const dispatch = useDispatch();

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);
    const equipoCancha = useSelector(getEquipoCancha);
    const jugadores = useSelector(selectAllJugadores);
    const jugadoresStatus = useSelector(getJugadoresStatus);
    const initialPositions = useSelector(getDraggablePositions);

    const { pathname } = useLocation();

    const [equipo, setEquipo] = useState(equipoCancha?.nombre ?? '');
    const [jugadoresEquipo, setJugadoresEquipo] = useState([]);

    const [draggablePositions, setDraggablePositions] = useState(initialPositions ?? {});
    const [isDragging, setIsDragging] = useState(false);

    const onEquipoChanged = e => {
        setEquipo(e.target.value);
        dispatch(selectEquipoCancha(equipos.find(equipo => equipo.nombre === e.target.value)));
        const initialPositions = {};
        jugadoresEquipo.forEach((jugador, index) => {
            initialPositions[index] = { x: 0, y: 0 };
        });
        setDraggablePositions(initialPositions);
    }

    const handleJugadorClick = (jugador) => {
        if (!isDragging) {
            dispatch(selectDraggablePositions(draggablePositions));
            dispatch(jugadorSelected(jugador));
            const navPaths = {
                '/jugadores': paths.jugadorDatos,
                '/estadisticas-jugador': paths.jugadorEstadistica,
                '/graficas': paths.graficas,
                '/desarrollo-tactico-individual': paths.desarrolloTacticoIndividual,
                '/estadisticas-equipo': paths.estadisticasEquipo,
                '/calendario': paths.jugadorCalendario,
                '/notificaciones': paths.jugadoresNotificaciones,
            }
            router.navigate(navPaths[pathname], {replace: true});
        } else {
            setIsDragging(false);
        }
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
            const filteredJugadores = jugadores.filter(jugador => jugador.equipo && jugador.equipo.nombre === equipo);
            setJugadoresEquipo(filteredJugadores);
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
                <Box
                    height={600}
                    width={'100%'}
                    position="relative"
                    id="cancha"
                    mb={2}
                    sx={{
                        backgroundImage: `url(${'../../assets/cancha.png'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                </Box>
                {
                    jugadoresEquipo.map((jugador, index) => (
                        <Draggable
                            key={index}
                            bounds="parent"
                            position={draggablePositions[index]}
                            onDrag={(e, data) => {
                                const updatedPositions = { ...draggablePositions };
                                //TODO: Base de datos
                                updatedPositions[index] = { x: data.x, y: data.y };
                                setDraggablePositions(updatedPositions);
                                setIsDragging(true);
                            }}
                        >
                            <div onClick={() => handleJugadorClick(jugador)}>
                                <JugadorAvatar
                                    nombre={jugador.nombre}
                                    apellido={jugador.apellido}
                                    fotoJugador={jugador.foto}
                                />
                            </div>
                        </Draggable>
                    ))
                }
            </div>
        </div>
    )
}

export default Jugadores;