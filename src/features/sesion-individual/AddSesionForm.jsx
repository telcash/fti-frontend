import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, FormControl, Input, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchJugadores, getJugadoresStatus, selectAllJugadores } from "../jugadores/jugadoresSlice";
import { fetchFundamentos, getFundamentosStatus, selectAllFundamentos } from "../fundamentos/fundamentosSlice";
import { paths, router } from "../../router/router";
import { addSesion, fetchSesiones } from "./sesionIndividualSlice";
import { addEjercicio } from "../ejercicios/ejerciciosSlice";

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
    const [jugadorId, setJugadorId] = useState('');
    const [fundamentosDefensivos, setFundamentosDefensivos] = useState([]);
    const [fundamentosOfensivos, setFundamentosOfensivos] = useState([]);
    const [ejercicios, setEjercicios] = useState([]);

    const onFechaChanged = e => setFecha(e);
    const onJugadorChanged = e => setJugadorId(e.target.value);
    const handleFundamentosDefensivosChange = (event) => {
        const { target: { value } } = event;
        setFundamentosDefensivos(typeof value === 'string' ? value.split(',') : value);
    };
    const handleFundamentosOfensivosChange = (event) => {
        const { target: { value } } = event;
        setFundamentosOfensivos(typeof value === 'string' ? value.split(',') : value);
    };

    const handleValoracionDefensivaChange = (e, fundamento) => {
        setEjercicios({
            ...ejercicios,
            [fundamento]: {
                ...ejercicios[fundamento],
                valoracion: e.target.value
            }
        })
    }
    const handleValoracionDefensivaMaxChange = (e, fundamento) => {
        setEjercicios({
            ...ejercicios,
            [fundamento]: {
                ...ejercicios[fundamento],
                valoracionMax: e.target.value
            }
        })
    }
    const handleValoracionOfensivaChange = (e, fundamento) => { 
        setEjercicios({
            ...ejercicios,
            [fundamento]: {
                ...ejercicios[fundamento],
                valoracion: e.target.value
            }
        })
    }
    const handleValoracionOfensivaMaxChange = (e, fundamento) => {
        setEjercicios({
            ...ejercicios,
            [fundamento]: {
                ...ejercicios[fundamento],
                valoracionMax: e.target.value
            }
        })
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

    const onSaveSesionClicked = () => {
        try {
            dispatch(addSesion({
                fecha: fecha,
                jugadorId: jugadorId,
            }))
            .then((response) => {
                const sesionId = response.payload.id;
                if(sesionId) {
                    const ejerciciosDefensivosPromises = fundamentosDefensivos.map(fundamento => {
                        return dispatch(addEjercicio({
                            sesionIndividualId: sesionId,
                            fundamentoName: fundamento,
                            valoracion: ejercicios[fundamento].valoracion || 0,
                            valoracionMaxima: ejercicios[fundamento].valoracionMax || ejercicios[fundamento].valoracion || 20,
                        }))
                    })
                    const ejerciciosOfensivosPromises = fundamentosOfensivos.map(fundamento => {
                        return dispatch(addEjercicio({
                            sesionIndividualId: sesionId,
                            fundamentoName: fundamento,
                            valoracion: ejercicios[fundamento].valoracion || 0,
                            valoracionMaxima: ejercicios[fundamento].valoracionMax || ejercicios[fundamento].valoracion || 20,
                        }))
                    })
                    Promise.all([...ejerciciosDefensivosPromises, ...ejerciciosOfensivosPromises])
                    .then(() => {
                        dispatch(fetchSesiones())
                        .then(() => {
                            router.navigate(paths.gestionSesionesIndividuales, {replace: true});
                        })
                    })
                }
            })
        } catch (error) {
            console.error('Failed to save sesion', error);
        }
    }

    return (
        <section className="addsesion">
            <h2>Salvar sesión</h2>
            <form className="addsesion-form">
                <div className="addsesion-form-s1">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                        <DatePicker
                        sx={{minWidth: 300}}
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
                                    {`Id: ${jugador.id} - ${jugador.nombre} ${jugador.apellido}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>   
                <div className="addsesion-form-s2">
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
                    {fundamentosDefensivos.map((fundamento, index) => (
                        <div className="addsesion-form-ejercicios" key={index}>
                            <div className="addsesion-form-ejercicio">
                                <h3>{fundamento}:</h3>
                                <Input
                                    sx={{width: 200}}
                                    size="small"
                                    placeholder="Valoración"
                                    type="number"
                                    onChange={(e) => handleValoracionDefensivaChange(e, fundamento)}
                                    inputProps={{ 
                                        min: 0, 
                                        max: ejercicios[fundamento]?.valoracionMax || 20 ,
                                    }}
                                />
                                <Input
                                    sx={{width: 200}}
                                    size="small"
                                    placeholder="Valoración máxima"
                                    type="number"
                                    onChange={(e) => handleValoracionDefensivaMaxChange(e, fundamento)}
                                    inputProps={{
                                        min: ejercicios[fundamento]?.valoracion || 20,
                                        max: 20,
                                    }}
                                />
                            </div>
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
                    {fundamentosOfensivos.map((fundamento, index) => (
                        <div className="addsesion-form-ejercicios" key={index}>
                            <div className="addsesion-form-ejercicio">
                                <h3>{fundamento}:</h3>
                                <Input
                                    sx={{width: 200}}
                                    size="small"
                                    placeholder="Valoración"
                                    type="number"
                                    inputProps={{ 
                                        min: 0, 
                                        max: ejercicios[fundamento]?.valoracionMax || 20 ,
                                    }}
                                    onChange={(e) => handleValoracionOfensivaChange(e, fundamento)}
                                />
                                <Input
                                    sx={{width: 200}}
                                    size="small"
                                    placeholder="Valoración máxima"
                                    type="number"
                                    onChange={(e) => handleValoracionOfensivaMaxChange(e, fundamento)}
                                    inputProps={{
                                        min: ejercicios[fundamento]?.valoracion || 0,
                                        max: 20,
                                    }}
                                />
                            </div>
                        </div>     
                    ))}
                </div>
                <div className="addsesion-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onSaveSesionClicked}>Salvar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.gestionSesionesIndividuales, {replace: true})}>Cancelar</Button>
                </div>     
            </form>
        </section>
    )
}

export default AddSesionForm;