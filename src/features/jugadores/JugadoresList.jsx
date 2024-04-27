import { useDispatch, useSelector } from "react-redux"
import { getJugadoresStatus, selectAllJugadores, getJugadoresError, fetchJugadores, deleteJugador, jugadorSelected, getJugadorSelected } from "./jugadoresSlice";
import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import { Button, IconButton, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Paper from '@mui/material/Paper';
import calculateAge from '../../utils/calculateAge';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './jugadores.css';
import SimpleDialog from "../../components/SimpleDialog";
import { router } from '../../components/mainDrawer/MainDrawer';

const JugadoresList = () => {
    const dispatch = useDispatch();

    //const [jugadorId, setJugadorId] = useState(0);
    const jugadores = useSelector(selectAllJugadores);
    const jugadorSelectedId = useSelector(getJugadorSelected);
    const jugadoresStatus = useSelector(getJugadoresStatus);
    const error = useSelector(getJugadoresError);

    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('Cancelar');
    const handleClickOpen = (id) => {
        dispatch(jugadorSelected(id));
        setOpen(true);
      };
    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
        if (value === 'Eliminar') {
            dispatch(deleteJugador(jugadorSelectedId));
        }
    }


    useEffect(() => {
        if (jugadoresStatus === 'idle') {
            dispatch(fetchJugadores());
        }
    }, [jugadoresStatus, dispatch])

    let content;
    if(jugadoresStatus === 'loading') {
        content = <p>"Loading..."</p>
    } else if (jugadoresStatus === 'succeeded') {
        content = (
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="lista jugadores">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Imagen</TableCell>
                            <TableCell align="right">Nombre</TableCell>
                            <TableCell align="right">Apellido</TableCell>
                            <TableCell align="right">Apodo</TableCell>
                            <TableCell align="right">Edad</TableCell>
                            <TableCell align="right">Posicion</TableCell>
                            <TableCell align="right">Inicio de Contrato</TableCell>
                            <TableCell align="right">Finalización de Contrato</TableCell>
                            <TableCell align="right">Id</TableCell>
                            <TableCell align="center">Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jugadores.map((jugador) => (
                            <TableRow
                                key={jugador.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="right">IMG</TableCell>
                                <TableCell align="right">{jugador.nombre}</TableCell>
                                <TableCell align="right">{jugador.apellido}</TableCell>
                                <TableCell align="right">{jugador.apodo}</TableCell>
                                <TableCell align="right">{calculateAge(jugador.fNac)}</TableCell>
                                <TableCell align="right">{jugador.posicion ? jugador.posicion.nombre : ''}</TableCell>
                                <TableCell align="right">{jugador.iniContrato}</TableCell>
                                <TableCell align="right">{jugador.finContrato}</TableCell>
                                <TableCell align="right">{jugador.id}</TableCell>
                                <TableCell align="right">
                                    <div className="action-buttons">
                                        <IconButton>
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton onClick={() => handleClickOpen(jugador.id)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </div>
                                </TableCell>
                                <SimpleDialog 
                                    title="Eliminar Jugador"
                                    contentText={`¿Deseas eliminar al jugador ${jugador.nombre}?`}
                                    open={open}
                                    onClose={handleClose}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    } else if (jugadoresStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section>
            <div>
                <Button variant="contained" onClick={() => router.navigate('../agregar-jugador')} >Añadir jugador</Button>
            </div>
            {content}
        </section>
    )
}

export default JugadoresList;