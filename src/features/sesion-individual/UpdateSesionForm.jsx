import { useDispatch, useSelector } from "react-redux";
import { getSesionSelected } from "./sesionIndividualSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useEffect, useState } from "react";
import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { fetchJugadores, getJugadoresStatus, selectAllJugadores } from "../jugadores/jugadoresSlice";
import { fetchFundamentos, getFundamentosStatus, selectAllFundamentos } from "../fundamentos/fundamentosSlice";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const UpdateSesionForm = () => {
    const dispatch = useDispatch();
    
    const sesion = useSelector(getSesionSelected);

    const jugadores = useSelector(selectAllJugadores);
    const jugadoresStatus = useSelector(getJugadoresStatus);

    const fundamentos = useSelector(selectAllFundamentos);
    const fundamentosStatus = useSelector(getFundamentosStatus);

    const [fecha, setFecha] = useState(dayjs(sesion.fecha));
    const [jugadorId, setJugador] = useState(sesion.jugador.id);
    const [fundamentosDefensivos, setFundamentosDefensivos] = useState(
        sesion.ejercicios.map(ejercicio => {
            if(ejercicio.fundamento.tipo === 'Defensivo') {
                return ejercicio.fundamento.nombre;
            }
            return null;
        })
    );  
    const [fundamentosOfensivos, setFundamentosOfensivos] = useState(
        sesion.ejercicios.map(ejercicio => {
            if(ejercicio.fundamento.tipo === 'Ofensivo') {
                return ejercicio.fundamento.nombre;
            }
            return null;
        })
    );

    const onFechaChanged = e => setFecha(e);
    const onJugadorChanged = e => setJugador(e.target.value);

    const handleFundamentosDefensivosChange = (event) => {
        const { target: { value } } = event;
        setFundamentosDefensivos(typeof value === 'string' ? value.split(',') : value);
    };

    const handleFundamentosOfensivosChange = (event) => {
        const { target: { value } } = event;
        setFundamentosOfensivos(typeof value === 'string' ? value.split(',') : value);
    };

    useEffect(() => {
        if(jugadoresStatus === 'idle') {
            dispatch(fetchJugadores());
        }
    }, [jugadoresStatus, dispatch])

    useEffect(() => {
        if(fundamentosStatus === 'idle') {
            dispatch(fetchFundamentos());
        }
    }, [fundamentosStatus, dispatch])

    return (
        <section className="addsesion">
            <h2>Actualizar sesion</h2>
            <form className="addsesion-form">
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                    <DatePicker
                        label="Fecha"
                        value={fecha}
                        onChange={onFechaChanged}
                    />
                </LocalizationProvider>
                <FormControl sx={{ minWidth: 300}}>
                    <InputLabel id="jugador-label">Jugador</InputLabel>
                    <Select
                        labelId="jugador-label"
                        id="jugador"
                        value={jugadorId}
                        label="Jugador"
                        onChange={onJugadorChanged}
                    >
                        {jugadores.map(jugador => (
                            <MenuItem key={jugador.id} value={jugador.id}>
                                {jugador.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{m: 1, width: 300}}>
                    <InputLabel id="fundamento-defensivo-label">Fundamentos Defensivos</InputLabel>
                    <Select
                        labelId="fundamento-defensivo-label"
                        id="fundamento-defensivo"
                        value={fundamentosDefensivos}
                        label="Fundamento Defensivo"
                        multiple
                        onChange={handleFundamentosDefensivosChange}
                        input={<OutlinedInput label="Fundamento Defensivo" />}
                        MenuProps={MenuProps}
                    >
                        {fundamentos.filter(fundamento => fundamento.tipo === 'Defensivo').map((fundamento) => (
                            <MenuItem key={fundamento.id} value={fundamento.nombre}>
                                {fundamento.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{m: 1, width: 300}}>
                    <InputLabel id="fundamento-ofensivo-label">Fundamentos Ofensivos</InputLabel>
                    <Select
                        labelId="fundamento-ofensivo-label"
                        id="fundamento-ofensivo"
                        value={fundamentosOfensivos}
                        label="Fundamento Ofensivo"
                        multiple
                        onChange={handleFundamentosOfensivosChange}
                        input={<OutlinedInput label="Fundamento Ofensivo" />}
                        MenuProps={MenuProps}
                    >
                        {fundamentos.filter(fundamento => fundamento.tipo === 'Ofensivo').map((fundamento) => (
                            <MenuItem key={fundamento.id} value={fundamento.nombre}>
                                {fundamento.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <div>
                    <Button variant="contained">Actualizar</Button>
                </div>
            </form>
        </section>
    )
}

export default UpdateSesionForm;