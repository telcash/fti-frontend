import { useDispatch, useSelector } from "react-redux"
import { fetchEquipos, getEquiposStatus, selectAllEquipos } from "../equipos/equiposSlice";
import { fetchPosiciones, getPosicionesStatus, selectAllPosiciones } from "../posiciones/posicionesSlice";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getJugadorSelected, updateJugador } from "./jugadoresSlice";
import FileInputField from "../../components/file-input-field/FileInputField";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { router } from "../../router/router";



const UpdateJugadorForm = () => {
    const imgUrl = process.env.REACT_APP_API_STATIC_SERVER + "jugadores/";

    const dispatch = useDispatch();

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);
    
    const jugador = useSelector(getJugadorSelected);

    const posiciones = useSelector(selectAllPosiciones);
    const posicionesStatus = useSelector(getPosicionesStatus);

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [nombre, setNombre] = useState(jugador.nombre);
    const [apellido, setApellido] = useState(jugador.apellido);
    const [apodo, setApodo] = useState(jugador.apodo);
    const [posicion, setPosicion] = useState(jugador.posicion ? jugador.posicion.nombre : '');
    const [equipo, setEquipo] = useState(jugador.equipo ? jugador.equipo.nombre : '');
    const [fNac, setFNac] = useState(dayjs(jugador.fNac));
    const [iniContrato, setIniContrato] = useState(dayjs(jugador.iniContrato));
    const [finContrato, setFinContrato] = useState(dayjs(jugador.finContrato));
    const [errors, setErrors] = useState({});

    const onHandleFileChange = file => setSelectedFile(file);
    
    const onNombreChanged = e => {
        setNombre(e.target.value);
        if(nombre.length >= 2 && errors.nombre) {
            delete errors.nombre;
        }
    }
    const onApellidoChanged = e => {
        setApellido(e.target.value);
        if(apellido.length >= 2 && errors.apellido) {
            delete errors.apellido;
        }
    }
    const onApodoChanged = e => setApodo(e.target.value);
    const onPosicionChanged = e => setPosicion(e.target.value);
    const onEquipoChanged = e => setEquipo(e.target.value);
    const onFNacChanged = e => setFNac(e);
    const onIniContratoChanged = e => setIniContrato(e);
    const onFinContratoChanged = e => setFinContrato(e);

    const validateForm = () => {
        const newErrors = {};
        if(!nombre || nombre.length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos dos caracteres';
        }
        if(!apellido || apellido.length < 2) {
            newErrors.apellido = 'El nombre debe tener al menos dos caracteres';
        }
        return {...errors, ...newErrors};
    }

    const onSaveJugadorClicked = () => {
        const formErrors = validateForm();
        if(Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
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
            dispatch(updateJugador({id: jugador.id, jugador: formData}));
            router.navigate('../gestion-jugadores');
        } catch (error) {
            console.error('Failed to save player', error);            
        } finally {
            setFormSubmitted(true);
            setSelectedFile(null);
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
        <section className="addjugador">
            <h2>Actualizar Jugador</h2>
            <form className="addjugador-form">
                <FileInputField
                    formSubmitted={formSubmitted}
                    onHandleFileChange={onHandleFileChange}
                    prevImgUrl={imgUrl + jugador.foto}
                />
                <div className="addjugador-form-fields">
                    <TextField
                        required
                        id="nombre"
                        label="Nombre"
                        value={nombre}
                        onChange={onNombreChanged}
                        onErr
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                        sx={{flex: '30%'}}
                    />
                    <TextField
                        required
                        id="apellido"
                        label="Apellido"
                        value={apellido}
                        onChange={onApellidoChanged}
                        error={!!errors.apellido}
                        helperText={errors.apellido}
                        sx={{flex: '30%'}}
                    />
                    <TextField
                        id="apodo"
                        label="Apodo"
                        value={apodo}
                        onChange={onApodoChanged} 
                        sx={{flex: '30%'}}
                    />
                    <FormControl sx={{flex: '30%'}}>
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
                    </FormControl>
                    <FormControl sx={{flex: '30%'}}>
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
                    </FormControl>
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
                            minDate={iniContrato}
                            onError={(newError) => {
                                if(newError) {
                                    setErrors({...errors, finContrato: 'El fin del contrato debe ser después del inicio del contrato'})
                                } else {
                                    setErrors({...errors, finContrato: ''})
                                }
                            }}
                            slotProps={{
                                textField: {
                                    helperText: errors.finContrato,
                                }
                            }}
                        />
                    </LocalizationProvider>
                </div>
                <div>
                    <Button variant="contained" onClick={onSaveJugadorClicked}>Actualizar</Button>
                </div>
            </form>
        </section>
    );
}

export default UpdateJugadorForm;