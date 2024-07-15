import React, { useEffect, useRef } from "react";
import { Avatar, Container } from "@mui/material";

const imgUrl = process.env.REACT_APP_API_STATIC_SERVER + "jugadores/";

const JugadorAvatar = ({ jugador, cancha }) => {

    const avatarRef = useRef();

    const imgSize = cancha ? 56 : 112;

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
                src={jugador.foto ? imgUrl + jugador.foto : ""}
                sx={{ width: imgSize, height: imgSize }}
            />
            <div className={cancha ? 'avatar-info-dark' : 'avatar-info'}>
                {
                    !cancha && jugador.nombre && jugador.apellido && (
                        <h5>{`${jugador.nombre} ${jugador.apellido}`}</h5>
                    )
                }
                {
                    !cancha && jugador.posicion && jugador.posicion.nombre && (
                        <h6>{jugador.posicion.nombre}</h6>
                    )
                }
                {
                    cancha && (
                        <h5>{jugador.apodo ? jugador.apodo : '---'}</h5>
                    )
                }
            </div>
        </Container>
    )
}

export default JugadorAvatar;