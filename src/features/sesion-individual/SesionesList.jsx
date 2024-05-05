import { useDispatch, useSelector } from "react-redux"
import { deleteSesion, fetchSesiones, getSesionesError, getSesionesStatus, getSesionSelected, selectAllSesiones, sesionSelected } from "./sesionIndividualSlice";
import { useEffect, useState } from "react";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import dayjs from 'dayjs';
import { paths, router } from "../../router/router";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SimpleDialog from "../../components/simple-dialog/SimpleDialog";


const SesionesList = () => {
    const dispatch = useDispatch();

    const sesiones = useSelector(selectAllSesiones);
    const sesion = useSelector(getSesionSelected);
    const sesionesStatus = useSelector(getSesionesStatus);
    const error = useSelector(getSesionesError);

    const [open, setOpen] = useState(false);

    const handleClickOpen =(sesion) => {
        dispatch(sesionSelected(sesion));
        setOpen(true);
    }

    const handleClose = (value) => {
        setOpen(false);
        if(value === 'Eliminar') {
            dispatch(deleteSesion(sesion.id));
        }
    }

    useEffect(() => {
        if(sesionesStatus === 'idle') {
            dispatch(fetchSesiones());
        }
    }, [sesionesStatus, dispatch])

    let content;

    if(sesionesStatus === 'loading') {
        content = <p>"Loading..."</p>
    } else if (sesionesStatus === 'succeeded') {
        content = (
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="lista sesiones">
                    <TableHead sx={{backgroundColor:'#273237'}}>
                        <TableRow>
                            <TableCell align="center" sx={{color: 'white'}}>Fecha</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Jugador</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Ejercicios</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sesiones.map((sesion) => (
                            <TableRow
                                key={sesion.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{dayjs(sesion.fecha).format('DD/MM/YYYY')}</TableCell>
                                <TableCell align="center">{`Id: ${sesion.jugador.id} - ${sesion.jugador.nombre} ${sesion.jugador.apellido}`}</TableCell>
                                <TableCell align="center">
                                    {sesion.ejercicios.map(ejercicio => (
                                        <div key={ejercicio.id}>
                                            {`${ejercicio.fundamento.tipo.slice(0, 3)} - ${ejercicio.fundamento.nombre} : ${ejercicio.valoracion}/${ejercicio.valoracionMaxima}`}
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell align="center">
                                    <div className="action-buttons">
                                        <IconButton
                                            onClick={() => {
                                                dispatch(sesionSelected(sesion));
                                                router.navigate(paths.actualizarSesionIndividual, {replace: true});
                                            }}
                                        >
                                            <EditIcon color="primary"/>
                                        </IconButton>
                                        <IconButton onClick={() => handleClickOpen(sesion)}>
                                            <DeleteIcon color="primary"/>
                                        </IconButton>
                                    </div>
                                </TableCell>
                                <SimpleDialog 
                                    title="Eliminar Sesion"
                                    contentText={`¿Deseas eliminar la sesión de Id ${sesion.id}?`}
                                    open={open}
                                    onClose={handleClose}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    } else if (sesionesStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section>
            <div>
                <Button variant="contained" sx={{mb: 1}} onClick={() => router.navigate(paths.agregarSesionIndividual, {replace: true})} >Añadir sesión</Button>
            </div>
            {content}
        </section>
    )
}

export default SesionesList;