import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { addJugador } from "./jugadoresSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { fetchPosiciones, getPosicionesStatus, selectAllPosiciones } from "../posiciones/posicionesSlice";
import { fetchEquipos, getEquiposStatus, selectAllEquipos } from "../equipos/equiposSlice";


const AddJugadorForm = () => {
    const dispatch = useDispatch();

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);

    const posiciones = useSelector(selectAllPosiciones);
    const posicionesStatus = useSelector(getPosicionesStatus)

    const [selectedFile, setSelectedFile] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [apodo, setApodo] = useState('');
    const [posicion, setPosicion] = useState('');
    const [equipo, setEquipo] = useState('');
    const [fNac, setFNac] = useState(dayjs());
    const [iniContrato, setIniContrato] = useState(dayjs());
    const [finContrato, setFinContrato] = useState(dayjs());

    const handleFileChange = e => setSelectedFile(e.target.files[0]);
    const onNombreChanged = e => setNombre(e.target.value);
    const onApellidoChanged = e => setApellido(e.target.value);
    const onApodoChanged = e => setApodo(e.target.value);
    const onPosicionChanged = e => setPosicion(e.target.value);
    const onEquipoChanged = e => setEquipo(e.target.value);
    const onFNacChanged = e => setFNac(e);
    const onIniContratoChanged = e => setIniContrato(e);
    const onFinContratoChanged = e => setFinContrato(e);

    const onSaveJugadorClicked = () => {
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('apellido', apellido);
            formData.append('apodo', apodo);
            formData.append('posicion', posicion);
            formData.append('equipo', equipo);
            formData.append('fNac', fNac);
            formData.append('iniContrato', iniContrato);
            formData.append('finContrato', finContrato);
            formData.append('file', selectedFile);
            dispatch(addJugador(formData));
        } catch (error) {
            console.error('Failed to save player', error);            
        }
    }

    useEffect(() => {
        if(posicionesStatus === 'idle') {
            dispatch(fetchPosiciones());
        }
    }, [posicionesStatus, dispatch])

    useEffect(() => {
        if(equiposStatus === 'idle') {
            dispatch(fetchEquipos());
        }
    }, [equiposStatus, dispatch])

    return (
        <section>
            <h2>Agregar jugador</h2>
            <form>
                <label htmlFor="foto">
                    <input
                        type="file"
                        onChange={handleFileChange}
                    />
                </label>
                <TextField
                    required
                    id="nombre"
                    label="Nombre"
                    value={nombre}
                    onChange={onNombreChanged}
                />
                <TextField
                    required
                    id="apellido"
                    label="Apellido"
                    value={apellido}
                    onChange={onApellidoChanged} 
                />
                <TextField
                    id="apodo"
                    label="Apodo"
                    value={apodo}
                    onChange={onApodoChanged} 
                />
                <InputLabel id="posicion-label">Posición</InputLabel>
                <Select
                    labelId="posicion-label"
                    id="posicion"
                    value={posicion}
                    label="Posición"
                    onChange={onPosicionChanged}
                >
                {
                    posiciones.map((posicion) => (
                        <MenuItem value={posicion.nombre}>{posicion.nombre}</MenuItem>
                    ))
                }
                </Select>
                <InputLabel id="equipo-label">Equipo Actual</InputLabel>
                <Select
                    labelId="equipo-label"
                    id="equipo"
                    value={equipo}
                    label="Equipo Actual"
                    onChange={onEquipoChanged}
                >
                {
                    equipos.map((equipo) => (
                        <MenuItem value={equipo.nombre}>{equipo.nombre}</MenuItem>
                    ))
                }
                </Select>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                    <DatePicker 
                        label="Fecha de nacimiento"
                        value={fNac}
                        onChange={onFNacChanged}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                    <DatePicker 
                        label="Inicio de contrato"
                        value={iniContrato}
                        onChange={onIniContratoChanged}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                    <DatePicker 
                        label="Fin de contrato"
                        value={finContrato}
                        onChange={onFinContratoChanged}
                    />
                </LocalizationProvider>
                <div>
                    <Button variant="contained" onClick={onSaveJugadorClicked}>Salvar</Button>
                </div>
            </form>
        </section>
    )
}

export default AddJugadorForm;