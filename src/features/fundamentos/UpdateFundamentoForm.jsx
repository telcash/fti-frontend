import { useDispatch, useSelector } from "react-redux"
import { getFundamentoSelected, updateFundamento } from "./fundamentosSlice";
import { useState } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import './fundamentos.css';
import { paths, router } from "../../router/router";


const UpdateFundamentoForm = () => {
    const dispatch = useDispatch();
    const fundamento = useSelector(getFundamentoSelected);

    const [nombre, setNombre] = useState(fundamento.nombre);
    const [tipo, setTipo] = useState(fundamento.tipo);

    const onNombreChanged = e => setNombre(e.target.value);
    const onTipoChanged = e => setTipo(e.target.value);

    const onSaveFundamentoClicked = () => {
        try {
            dispatch(updateFundamento({id: fundamento.id, fundamento: {nombre: nombre, tipo: tipo}}));
            router.navigate('../gestion-fundamentos');
        } catch (error) {
            console.error('Failed to save fundamento', error);
        }
    }

    return (
        <section className="addfundamento">
            <h2>Actualizar fundamento</h2>
            <form className="addposicion-form">
                <TextField
                    required
                    id="nombre"
                    label="Nombre"
                    value={nombre}
                    onChange={onNombreChanged}
                    sx={{minWidth: 300}}
                />
                <FormControl sx={{minWidth: 300}}>
                    <InputLabel id="tipo-label">Tipo</InputLabel>
                    <Select
                        labelId="tipo-label"
                        id="tipo"
                        value={tipo}
                        label="Tipo"
                        onChange={onTipoChanged}
                    >
                        <MenuItem value="Defensivo">Defensivo</MenuItem>
                        <MenuItem value="Ofensivo">Ofensivo</MenuItem>
                    </Select>
                </FormControl>
                <div className="addfundamento-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onSaveFundamentoClicked}>Actualizar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.gestionFundamentos, {replace: true})}>Cancelar</Button>
                </div>
            </form>
        </section>
    )
}

export default UpdateFundamentoForm;