import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosicionSelected, updatePosicion } from "./posicionesSlice";
import { Button, TextField } from "@mui/material";
import { paths, router } from "../../router/router";
import './posiciones.css';


const UpdatePosicionForm = () => {
    const dispatch = useDispatch();

    const posicion = useSelector(getPosicionSelected);

    const [nombre, setNombre] = useState(posicion.nombre);

    const onNombreChanged = e => setNombre(e.target.value);

    const onSavePosicionClicked = () => {
        try {
            dispatch(updatePosicion({id: posicion.id, posicion: {nombre: nombre}}));
            router.navigate(paths.gestionPosiciones, {replace: true});
        } catch (error) {
            console.error('Failed to save posicion', error);
        }
    }

    return (
        <section className="addposicion">
            <h2>Actualizar posición</h2>
            <form className="addposicion-form">
                <TextField
                    required
                    id="nombre"
                    label="Nombre"
                    value={nombre}
                    onChange={onNombreChanged}
                    sx={{minWidth: 300}}
                />
                <div div className="addposicion-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onSavePosicionClicked}>Actualizar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.gestionPosiciones, {replace: true})}>Cancelar</Button>
                </div>
            </form>
        </section>
    )
}

export default UpdatePosicionForm;