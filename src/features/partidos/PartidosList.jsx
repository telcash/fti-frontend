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
    const [partidosSorted, setPartidosSorted] = useState([]);

    useEffect(() => {
        if(partidos) {
            const mutablePartidos = [...partidos];
            setPartidosSorted(mutablePartidos.sort((a, b) => dayjs(b.fecha).valueOf() - dayjs(a.fecha).valueOf()));
        }
    }, [partidos])

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
                        {partidosSorted && Array.isArray(partidosSorted) && partidosSorted.map((p) => (
                            <TableRow
                                key={p.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{dayjs(p.fecha).format('DD/MM/YYYY')}</TableCell>
                                <TableCell align="center">{(p.equipoLocal && p.equipoLocal.nombre) ?? ''}</TableCell>
                                <TableCell align="center">{(p.equipoVisitante && p.equipoVisitante.nombre) ?? ''}</TableCell>
                                <TableCell align="center">{`${p.golesLocal} - ${p.golesVisitante}`}</TableCell>
                                <TableCell align="center">{p.id}</TableCell>
                                <TableCell align="center">
                                    <div className="action-buttons">
                                        <IconButton
                                            onClick={() => {
                                                dispatch(partidoSelected(p));
                                                router.navigate(paths.actualizarPartido, {replace: true});
                                            }}
                                        >
                                            <EditIcon color="primary"/>
                                        </IconButton>
                                        <IconButton onClick={() => handleClickOpen(p)}>
                                            <DeleteIcon color="primary"/>
                                        </IconButton>
                                    </div>
                                </TableCell>
                                <SimpleDialog 
                                    title="Eliminar Partido"
                                    contentText={`¿Deseas eliminar el partido de Id ${partido ? partido.id : ''}?`}
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