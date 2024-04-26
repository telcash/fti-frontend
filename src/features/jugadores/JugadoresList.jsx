import { useDispatch, useSelector } from "react-redux"
import { getJugadoresStatus, selectAllJugadores, getJugadoresError, fetchJugadores } from "./jugadoresSlice";
import { useEffect } from "react";


const JugadoresList = () => {
    const dispatch = useDispatch();

    const jugadores = useSelector(selectAllJugadores);
    const jugadoresStatus = useSelector(getJugadoresStatus);
    const error = useSelector(getJugadoresError);

    useEffect(() => {
        if (jugadoresStatus === 'idle') {
            dispatch(fetchJugadores());
        }
    }, [jugadoresStatus, dispatch])

    let content;
    if(jugadoresStatus === 'loading') {
        content = <p>"Loading..."</p>
    } else if (jugadoresStatus === 'succeeded') {
        content = jugadores.map(jugador => <h1>{jugador.nombre}</h1>)
    } else if (jugadoresStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section>
            <h2>Jugadores</h2>
            {content}
        </section>
    )
}

export default JugadoresList;