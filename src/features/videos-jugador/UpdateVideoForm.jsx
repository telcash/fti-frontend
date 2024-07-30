import { useDispatch, useSelector } from "react-redux"
import { getJugadorSelected } from "../jugadores/jugadoresSlice";
import { getVideoSelected, updateVideo } from "./videosJugadorSlice";
import { useState } from "react";
import { paths, router } from "../../router/router";
import { Button, TextField } from "@mui/material";
import './videos-jugador.css';

const UpdateVideoForm = () => {
    const dispatch = useDispatch();
    const jugador = useSelector(getJugadorSelected);
    const video = useSelector(getVideoSelected);

    const [nombre, setNombre] = useState(video.nombre);
    const [url, setUrl] = useState(video.url);

    const onNombreChanged = e => setNombre(e.target.value);
    const onUrlChanged = e => setUrl(e.target.value);

    const onUpdateVideo = () => {
        try {
            dispatch(updateVideo({id: video.id, video: {nombre: nombre, url: url, jugadorId: jugador.id}}));
            router.navigate(paths.jugadorDesarrolloTactico, {replace: true});
        } catch (error) {
            console.error('Failed to update video');
        }
    }

    return (
        <section className="addvideo">
            <h2>Actualizar video</h2>
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
                <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onUpdateVideo}>Actualizar</Button>
                <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.jugadorDesarrolloTactico, {replace: true})}>Cancelar</Button>
                </div>
            </form>
        </section>
    )
}

export default UpdateVideoForm;