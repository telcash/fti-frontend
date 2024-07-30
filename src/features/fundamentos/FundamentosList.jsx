import { useDispatch, useSelector } from "react-redux"
import { deleteFundamento, fetchFundamentos, fundamentoSelected, getFundamentoSelected, getFundamentosError, getFundamentosStatus, selectAllFundamentos } from "./fundamentosSlice";
import { useEffect, useState } from "react";
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { paths, router } from '../../router/router';
import SimpleDialog from "../../components/simple-dialog/SimpleDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';



const FundamentosList = () => {
    const dispatch = useDispatch();

    const fundamentos = useSelector(selectAllFundamentos);
    const fundamento = useSelector(getFundamentoSelected);
    const fundamentosStatus = useSelector(getFundamentosStatus);
    const error = useSelector(getFundamentosError);

    const [open, setOpen] = useState(false);

    const handleClickOpen = (id) => {
        dispatch(fundamentoSelected(id));
        setOpen(true);
    }
    const handleClose = (value) => {
        setOpen(false);
        if(value === "Eliminar") {
            dispatch(deleteFundamento(fundamento.id));
        }
    }

    useEffect(() => {
        if (fundamentosStatus === 'idle') {
            dispatch(fetchFundamentos());
        }
    }, [fundamentosStatus, dispatch])

    let content;

    if (fundamentosStatus === 'loading') {
        content = <p>"Loading..."</p>
    } else if (fundamentosStatus === 'succeeded') {
        content = (
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="lista fundamentos">
                    <TableHead sx={{backgroundColor:'#273237'}}>
                        <TableRow>
                            <TableCell align="center" sx={{color: 'white'}}>Nombre</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Tipo</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Id</TableCell>
                            <TableCell align="center" sx={{color: 'white'}}>Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fundamentos && Array.isArray(fundamentos) && fundamentos.map((f) => (
                            <TableRow
                                key={f.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">{f.nombre}</TableCell>
                                <TableCell align="center">{f.tipo}</TableCell>
                                <TableCell align="center">{f.id}</TableCell>
                                <TableCell align="center">
                                    <div className="action-buttons">
                                        <IconButton
                                            onClick={() => {
                                                dispatch(fundamentoSelected(f));
                                                router.navigate(paths.actualizarFundamento, {replace: true});
                                            }}
                                        >
                                            <EditIcon color="primary"/>
                                        </IconButton>
                                        <IconButton onClick={() => handleClickOpen(f)}>
                                            <DeleteIcon color="primary"/>
                                        </IconButton>
                                    </div>
                                </TableCell>
                                <SimpleDialog 
                                    title="Eliminar fundamento"
                                    contentText={`¿Deseas eliminar el fundamento ${fundamento ? fundamento.nombre : ''} de tipo ${fundamento ? fundamento.tipo: ''}?`}
                                    open={open}
                                    onClose={handleClose}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    } else if (fundamentosStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section>
            <div>
                <Button variant="contained" sx={{mb: 1}} onClick={() => router.navigate(paths.agregarFundamento, {replace: true})} >Añadir fundamento</Button>
            </div>
            {content}
        </section>
    )
}

export default FundamentosList;