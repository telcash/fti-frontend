import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addEquipo } from "./equiposSlice";
import FileInputField from "../../components/file-input-field/FileInputField";
import './equipos.css';
import { paths, router } from "../../router/router";

const AddEquipoForm = () => {
    const dispatch = useDispatch();

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [nombre, setNombre] = useState('');

    const onHandleFileChange = file => setSelectedFile(file);
    const onNombreChanged = e => setNombre(e.target.value);

    const onSaveEquipoClicked = () => {
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('file', selectedFile);
            dispatch(addEquipo(formData));
            router.navigate(paths.gestionEquipos, { replace: true });
        } catch (error) {
            console.error('Failed to save equipo', error);
        } finally {
            setFormSubmitted(true);
            setSelectedFile(null);
            setNombre('');
        }
    }

    return (
        <section className="addequipo">
            <h2>Agregar equipo</h2>
            <form className="addequipo-form">
                <FileInputField formSubmitted={formSubmitted} onHandleFileChange={onHandleFileChange} />
                <TextField
                    required
                    id="nombre"
                    label="Nombre"
                    value={nombre}
                    onChange={onNombreChanged}
                    sx={{minWidth: 300}}
                />
                <div className="addequipo-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onSaveEquipoClicked}>Salvar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.gestionEquipos, {replace: true})}>Cancelar</Button>
                </div>
            </form>
        </section>
    )
}

export default AddEquipoForm;