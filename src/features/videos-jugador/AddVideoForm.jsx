import { useDispatch, useSelector } from "react-redux"
import { getJugadorSelected } from "../jugadores/jugadoresSlice";
import { Button, TextField } from "@mui/material";
import { paths, router } from "../../router/router";
import { useState } from "react";
import { addVideo } from "./videosJugadorSlice";


const AddVideoForm = () => {
    const dispatch = useDispatch();
    const jugador = useSelector(getJugadorSelected);

    const [nombre, setNombre] = useState('');
    const [url, setUrl] = useState('');

    const onNombreChanged = e => setNombre(e.target.value);
    const onUrlChanged = e => setUrl(e.target.value);

    const onSaveVideo = () => {
        try {
            dispatch(addVideo({nombre: nombre, url: url, jugadorId: jugador.id}));
            router.navigate(paths.jugadorDesarrolloTactico, {replace: true})
        } catch (error) {
            console.error('Failed to save video');
        } finally {
            setNombre('');
            setUrl('');
        }
    }

    return (
        <section className="addvideo">
            <h2>Añadir video</h2>
            <form className="addvideo-form">
                <div className="addvideo-form-fields">
                    <TextField
                        required
                        id="nombre"
                        label="Nombre"
                        value={nombre}
                        onChange={onNombreChanged}
                        sx={{minWidth: 300}}
                    />
                    <TextField
                        required
                        id="url"
                        label="URL"
                        value={url}
                        onChange={onUrlChanged}
                        sx={{minWidth: 300}}
                    />
                </div>
                <div className="addvideo-form-buttons">
                <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onSaveVideo}>Salvar</Button>
                <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.jugadorDesarrolloTactico, {replace: true})}>Cancelar</Button>
                </div>
            </form>
        </section>
    )
}

export default AddVideoForm;