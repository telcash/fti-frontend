import { useDispatch, useSelector } from "react-redux";
import { fetchEquipos, getEquiposStatus, selectAllEquipos } from "../equipos/equiposSlice";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getPartidoSelected, updatePartido } from "./partidosSlice";
import { router } from "../../router/router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";


const UpdatePartidoForm = () => {
    const dispatch = useDispatch();

    const partido = useSelector(getPartidoSelected);

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);

    const [fecha, setFecha] = useState(dayjs(partido.fecha));
    const [equipoLocal, setEquipoLocal] = useState(partido.equipoLocal.nombre);
    const [equipoVisitante, setEquipoVisitante] = useState(partido.equipoVisitante.nombre);
    const [resultado, setResultado] = useState(partido.resultado);

    const onFechaChanged = e => setFecha(e);
    const onEquipoLocalChanged = e => setEquipoLocal(e.target.value);
    const onEquipoVisitanteChanged = e => setEquipoVisitante(e.target.value);
    const onResultadoChanged = e => setResultado(e.target.value);

    const onSavePartidoClicked = () => {
        try {
            dispatch(updatePartido(
                {
                    id: 1,
                    partido: {
                        fecha: fecha,
                        resultado: resultado,
                        equipoLocalId: equipos.filter(equipo => equipo.nombre === equipoLocal)[0].id,
                        equipoVisitanteId: equipos.filter(equipo => equipo.nombre === equipoVisitante)[0].id
                    }
                }
            ));
            router.navigate('../gestion-partidos');
        } catch (error) {
            console.error('Failed to save partido', error);
        }
    }

    useEffect(() => {
        if(equiposStatus === 'idle') {
            dispatch(fetchEquipos());
        }
    }, [equiposStatus, dispatch])

    return (
        <section className="addpartido">
            <h2>Actualizar partido</h2>
            <form className="addpartido-form">
                <div className="addpartido-form-fields">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                        <DatePicker 
                            label="Fecha"
                            value={fecha}
                            onChange={onFechaChanged}
                        />
                    </LocalizationProvider>
                    <FormControl sx={{minWidth: 300}}>
                        <InputLabel id="equipolocal-label">Equipo Local</InputLabel>
                        <Select
                            labelId="equipolocal-label"
                            id="equipolocal"
                            value={equipoLocal}
                            label="Equipo Local"
                            onChange={onEquipoLocalChanged}
                        >
                            {
                                equipos.map((equipo) => (
                                    <MenuItem value={equipo.nombre}>{equipo.nombre}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl sx={{minWidth: 300}}>
                        <InputLabel id="equipovisitante-label">Equipo Visitante</InputLabel>
                        <Select
                            labelId="equipovisitante-label"
                            id="equipovisitante"
                            value={equipoVisitante}
                            label="Equipo Visitante"
                            onChange={onEquipoVisitanteChanged}
                        >
                            {
                                equipos.map((equipo) => (
                                    <MenuItem value={equipo.nombre}>{equipo.nombre}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <TextField
                        id="resultado"
                        label="Resultado"
                        value={resultado}
                        onChange={onResultadoChanged} 
                        sx={{minWidth: 300}}
                    />
                </div>
                <div>
                    <Button variant="contained" onClick={onSavePartidoClicked}>Actualizar</Button>
                </div>
            </form>
        </section>
    )
}

export default UpdatePartidoForm;