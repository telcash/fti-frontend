import React, { useEffect, useState } from "react";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchEquipos, getEquiposStatus, selectAllEquipos } from "../equipos/equiposSlice";

const Jugadores = () => {

    const dispatch = useDispatch();

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);

    const [equipo, setEquipo] = useState('');

    const onEquipoChanged = e => setEquipo(e.target.value);

    useEffect(() => {
        if(equiposStatus === 'idle') {
            dispatch(fetchEquipos());
        }
    }, [equiposStatus, dispatch])

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
                    equipos.map((equipo) => (
                        <MenuItem value={equipo.nombre}>{equipo.nombre}</MenuItem>
                    ))
                }
            </Select>
            <div>
                <img src="http://www.localhost:3000/3f4b3a6e-b755-4e03-b3c4-a70e0b4d1cae.jpg" alt="" />
            </div>
           {/*  <div className="cancha">
                <img src="assets/cancha.png" alt="" />
            </div> */}
        </div>
    )
}

export default Jugadores;