import { useDispatch, useSelector } from "react-redux"
import { getEquiposStatus, selectAllEquipos, getEquiposError, fetchEquipos } from "./equiposSlice";
import { useEffect } from "react";


const EquiposList = () => {
    const dispatch = useDispatch();

    const equipos = useSelector(selectAllEquipos);
    const equiposStatus = useSelector(getEquiposStatus);
    const error = useSelector(getEquiposError);

    useEffect(() => {
        if (equiposStatus === 'idle') {
            dispatch(fetchEquipos());
        }
    }, [equiposStatus, dispatch])

    let content;
    if(equiposStatus === 'loading') {
        content = <p>"Loading..."</p>
    } else if (equiposStatus === 'succeeded') {
        content = equipos.map(equipo => <h1>{equipo.nombre}</h1>)
    } else if (equiposStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section>
            <h2>Equipos</h2>
            {content}
        </section>
    )
}

export default EquiposList;