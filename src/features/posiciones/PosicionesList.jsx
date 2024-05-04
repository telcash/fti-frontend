import { useDispatch, useSelector } from "react-redux"
import { deletePosicion, fetchPosiciones, getPosicionesError, getPosicionesStatus, getPosicionSelected, posicionSelected, selectAllPosiciones } from "./posicionesSlice";
import { useEffect, useState } from "react";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { paths, router } from '../../router/router';
import SimpleDialog from "../../components/simple-dialog/SimpleDialog";

const PosicionesList = () => {
    const dispatch = useDispatch();

    const posiciones = useSelector(selectAllPosiciones);
    const posicion = useSelector(getPosicionSelected);
    const posicionesStatus = useSelector(getPosicionesStatus);
    const error = useSelector(getPosicionesError);

    const [open, setOpen] = useState(false);

    const handleClickOpen = (id) => {
        dispatch(posicionSelected(id));
        setOpen(true);
    }
    const handleClose = (value) => {
        setOpen(false);
        if (value === 'Eliminar') {
            dispatch(deletePosicion(posicion.id));
        }
    };

    useEffect(() => {
        if (posicionesStatus === 'idle') {
            dispatch(fetchPosiciones());
        }
    }, [posicionesStatus, dispatch])

    let content;

    if (posicionesStatus === 'loading') {
        content = <p>"Loading..."</p>
    } else if (posicionesStatus === 'succeeded') {
        content = (
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="lista posiciones">
                    <TableHead sx={{backgroundColor:'#273237'}}>
                        <TableRow>
                            <TableCell align="center" sx={{color: 'white'}}>Nombre</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Id</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {posiciones.map((posicion) => (
                            <TableRow
                                key={posicion.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{posicion.nombre}</TableCell>
                                <TableCell align="center">{posicion.id}</TableCell>
                                <TableCell align="center">
                                    <div className="action-buttons">
                                        <IconButton
                                            onClick={() => {
                                                dispatch(posicionSelected(posicion));
                                                router.navigate(paths.actualizarPosicion, {replace: true});
                                            }}
                                        >
                                            <EditIcon color="primary"/>
                                        </IconButton>
                                        <IconButton onClick={() => handleClickOpen(posicion)}>
                                            <DeleteIcon color="primary"/>
                                        </IconButton>
                                    </div>
                                </TableCell>
                                <SimpleDialog 
                                    title="Eliminar posición"
                                    contentText={`¿Deseas eliminar la posición ${posicion.nombre}?`}
                                    open={open}
                                    onClose={handleClose}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    } else if (posicionesStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section>
            <div>
                <Button variant="contained" sx={{mb: 1}} onClick={() => router.navigate(paths.agregarPosicion, {replace: true})} >Añadir posicion</Button>
            </div>
            {content}
        </section>
    )
}

export default PosicionesList;