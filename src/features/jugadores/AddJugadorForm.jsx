import { useState } from "react";
import { useDispatch } from "react-redux"
import { addJugador } from "./jugadoresSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';


const AddJugadorForm = () => {
    const dispatch = useDispatch();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [apodo, setApodo] = useState('');
    const [fNac, setFNac] = useState(dayjs());
    const [iniContrato, setIniContrato] = useState(null);
    const [finContrato, setFinContrato] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = e => setSelectedFile(e.target.files[0]);

    const onNombreChanged = e => setNombre(e.target.value);
    const onApellidoChanged = e => setApellido(e.target.value);
    const onApodoChanged = e => setApodo(e.target.value);
    const onFNacChanged = e => setFNac(e);
    const onIniContratoChanged = e => setIniContrato(e.target.value);
    const onFinContratoChanged = e => setFinContrato(e.target.value);

    const onSaveJugadorClicked = () => {
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('apellido', apellido);
            formData.append('fNac', fNac);
            formData.append('file', selectedFile);
            dispatch(addJugador(formData));
        } catch (error) {
            console.error('Failed to save player', error);            
        }
    }
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
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={nombre}
                    onChange={onNombreChanged}
                />
                <label htmlFor="apellido">Apellido:</label>
                <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={apellido}
                    onChange={onApellidoChanged}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                    <DatePicker 
                        label="Fecha de nacimiento"
                        value={fNac}
                        onChange={onFNacChanged}
                    />
                </LocalizationProvider>
                <button
                    type="button"
                    onClick={onSaveJugadorClicked}
                >Salvar</button>
            </form>
        </section>
    )
}

export default AddJugadorForm;