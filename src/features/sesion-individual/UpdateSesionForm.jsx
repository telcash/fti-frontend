import { useDispatch, useSelector } from "react-redux";
import { fetchSesiones, getSesionSelected, updateSesion } from "./sesionIndividualSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useEffect, useState } from "react";
import { Button, FormControl, Input, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import { fetchJugadores, getJugadoresStatus, selectAllJugadores } from "../jugadores/jugadoresSlice";
import { fetchFundamentos, getFundamentosStatus, selectAllFundamentos } from "../fundamentos/fundamentosSlice";
import { paths, router } from "../../router/router";
import './sesiones.css';
import { addEjercicio, deleteEjercicio, updateEjercicio } from "../ejercicios/ejerciciosSlice";

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
    const [jugadorId, setJugadorId] = useState(sesion.jugador.id);
    const [fundamentosDefensivos, setFundamentosDefensivos] = useState(sesion.ejercicios.filter(ejercicio => ejercicio.fundamento.tipo === 'Defensivo').map(ejercicio => ejercicio.fundamento.nombre));
    const [fundamentosOfensivos, setFundamentosOfensivos] = useState(sesion.ejercicios.filter(ejercicio => ejercicio.fundamento.tipo === 'Ofensivo').map(ejercicio => ejercicio.fundamento.nombre));
    const [ejercicios, setEjercicios] = useState(sesion.ejercicios.reduce((acc, ejercicio) => {
        acc[ejercicio.fundamento.nombre] = {
            valoracion: ejercicio.valoracion,
            valoracionMax: ejercicio.valoracionMaxima,
            valoracionFisica: ejercicio.valoracionFisica,
            valoracionTecnica: ejercicio.valoracionTecnica,
            valoracionTactica: ejercicio.valoracionTactica,
            valoracionPsicologica: ejercicio.valoracionPsicologica,
        };
        return acc;
    }, {}));

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

    const handleValoracionChange = (e, fundamento) => {
        setEjercicios({
            ...ejercicios,
            [fundamento]: {
                ...ejercicios[fundamento],
                valoracion: e.target.value
            }
        })
    }
    const handleValoracionMaxChange = (e, fundamento) => {
        setEjercicios({
            ...ejercicios,
            [fundamento]: {
                ...ejercicios[fundamento],
                valoracionMax: e.target.value
            }
        })
    }

    const handleValoracionFisicaChange = (e, fundamento) => {
        setEjercicios({
            ...ejercicios,
            [fundamento]: {
                ...ejercicios[fundamento],
                valoracionFisica: e.target.value
            }
        })
    }

    const handleValoracionTecnicaChange = (e, fundamento) => {
        setEjercicios({
            ...ejercicios,
            [fundamento]: {
                ...ejercicios[fundamento],
                valoracionTecnica: e.target.value
            }
        })
    }

    const handleValoracionTacticaChange = (e, fundamento) => {
        setEjercicios({
            ...ejercicios,
            [fundamento]: {
                ...ejercicios[fundamento],
                valoracionTactica: e.target.value
            }
        })
    }

    const handleValoracionPsicologicaChange = (e, fundamento) => {
        setEjercicios({
            ...ejercicios,
            [fundamento]: {
                ...ejercicios[fundamento],
                valoracionPsicologica: e.target.value
            }
        })
    }

    const handleObservacionesChange = (e, fundamento) => {
        setEjercicios({
            ...ejercicios,
            [fundamento]: {
                ...ejercicios[fundamento],
                observaciones: e.target.value
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

    const onUpdateSesionClicked = () => {
        try {
            dispatch(updateSesion({
                id: sesion.id,
                sesion: {
                    fecha: fecha,
                    jugadorId: jugadorId,
                }
            })).then(() => {
                const ejerciciosDeleted = sesion.ejercicios.filter(ejercicio => !fundamentosDefensivos.includes(ejercicio.fundamento.nombre) && !fundamentosOfensivos.includes(ejercicio.fundamento.nombre));
                const ejerciciosAdded = [...fundamentosDefensivos, ...fundamentosOfensivos].filter(fundamento => !sesion.ejercicios.map(ejercicio => ejercicio.fundamento.nombre).includes(fundamento));
                const ejerciciosNotDeletedOrAdded = [...fundamentosDefensivos, ...fundamentosOfensivos].filter(fundamento => sesion.ejercicios.map(ejercicio => ejercicio.fundamento.nombre).includes(fundamento));
                const ejerciciosDeletedPromises = ejerciciosDeleted.map(ejercicio => dispatch(deleteEjercicio(ejercicio.id)));
                const ejerciciosAddedPromises = ejerciciosAdded.map(fundamento => dispatch(addEjercicio({
                    sesionIndividualId: sesion.id,
                    fundamentoName: fundamento,
                    valoracion: ejercicios[fundamento]?.valoracion || 0,
                    valoracionMaxima: ejercicios[fundamento]?.valoracionMax || 20,
                    valoracionFisica: ejercicios[fundamento]?.valoracionFisica || null,
                    valoracionTecnica: ejercicios[fundamento]?.valoracionTecnica || null,
                    valoracionTactica: ejercicios[fundamento]?.valoracionTactica || null,
                    valoracionPsicologica: ejercicios[fundamento]?.valoracionPsicologica || null,
                    observaciones: ejercicios[fundamento]?.observaciones || null,
                })));
                const ejerciciosNotDeletedOrAddedPromises = ejerciciosNotDeletedOrAdded.map(fundamento => dispatch(updateEjercicio({
                    id: sesion.ejercicios.find(ejercicio => ejercicio.fundamento.nombre === fundamento).id,
                    ejercicio: {
                        fundamentoName: fundamento,
                        valoracion: ejercicios[fundamento]?.valoracion || 0,
                        valoracionMaxima: ejercicios[fundamento]?.valoracionMax || 20,
                        valoracionFisica: ejercicios[fundamento]?.valoracionFisica || null,
                        valoracionTecnica: ejercicios[fundamento]?.valoracionTecnica || null,
                        valoracionTactica: ejercicios[fundamento]?.valoracionTactica || null,
                        valoracionPsicologica: ejercicios[fundamento]?.valoracionPsicologica || null,
                        sesionIndividualId: sesion.id,
                        observaciones: ejercicios[fundamento]?.observaciones || null,
                    },  
                })));
                Promise.all([
                    ...ejerciciosDeletedPromises,
                    ...ejerciciosAddedPromises,
                    ...ejerciciosNotDeletedOrAddedPromises
                ]).then(() => {
                    dispatch(fetchSesiones()).then(() => router.navigate(paths.gestionSesionesIndividuales, {replace: true}));
                });   
            })   
        } catch (error) {
            console.error('Failed to update sesion: ', error);
        }
    }

    return (
        <section className="addsesion">
            <h2>Actualizar sesion</h2>
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
                            {jugadores && jugadores.map(jugador => (
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
                            {fundamentos && fundamentos.filter(fundamento => fundamento.tipo === 'Defensivo').map((fundamento) => (
                                <MenuItem key={fundamento.id} value={fundamento.nombre}>
                                    {fundamento.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {fundamentosDefensivos && fundamentosDefensivos.map((fundamento, index) => (
                        <div className="addsesion-form-ejercicios" key={index}>
                            <div className="addsesion-form-ejercicio">
                                <div className="addsesion-form-ejercicio-general">
                                    <h3>{fundamento}:</h3>
                                    <Input
                                        value={ejercicios[fundamento]?.valoracion || 0}
                                        sx={{width: 200}}
                                        size="small"
                                        placeholder="Valoración general"
                                        type="number"
                                        onChange={(e) => handleValoracionChange(e, fundamento)}
                                        inputProps={{ 
                                            min: 0, 
                                            max: ejercicios[fundamento]?.valoracionMax || 20 ,
                                        }}
                                    />
                                    <Input
                                        value={ejercicios[fundamento]?.valoracionMax || 20}
                                        sx={{width: 200}}
                                        size="small"
                                        placeholder="Valoración máxima"
                                        type="number"
                                        onChange={(e) => handleValoracionMaxChange(e, fundamento)}
                                        inputProps={{
                                            min: ejercicios[fundamento]?.valoracion || 20,
                                            max: 20,
                                        }}
                                    />
                                </div>
                                <div className="addsesion-form-ejercicio-fases">
                                    <div>
                                        <InputLabel>Valoración Física</InputLabel>
                                        <Input
                                            variant="outlined"
                                            value={ejercicios[fundamento]?.valoracionFisica || ''}
                                            sx={{width: 200}}
                                            size="small"
                                    
                                            type="number"
                                            onChange={(e) => handleValoracionFisicaChange(e, fundamento)}
                                            inputProps={{
                                                min: 0,
                                                max: 10,
                                            }} 
                                        />
                                    </div>
                                    <Input
                                        value={ejercicios[fundamento]?.valoracionTecnica || ''}
                                        sx={{width: 200}}
                                        size="small"
                                        placeholder="Valoración Técnica"
                                        type="number"
                                        onChange = {(e) => handleValoracionTecnicaChange(e, fundamento)}
                                        inputProps={{
                                            min: 0,
                                            max: 10,
                                        }} 
                                    />
                                    <Input
                                        value={ejercicios[fundamento]?.valoracionTactica || ''}
                                        sx={{width: 200}}
                                        size="small"
                                        placeholder="Valoración Táctica"
                                        type="number"
                                        onChange = {(e) => handleValoracionTacticaChange(e, fundamento)}
                                        inputProps={{
                                            min: 0,
                                            max: 10,
                                        }} 
                                    />
                                    <Input
                                        value={ejercicios[fundamento]?.valoracionPsicologica || ''}
                                        sx={{width: 200}}
                                        size="small"
                                        placeholder="Valoración Psicológica"
                                        type="number"
                                        onChange = {(e) => handleValoracionPsicologicaChange(e, fundamento)}
                                        inputProps={{
                                            min: 0,
                                            max: 10,
                                        }} 
                                    />
                                </div>
                                <TextField
                                    value={ejercicios[fundamento]?.observaciones || ''} 
                                    sx={{width: 350}}
                                    multiline
                                    rows={4}
                                    placeholder="Observaciones"
                                    variant="outlined"
                                    onChange = {(e) => handleObservacionesChange(e, fundamento)}
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
                            {fundamentos && fundamentos.filter(fundamento => fundamento.tipo === 'Ofensivo').map((fundamento) => (
                                <MenuItem key={fundamento.id} value={fundamento.nombre}>
                                    {fundamento.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {fundamentosOfensivos && fundamentosOfensivos.map((fundamento, index) => (
                        <div className="addsesion-form-ejercicios" key={index}>
                            <div className="addsesion-form-ejercicio">
                                <div className="addsesion-form-ejercicio-general">
                                    <h3>{fundamento}:</h3>
                                    <Input
                                        value={ejercicios[fundamento]?.valoracion || 0}
                                        sx={{width: 200}}
                                        size="small"
                                        placeholder="Valoración general"
                                        type="number"
                                        inputProps={{ 
                                            min: 0, 
                                            max: ejercicios[fundamento]?.valoracionMax || 20 ,
                                        }}
                                        onChange={(e) => handleValoracionChange(e, fundamento)}
                                    />
                                    <Input
                                        value={ejercicios[fundamento]?.valoracionMax || 20}
                                        sx={{width: 200}}
                                        size="small"
                                        placeholder="Valoración máxima"
                                        type="number"
                                        onChange={(e) => handleValoracionMaxChange(e, fundamento)}
                                        inputProps={{
                                            min: ejercicios[fundamento]?.valoracion || 0,
                                            max: 20,
                                        }}
                                    />
                                </div>
                                <div className="addsesion-form-ejercicio-fases">
                                    <Input
                                        value={ejercicios[fundamento]?.valoracionFisica || ''}
                                        sx={{width: 200}}
                                        size="small"
                                        placeholder="Valoración Física"
                                        type="number"
                                        onChange={(e) => handleValoracionFisicaChange(e, fundamento)}
                                        inputProps={{
                                            min: 0,
                                            max: 10,
                                        }} 
                                    />
                                    <Input
                                        value={ejercicios[fundamento]?.valoracionTecnica || ''}
                                        sx={{width: 200}}
                                        size="small"
                                        placeholder="Valoración Técnica"
                                        type="number"
                                        onChange = {(e) => handleValoracionTecnicaChange(e, fundamento)}
                                        inputProps={{
                                            min: 0,
                                            max: 10,
                                        }} 
                                    />
                                    <Input
                                        value={ejercicios[fundamento]?.valoracionTactica || ''}
                                        sx={{width: 200}}
                                        size="small"
                                        placeholder="Valoración Táctica"
                                        type="number"
                                        onChange = {(e) => handleValoracionTacticaChange(e, fundamento)}
                                        inputProps={{
                                            min: 0,
                                            max: 10,
                                        }} 
                                    />
                                    <Input
                                        value={ejercicios[fundamento]?.valoracionPsicologica || ''}
                                        sx={{width: 200}}
                                        size="small"
                                        placeholder="Valoración Psicológica"
                                        type="number"
                                        onChange = {(e) => handleValoracionPsicologicaChange(e, fundamento)}
                                        inputProps={{
                                            min: 0,
                                            max: 10,
                                        }} 
                                    />
                                </div>
                                <TextField
                                    value={ejercicios[fundamento]?.observaciones || ''} 
                                    sx={{width: 350}}
                                    multiline
                                    rows={4}
                                    placeholder="Observaciones"
                                    variant="outlined"
                                    onChange = {(e) => handleObservacionesChange(e, fundamento)}
                                />
                            </div>
                        </div>     
                    ))}
                </div>
                <div className="addsesion-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onUpdateSesionClicked}>Actualizar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.gestionSesionesIndividuales, {replace: true})}>Cancelar</Button>
                </div>  
            </form>
        </section>
    )
}

export default UpdateSesionForm;