import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { addJugador } from "./jugadoresSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { fetchPosiciones, getPosicionesStatus, selectAllPosiciones } from "../posiciones/posicionesSlice";
import { fetchEquipos, getEquiposStatus, selectAllEquipos } from "../equipos/equiposSlice";
import './jugadores.css';
import FileInputField from "../../components/file-input-field/FileInputField";
import { paths, router } from "../../router/router";


const AddJugadorForm = () => {
    const dispatch = useDispatch();

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);

    const posiciones = useSelector(selectAllPosiciones);
    const posicionesStatus = useSelector(getPosicionesStatus)

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [apodo, setApodo] = useState('');
    const [posicion, setPosicion] = useState('');
    const [equipo, setEquipo] = useState('');
    const [fNac, setFNac] = useState(dayjs());
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [telefono, setTelefono] = useState('');
    const [nacionalidad, setNacionalidad] = useState('');
    const [iniContrato, setIniContrato] = useState(dayjs().subtract(1, 'day'));
    const [finContrato, setFinContrato] = useState(dayjs());
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
    const onPesoChanged = e => setPeso(e.target.value);
    const onAlturaChanged = e => setAltura(e.target.value);
    const onTelefonoChanged = e => setTelefono(e.target.value);
    const onNacionalidadChanged = e => setNacionalidad(e.target.value);
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
            formData.append('peso', peso);
            formData.append('altura', altura);
            formData.append('telefono', telefono);
            formData.append('nacionalidad', nacionalidad);
            formData.append('iniContrato', iniContrato);
            formData.append('finContrato', finContrato);
            formData.append('file', selectedFile);
            dispatch(addJugador(formData));
            router.navigate(paths.gestionJugadores, {replace: true});
        } catch (error) {
            console.error('Failed to save player', error);            
        } finally {
            setFormSubmitted(true);
            setSelectedFile(null);
            setNombre('');
            setApellido('');
            setApodo('');
            setPosicion('');
            setEquipo('');
            setFNac(dayjs());
            setPeso('');
            setAltura('');
            setTelefono('');
            setNacionalidad('');
            setIniContrato(dayjs().subtract(1, 'day'));
            setFinContrato(dayjs());
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
            <h2>Salvar Jugador</h2>
            <form className="addjugador-form">
                <FileInputField formSubmitted={formSubmitted} onHandleFileChange={onHandleFileChange} />
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
                            posiciones && Array.isArray(posiciones) && posiciones.map((posicion) => (
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
                            equipos && Array.isArray(equipos) && equipos.map((equipo) => (
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
                    <TextField
                        id="peso"
                        label="Peso"
                        value={peso}
                        onChange={onPesoChanged} 
                        sx={{flex: '30%'}}
                    />
                    <TextField
                        id="altura"
                        label="Altura"
                        value={altura}
                        onChange={onAlturaChanged} 
                        sx={{flex: '30%'}}
                    />
                    <TextField
                        id="telefono"
                        label="Teléfono"
                        value={telefono}
                        onChange={onTelefonoChanged} 
                        sx={{flex: '30%'}}
                    />
                    <TextField
                        id="nacionalidad"
                        label="Nacionalidad"
                        value={nacionalidad}
                        onChange={onNacionalidadChanged} 
                        sx={{flex: '30%'}}
                    />
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
                <div className="addjugador-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onSaveJugadorClicked}>Salvar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" color="error" onClick={() => router.navigate(paths.gestionJugadores, {replace: true})}>Cancelar</Button>
                </div>
            </form>
        </section>
    )
}

export default AddJugadorForm;