import React, { useEffect, useRef } from "react";
import { Avatar, Container } from "@mui/material";

const imgUrl = process.env.REACT_APP_API_STATIC_SERVER + "jugadores/";

const JugadorAvatar = ({ fotoJugador, nombre, apellido, posicion, darkMode }) => {

    const avatarRef = useRef();

    useEffect(() => {
        const avatarElement = avatarRef.current;
        if (avatarElement) {
            const imgElement = avatarElement.querySelector('img');
            if (imgElement) {
                imgElement.setAttribute('draggable', 'false');
            }
        }
    }, []);

    return (
        <Container className="avatar-container" sx={{width: 200, m:0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Avatar
                ref={avatarRef}
                alt="avatar jugador"
                src={fotoJugador ? imgUrl + fotoJugador : ""}
                sx={{ width: 56, height: 56 }}
            />
            <div className={darkMode ? 'avatar-info-dark' : 'avatar-info'}>
                {
                    (nombre && apellido) && (
                        <h5>{`${nombre} ${apellido}`.slice(0,18)}</h5>
                    )
                }
                {
                    posicion && (
                        <h6>{posicion}</h6>
                    )
                }
            </div>
        </Container>
    )
}

export default JugadorAvatar;