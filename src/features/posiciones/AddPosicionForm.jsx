import { Button, TextField } from "@mui/material"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addPosicion } from "./posicionesSlice";


const AddPosicionForm = () => {
    const dispatch = useDispatch();

    const [nombre, setNombre] = useState('');

    const onNombreChanged = e => setNombre(e.target.value);

    const onSavePosicionClicked = () => {
        try {
            dispatch(addPosicion({nombre: nombre}));
        } catch (error) {
            console.error('Failed to save posicion', error);
        } finally {
            setNombre('');
        }
    }

    return (
        <section className="addposicion">
            <h2>Agregar posición</h2>
            <form className="addposicion-form">
                <TextField
                    required
                    id="nombre"
                    label="Nombre"
                    value={nombre}
                    onChange={onNombreChanged}
                    sx={{minWidth: 300}}
                />
                <div>
                    <Button variant="contained" onClick={onSavePosicionClicked}>Salvar</Button>
                </div>
            </form>
        </section>
    )
}

export default AddPosicionForm;