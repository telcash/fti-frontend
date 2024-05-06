import React, { useEffect, useState } from "react";
import { Box, InputLabel, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { equipoSelected, fetchEquipos, getDraggablePositions, getEquipoSelected, getEquiposStatus, selectAllEquipos, selectDraggablePositions } from "../equipos/equiposSlice";
import { fetchJugadores, getJugadoresStatus, jugadorSelected, selectAllJugadores } from "./jugadoresSlice";
import JugadorAvatar from "./JugadorAvatar";
import { paths, router } from '../../router/router';
import './jugadores.css';
import Draggable from "react-draggable";

const Jugadores = () => {

    const dispatch = useDispatch();

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);
    const equipoSelect = useSelector(getEquipoSelected);
    const jugadores = useSelector(selectAllJugadores);
    const jugadoresStatus = useSelector(getJugadoresStatus);
    const initialPositions = useSelector(getDraggablePositions);

    const [equipo, setEquipo] = useState(equipoSelect?.nombre ?? '');
    const [jugadoresEquipo, setJugadoresEquipo] = useState([]);

    const [draggablePositions, setDraggablePositions] = useState(initialPositions ?? {});
    const [isDragging, setIsDragging] = useState(false);

    const onEquipoChanged = e => {
        setEquipo(e.target.value);
        dispatch(equipoSelected(equipos.find(equipo => equipo.nombre === e.target.value)));
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
            router.navigate(paths.jugadorDatos, {replace: true});
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
            <div className="jugadores-avatar-list" style={{position: "relative"}}>
                <Box
                    height={600}
                    width={'100%'}
                    position="relative"
                    id="cancha"
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
                                // Update the position in the state when the element is dragged
                                const updatedPositions = { ...draggablePositions };
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