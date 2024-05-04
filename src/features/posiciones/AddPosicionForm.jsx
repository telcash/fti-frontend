import { Button, TextField } from "@mui/material"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addPosicion } from "./posicionesSlice";
import './posiciones.css';
import { paths, router } from "../../router/router";

const AddPosicionForm = () => {
    const dispatch = useDispatch();

    const [nombre, setNombre] = useState('');

    const onNombreChanged = e => setNombre(e.target.value);

    const onSavePosicionClicked = () => {
        try {
            dispatch(addPosicion({nombre: nombre}));
            router.navigate(paths.gestionPosiciones, {replace: true});
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
                <div className="addposicion-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onSavePosicionClicked}>Salvar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.gestionPosiciones, {replace: true})}>Cancelar</Button>
                </div>
            </form>
        </section>
    )
}

export default AddPosicionForm;