import { useDispatch, useSelector } from "react-redux"
import { getEquiposStatus, selectAllEquipos, getEquiposError, fetchEquipos, getEquipoSelected, equipoSelected, deleteEquipo } from "./equiposSlice";
import { useEffect, useState } from "react";
import { Avatar, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { paths, router } from '../../router/router';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SimpleDialog from "../../components/simple-dialog/SimpleDialog";
import './equipos.css';

const EquiposList = () => {

    const imgUrl = process.env.REACT_APP_API_STATIC_SERVER + "equipos/"

    const dispatch = useDispatch();

    const equipos = useSelector(selectAllEquipos);
    const equipo = useSelector(getEquipoSelected);
    const equiposStatus = useSelector(getEquiposStatus);
    const error = useSelector(getEquiposError);

    const [open, setOpen] = useState(false);
    const handleClickOpen = (equipo) => {
        dispatch(equipoSelected(equipo));
        setOpen(true);
    };
    const handleClose = (value) => {
        setOpen(false);
        if (value === 'Eliminar') {
            dispatch(deleteEquipo(equipo.id));
        }
    };

    useEffect(() => {
        if (equiposStatus === 'idle') {
            dispatch(fetchEquipos());
        }
    }, [equiposStatus, dispatch])

    let content;
    if(equiposStatus === 'loading') {
        content = <p>"Loading..."</p>
    } else if (equiposStatus === 'succeeded') {
        content = (
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="lista equipos">
                    <TableHead sx={{backgroundColor:'#273237'}}>
                        <TableRow>
                            <TableCell align="center" sx={{color: 'white'}}>Imagen</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Nombre</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Id</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {equipos && equipos.map((equipo) => (
                            <TableRow
                                key={equipo.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center" sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                    <Avatar src={imgUrl + equipo.foto}/>
                                </TableCell>
                                <TableCell align="center">{equipo.nombre}</TableCell>
                                <TableCell align="center">{equipo.id}</TableCell>
                                <TableCell align="center">
                                    <div className="action-buttons">
                                        <IconButton
                                            onClick={() => {
                                                dispatch(equipoSelected(equipo));
                                                router.navigate(paths.actualizarEquipo, {replace: true});
                                            }}
                                        >
                                            <EditIcon color="primary"/>
                                        </IconButton>
                                        <IconButton onClick={() => handleClickOpen(equipo)}>
                                            <DeleteIcon color="primary"/>
                                        </IconButton>
                                    </div>
                                </TableCell>
                                <SimpleDialog 
                                    title="Eliminar equipo"
                                    contentText={`¿Deseas eliminar al equipo ${equipo.nombre}?`}
                                    open={open}
                                    onClose={handleClose}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    } else if (equiposStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section>
            <div>
                <Button variant="contained" sx={{mb: 1}} onClick={() => router.navigate(paths.agregarEquipo, {replace: true})} >Añadir equipo</Button>
            </div>
            {content}
        </section>
    )
}

export default EquiposList;