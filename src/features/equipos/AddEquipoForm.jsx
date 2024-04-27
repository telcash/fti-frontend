import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addEquipo } from "./equiposSlice";


const AddEquipoForm = () => {
    const dispatch = useDispatch();

    const [selectedFile, setSelectedFile] = useState(null);
    const [nombre, setNombre] = useState('');

    const handleFileChange = e => setSelectedFile(e.target.files[0]);
    const onNombreChanged = e => setNombre(e.target.value);

    const onSaveEquipoClicked = () => {
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('file', selectedFile);
            dispatch(addEquipo(formData));
        } catch (error) {
            console.error('Failed to save equipo', error);
        }
    }

    return (
        <section>
            <h2>Agregar equipo</h2>
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
                <div>
                    <Button variant="contained" onClick={onSaveEquipoClicked}>Salvar</Button>
                </div>
            </form>
        </section>
    )
}

export default AddEquipoForm;