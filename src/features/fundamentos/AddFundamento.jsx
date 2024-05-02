import { useState } from "react";
import { useDispatch } from "react-redux"
import { addFundamento } from "./fundamentosSlice";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";


const AddFundamentoForm = () => {
    const dispatch = useDispatch();

    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');

    const onNombreChanged = e => setNombre(e.target.value);
    const onTipoChanged = e => setTipo(e.target.value);

    const onSaveFundamentoClicked = () => {
        try {
            dispatch(addFundamento({nombre: nombre, tipo: tipo}));
        } catch (error) {
            console.error('Failed to save fundamento', error);
        } finally {
            setNombre('');
            setTipo('');
        }
    }

    return (
        <section className="addfundamento">
            <h2>Agregar fundamento</h2>
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
                <div>
                    <Button variant="contained" onClick={onSaveFundamentoClicked}>Salvar</Button>
                </div>
            </form>
        </section>
    )
}

export default AddFundamentoForm;