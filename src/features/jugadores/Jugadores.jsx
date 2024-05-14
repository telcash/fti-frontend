import React, { useEffect, useState } from "react";
import { Button, InputLabel, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchEquipos, getEquipoCancha, getEquiposStatus, selectAllEquipos, selectEquipoCancha } from "../equipos/equiposSlice";
import { fetchJugadores, getJugadoresStatus, jugadorSelected, selectAllJugadores, updateJugador } from "./jugadoresSlice";
import JugadorAvatar from "./JugadorAvatar";
import { paths, router } from '../../router/router';
import './jugadores.css';
import Draggable from "react-draggable";
import { useLocation } from "react-router-dom";
import { getDrawerOpen } from "../../components/main-drawer/mainDrawerSlice";

const DRAGGABLE_HEIGHT = 80.72;
const DRAGGABLE_BY_ROW = 4;

const Jugadores = () => {

    const dispatch = useDispatch();

    const isDrawerOpen = useSelector(getDrawerOpen);

    const jugadores = useSelector(selectAllJugadores);
    const jugadoresStatus = useSelector(getJugadoresStatus);
    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);
    const equipoCancha = useSelector(getEquipoCancha);

    const { pathname } = useLocation();

    const [equipo, setEquipo] = useState(equipoCancha?.nombre ?? '');
    const [jugadoresEquipo, setJugadoresEquipo] = useState([]);

    const [draggablePositions, setDraggablePositions] = useState([]);

    const [isDragging, setIsDragging] = useState(false);

    const [mainBoxElement, setMainBoxElement] = useState(null);
    const [jugadoresCanchaElement, setJugadoresCanchaElement] = useState(null);

    const handleElementRef = (element) => {
        if (element) {
            const width = element.clientWidth;
            const height = element.clientHeight;
            return { width, height }
        }
    };

    useEffect(() => {
        setMainBoxElement(document.getElementById('main-box'));
        setJugadoresCanchaElement(document.getElementById('jugadores-cancha-box'));
    }
    , []);

    useEffect(() => {
        const handleResize = () => {
            console.log('resize');
            const { width, height } = handleElementRef(mainBoxElement);
            const boxW = width;
            const boxH = height;
            const dw = handleElementRef(jugadoresCanchaElement).width / 4;
            setDraggablePositions(jugadoresEquipo.map((jugador, index) => {
                return {
                    jugadorId: jugador.id,
                    coords: {
                        x: jugador.posX === 0 ? 0 : (boxW * jugador.posX) - ((index - 1) * dw),
                        y: jugador.posY === 0 ? 0 : -boxH * jugador.posY - (Math.floor((index + 1) / DRAGGABLE_BY_ROW) * DRAGGABLE_HEIGHT)
                    }
                }
            }))
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    },);

    /* useEffect(() => {
        console.log('useEffect toggle');
        if(mainBoxElement && jugadoresCanchaElement && jugadoresEquipo.length > 0) {
            const { width, height } = handleElementRef(mainBoxElement);
            const boxW = width;
            const boxH = height;
            const dw = handleElementRef(jugadoresCanchaElement).width / 4;
            setDraggablePositions(jugadoresEquipo.map((jugador, index) => {
                return {
                    jugadorId: jugador.id,
                    coords: {
                        x: jugador.posX === 0 ? 0 : (boxW * jugador.posX) - ((index - 1) * dw),
                        y: jugador.posY === 0 ? 0 : -boxH * jugador.posY - (Math.floor((index + 1) / 4) * 85.92)
                    }
                }
            }))
        }
    }, [isDrawerOpen, jugadoresCanchaElement, jugadoresEquipo, mainBoxElement]); */

    const onEquipoChanged = e => {
        setEquipo(e.target.value);
        dispatch(selectEquipoCancha(equipos.find(equipo => equipo.nombre === e.target.value)));
    }

    const resetPositions = () => {
        setDraggablePositions(jugadoresEquipo.map(jugador => {
            return {
                jugadorId: jugador.id,
                coords: {
                    x: 0,
                    y: 0
                }
            }
        }))
        draggablePositions.forEach(position =>
            dispatch(updateJugador({
                id: position.jugadorId,
                jugador: { 
                    posX: 0,
                    posY: 0
                }
            })
        ));
    }

    const handleJugadorClick = (jugador) => {
        if (!isDragging) {
            dispatch(jugadorSelected(jugador));
            const navPaths = {
                '/jugadores': paths.jugadorDatos,
                '/estadisticas-jugador': paths.jugadorEstadistica,
                '/graficas': paths.jugadorGraficas,
                '/desarrollo-tactico-individual': paths.jugadorDesarrolloTactico,
                '/estadisticas-equipo': paths.estadisticasEquipo,
                '/calendario': paths.jugadorCalendario,
            }
            router.navigate(navPaths[pathname], {replace: true});
        } else {
            setIsDragging(false);
        }
    }

    useEffect(() => {
        if(jugadoresStatus === 'idle') {
            dispatch(fetchJugadores());
        }
    }  , [jugadoresStatus, dispatch])

    useEffect(() => {
        if(equiposStatus === 'idle') {
            dispatch(fetchEquipos());
        }
    }
    , [equiposStatus, dispatch])

    useEffect(() => {
        if(equipo && jugadoresCanchaElement && mainBoxElement) {
            const filteredJugadores = jugadores
                .filter(jugador => jugador.equipo && jugador.equipo.nombre === equipo)
                .sort((a, b) => a.id - b.id);
            setJugadoresEquipo(filteredJugadores);
            const { width, height } = handleElementRef(mainBoxElement);
            const boxW = width;
            const boxH = height;
            const dw = handleElementRef(jugadoresCanchaElement).width / 4;
            setDraggablePositions(filteredJugadores.map((jugador, index) => {
                return {
                    jugadorId: jugador.id,
                    coords: {
                        x: jugador.posX === 0 ? 0 : (boxW * jugador.posX) - ((index - 1) * dw),
                        y: jugador.posY === 0 ? 0 : -boxH * jugador.posY - (Math.floor((index + 1) / DRAGGABLE_BY_ROW) * DRAGGABLE_HEIGHT)
                    }
                }
            }))
        }
    }   , [equipo, jugadores, jugadoresCanchaElement, mainBoxElement]);

    return (
        <div className="jugadores-container">
            <div className="jugadores-cancha" id="jugadores-cancha-box">
                <div>
                    <InputLabel id="equipo-label">Seleccionar equipo</InputLabel>
                    <Select
                        labelId="equipo-label"
                        id="equipo"
                        value={equipo}
                        label="Seleccionar equipo"
                        onChange={onEquipoChanged}
                        sx={{width: 300, mb: 2}}
                    >
                        {
                            equipos.map((equipo, index) => (
                                <MenuItem key={index} value={equipo.nombre}>{equipo.nombre}</MenuItem>
                            ))
                        }
                    </Select>
                    <Button onClick={resetPositions}>Reset</Button>
                </div>
                <div className="jugador-cancha-draggable-container" id="avatar-list">
                    <div id="main-box" className="main-box">
                        <div className="background-cancha"></div>
                    </div>
                    {
                        jugadoresEquipo.map((jugador, index) => (
                            <Draggable
                                key={index}
                                bounds="parent"
                                position= {{ 
                                    x: draggablePositions.find(position => position.jugadorId === jugador.id).coords.x,
                                    y: draggablePositions.find(position => position.jugadorId === jugador.id).coords.y
                                }}
                                onDrag={() => {
                                    setIsDragging(true);
                                }}
                                onStop={(e, data) => {
                                    const updatedPositions = [ ...draggablePositions ]
                                    updatedPositions.forEach(position => {
                                        if(position.jugadorId === jugador.id) {
                                            position.coords.x = (-data.y < Math.floor(1 + (index + 1) / DRAGGABLE_BY_ROW) * DRAGGABLE_HEIGHT) ? 0 : data.x;
                                            position.coords.y = (-data.y < Math.floor(1 + (index + 1) / DRAGGABLE_BY_ROW) * DRAGGABLE_HEIGHT) ? 0 : data.y;
                                        }
                                    })
                                    setDraggablePositions(updatedPositions);
                                    const { width, height } = handleElementRef(mainBoxElement);
                                    const boxW = width;
                                    const boxH = height;
                                    const dw = handleElementRef(jugadoresCanchaElement).width / 4;
                                    dispatch(updateJugador({
                                        id: jugador.id,
                                        jugador: { 
                                            posX: (-data.y < Math.floor(1 + (index + 1) / DRAGGABLE_BY_ROW) * DRAGGABLE_HEIGHT) ? 0 : ((index - 1) * dw + data.x) / boxW,
                                            posY: (-data.y < Math.floor(1 + (index + 1) / DRAGGABLE_BY_ROW) * DRAGGABLE_HEIGHT) ? 0 : (-data.y - (Math.floor((index + 1) / DRAGGABLE_BY_ROW) * DRAGGABLE_HEIGHT)) / boxH
                                        }
                                    }))
                                }}
        
                            >
                                <div style={{ flex: '24%', maxWidth: handleElementRef(jugadoresCanchaElement).width / 4 }} onClick={() => handleJugadorClick(jugador)}>
                                    <JugadorAvatar
                                        nombre={jugador.nombre}
                                        apellido={jugador.apellido}
                                        fotoJugador={jugador.foto}
                                        darkMode={true}
                                    />
                                </div>
                            </Draggable>
                        ))
                    }
                </div>
            </div>
        </div>
        
    )
}

export default Jugadores;