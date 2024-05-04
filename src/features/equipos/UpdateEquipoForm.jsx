import { useDispatch, useSelector } from "react-redux";
import { getEquipoSelected, updateEquipo } from "./equiposSlice";
import { useState } from "react";
import FileInputField from "../../components/file-input-field/FileInputField";
import { Button, TextField } from "@mui/material";
import { paths, router } from "../../router/router";
import './equipos.css';


const UpdateEquipoForm = () => {
    const imgUrl = process.env.REACT_APP_API_STATIC_SERVER + "equipos/";

    const dispatch = useDispatch();

    const equipo = useSelector(getEquipoSelected);

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [nombre, setNombre] = useState(equipo.nombre);

    const onHandleFileChange = file => setSelectedFile(file);

    const onNombreChanged = e => setNombre(e.target.value);

    const onSaveEquipoClicked = () => {
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('file', selectedFile);
            dispatch(updateEquipo({id: equipo.id, equipo: formData}));
            router.navigate(paths.gestionEquipos, {replace: true});
        } catch (error) {
            console.error('Failed to save equipo', error);
        } finally {
            setFormSubmitted(true);
            setSelectedFile(null);
        }
    }

    return (
        <section className="addequipo">
            <h2>Actualizar equipo</h2>
            <form className="addequipo-form">
                <FileInputField
                    formSubmitted={formSubmitted}
                    onHandleFileChange={onHandleFileChange}
                    prevImgUrl={imgUrl + equipo.foto}
                />
                <TextField
                    required
                    id="nombre"
                    label="Nombre"
                    value={nombre}
                    onChange={onNombreChanged}
                    sx={{minWidth: 300}}
                />
                <div className="addequipo-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onSaveEquipoClicked}>Actualizar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.gestionEquipos, {replace: true})}>Cancelar</Button>
                </div>
            </form>
        </section>
    )
}

export default UpdateEquipoForm;