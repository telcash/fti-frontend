import { useDispatch, useSelector } from "react-redux"
import { deletePartido, fetchPartidos, getPartidoSelected, getPartidosError, getPartidosStatus, partidoSelected, selectAllPartidos } from "./partidosSlice";
import { useEffect, useState } from "react";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { paths, router } from "../../router/router";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SimpleDialog from "../../components/simple-dialog/SimpleDialog";
import dayjs from 'dayjs';


const PartidosList = () => {
    const dispatch = useDispatch();

    const partidos = useSelector(selectAllPartidos);
    const partido = useSelector(getPartidoSelected);
    const partidosStatus = useSelector(getPartidosStatus);
    const error = useSelector(getPartidosError);

    const [open, setOpen] = useState(false);

    const handleClickOpen = (partido) => {
        dispatch(partidoSelected(partido));
        setOpen(true);
    }

    const handleClose = (value) => {
        setOpen(false);
        if(value === 'Eliminar') {
            dispatch(deletePartido(partido.id));
        }
    }

    useEffect(() => {
        if (partidosStatus === 'idle') {
            dispatch(fetchPartidos());
        }
    }, [partidosStatus, dispatch])

    let content;
    if(partidosStatus === 'loading') {
        content = <p>"Loading..."</p>
    } else if (partidosStatus === 'succeeded') {
        content = (
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="lista partidos">
                    <TableHead sx={{backgroundColor:'#273237'}}>
                        <TableRow>
                            <TableCell align="center" sx={{color: 'white'}}>Fecha</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Equipo Local</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Equipo Visitante</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Resultado</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Id</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {partidos.map((partido) => (
                            <TableRow
                                key={partido.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{dayjs(partido.fecha).format('DD/MM/YYYY')}</TableCell>
                                <TableCell align="center">{(partido.equipoLocal && partido.equipoLocal.nombre) ?? ''}</TableCell>
                                <TableCell align="center">{(partido.equipoVisitante && partido.equipoVisitante.nombre) ?? ''}</TableCell>
                                <TableCell align="center">{(partido.golesLocal && partido.golesVisitante) ? `${partido.golesLocal} - ${partido.golesVisitante}` : ''}</TableCell>
                                <TableCell align="center">{partido.id}</TableCell>
                                <TableCell align="center">
                                    <div className="action-buttons">
                                        <IconButton
                                            onClick={() => {
                                                dispatch(partidoSelected(partido));
                                                router.navigate(paths.actualizarPartido, {replace: true});
                                            }}
                                        >
                                            <EditIcon color="primary"/>
                                        </IconButton>
                                        <IconButton onClick={() => handleClickOpen(partido)}>
                                            <DeleteIcon color="primary"/>
                                        </IconButton>
                                    </div>
                                </TableCell>
                                <SimpleDialog 
                                    title="Eliminar Partido"
                                    contentText={`¿Deseas eliminar el partido de Id ${partido.id}?`}
                                    open={open}
                                    onClose={handleClose}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    } else if (partidosStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section>
            <div>
                <Button variant="contained" sx={{mb: 1}} onClick={() => router.navigate(paths.agregarPartido, { replace: true})} >Añadir partido</Button>
            </div>
            {content}
        </section>
    )
}

export default PartidosList;