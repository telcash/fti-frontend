import React from "react";
import { Avatar, Container, Typography } from "@mui/material";

const imgUrl = process.env.REACT_APP_API_STATIC_SERVER + "jugadores/";

const JugadorAvatar = ({ fotoJugador, nombre, apellido, posicion }) => {
    return (
        <Container sx={{maxWidth: 200, m:0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Avatar alt="avatar jugador" src={imgUrl + fotoJugador}/>
            {
                (nombre && apellido) && (
                    <Typography variant="h5" gutterBottom>{`${nombre} ${apellido}`}</Typography>
                )
            }
            {
                posicion && (
                    <Typography variant="h6" gutterBottom>{posicion}</Typography>
                )
            }
        </Container>
    )
}

export default JugadorAvatar;