import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { fetchJugadores, getJugadoresStatus, selectAllJugadores } from "../jugadores/jugadoresSlice";
import { addSesion, fetchSesiones } from "./sesionIndividualSlice";
import { paths, router } from "../../router/router";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Slider } from "@mui/material";
import { fetchFundamentos, getFundamentosStatus, selectAllFundamentos } from "../fundamentos/fundamentosSlice";
import { addEjercicio } from "../ejercicios/ejerciciosSlice";
import './sesiones.css';

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

const AddSesionForm = () => {
    const dispatch = useDispatch();
    
    const jugadores = useSelector(selectAllJugadores);
    const jugadoresStatus = useSelector(getJugadoresStatus);

    const fundamentos = useSelector(selectAllFundamentos);
    const fundamentosStatus = useSelector(getFundamentosStatus);

    const [fecha, setFecha] = useState(dayjs());
    const [jugadorId, setJugador] = useState('');
    const [fundamentosDefensivos, setFundamentosDefensivos] = useState([]);
    const [fundamentosOfensivos, setFundamentosOfensivos] = useState([]);
    const [ejerciciosDefensivos, setEjerciciosDefensivos] = useState({});
    const [ejerciciosOfensivos, setEjerciciosOfensivos] = useState({});

    const onFechaChanged = e => setFecha(e);
    const onJugadorChanged = e => setJugador(e.target.value);

    const onSaveSesionClicked = () => {
        try {
            dispatch(addSesion(
                {
                    fecha: fecha,
                    jugadorId: jugadorId,
                }
            ))
            .then((response) => {
                const sesionId = response.payload.id;
                if(sesionId) {
                    const fundamentosDefensivosPromises = fundamentosDefensivos.map((fundamento) => {
                        return dispatch(
                            addEjercicio({
                                sesionIndividualId: sesionId,
                                fundamentoName: fundamento,
                                valoracion: ejerciciosDefensivos[fundamento] || 0,
                            })
                        )
                    });
                    const fundamentosOfensivosPromises = fundamentosOfensivos.map((fundamento) => {
                        return dispatch(
                            addEjercicio({
                                sesionIndividualId: sesionId,
                                fundamentoName: fundamento,
                                valoracion: ejerciciosOfensivos[fundamento] || 0,
                            })
                        )
                    });
                    Promise.all(
                        [...fundamentosDefensivosPromises, ...fundamentosOfensivosPromises]
                    ).then(() => {
                        dispatch(fetchSesiones()).then(() => {
                            router.navigate(paths.gestionSesionesIndividuales, {replace: true});
                        });
                    });
                }
            });
        } catch (error) {
            console.error('Failed to save sesion', error);
        } finally {
            setFecha(dayjs());
            setJugador('');
        }
    }

    const handleFundamentosDefensivosChange = (event) => {
        const { target: { value } } = event;
        setFundamentosDefensivos(typeof value === 'string' ? value.split(',') : value);
    };

    const handleFundamentosOfensivosChange = (event) => {
        const { target: { value } } = event;
        setFundamentosOfensivos(typeof value === 'string' ? value.split(',') : value);
    };

    const handleValoracionFDefChange = (event, fundamentoName) => {
        setEjerciciosDefensivos({
            ...ejerciciosDefensivos,
            [fundamentoName]: event.target.value
        });
    }

    const handleValoracionFOfeChange = (event, fundamentoName) => {
        setEjerciciosOfensivos({
            ...ejerciciosOfensivos,
            [fundamentoName]: event.target.value
        });
    }

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
            <h2>Salvar sesion</h2>
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
                {fundamentosDefensivos.map(fundamento => (
                    <div className="addsesion-fundamento-slider" key={fundamento}>
                        <h4>{fundamento}</h4>
                        <Slider 
                            defaultValue={0}
                            valueLabelDisplay="on"
                            step={1}
                            marks
                            min={0}
                            max={10}
                            sx={{width: 300}}
                            onChange={(event) => handleValoracionFDefChange(event, fundamento)}
                        />
                    </div>
                ))}
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
                {fundamentosOfensivos.map(fundamento => (
                    <div className="addsesion-fundamento-slider" key={fundamento}>
                        <h4>{fundamento}</h4>
                        <Slider 
                            defaultValue={0}
                            valueLabelDisplay="on"
                            step={1}
                            marks
                            min={0}
                            max={10}
                            sx={{width: 300}}
                            onChange={(event) => handleValoracionFOfeChange(event, fundamento)}
                        />
                    </div>
                ))}
                <div className="addsesion-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onSaveSesionClicked}>Salvar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.gestionSesionesIndividuales, {replace: true})}>Cancelar</Button>
                </div>
            </form>
        </section>
    )
}

export default AddSesionForm;