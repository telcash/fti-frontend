import { useDispatch, useSelector } from "react-redux";
import { fetchSesiones, getSesionSelected, updateSesion } from "./sesionIndividualSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useEffect, useState } from "react";
import { Button, FormControl, Input, InputLabel, MenuItem, OutlinedInput, Select, Slider } from "@mui/material";
import { fetchJugadores, getJugadoresStatus, selectAllJugadores } from "../jugadores/jugadoresSlice";
import { fetchFundamentos, getFundamentosStatus, selectAllFundamentos } from "../fundamentos/fundamentosSlice";
import { paths, router } from "../../router/router";
import './sesiones.css';
import { addEjercicio, deleteEjercicio, fetchEjercicios, getEjerciciosStatus, selectAllEjercicios, updateEjercicio } from "../ejercicios/ejerciciosSlice";

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
            valoracionMax: ejercicio.valoracionMaxima
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
                    valoracionMaxima: ejercicios[fundamento]?.valoracionMax || 20
                })));
                const ejerciciosNotDeletedOrAddedPromises = ejerciciosNotDeletedOrAdded.map(fundamento => dispatch(updateEjercicio({
                    id: sesion.ejercicios.find(ejercicio => ejercicio.fundamento.nombre === fundamento).id,
                    ejercicio: {
                        fundamentoName: fundamento,
                        valoracion: ejercicios[fundamento]?.valoracion || 0,
                        valoracionMaxima: ejercicios[fundamento]?.valoracionMax || 20,
                        sesionIndividualId: sesion.id,
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
                                    value={ejercicios[fundamento]?.valoracion || 0}
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
                                    value={ejercicios[fundamento]?.valoracionMax || 20}
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
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onUpdateSesionClicked}>Actualizar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.gestionSesionesIndividuales, {replace: true})}>Cancelar</Button>
                </div>  
            </form>
        </section>
    )
}

/* const UpdateSesionForm = () => {
    const dispatch = useDispatch();
    
    const sesion = useSelector(getSesionSelected);

    const jugadores = useSelector(selectAllJugadores);
    const jugadoresStatus = useSelector(getJugadoresStatus);
    const ejercicios = useSelector(selectAllEjercicios);
    const ejerciciosStatus = useSelector(getEjerciciosStatus);

    const fundamentos = useSelector(selectAllFundamentos);
    const fundamentosStatus = useSelector(getFundamentosStatus);

    const [fecha, setFecha] = useState(dayjs(sesion.fecha));
    const [jugadorId, setJugador] = useState(sesion.jugador.id);

    const fundamentosDefensivosPrevios = sesion.ejercicios.filter(ejercicio => ejercicio.fundamento.tipo === 'Defensivo').map(ejercicio => ejercicio.fundamento.nombre);
    const [fundamentosDefensivos, setFundamentosDefensivos] = useState(fundamentosDefensivosPrevios);
    
    const fundamentosOfensivosPrevios = sesion.ejercicios.filter(ejercicio => ejercicio.fundamento.tipo === 'Ofensivo').map(ejercicio => ejercicio.fundamento.nombre);
    const [fundamentosOfensivos, setFundamentosOfensivos] = useState(fundamentosOfensivosPrevios);

    const [ejerciciosDefensivos, setEjerciciosDefensivos] = useState(
        sesion.ejercicios.filter(ejercicio => ejercicio.fundamento.tipo === 'Defensivo').reduce((acc, ejercicio) => {
            acc[ejercicio.fundamento.nombre] = ejercicio.valoracion;
            return acc;
        }
        , {})
    );

    const [ejerciciosOfensivos, setEjerciciosOfensivos] = useState(
        sesion.ejercicios.filter(ejercicio => ejercicio.fundamento.tipo === 'Ofensivo').reduce((acc, ejercicio) => {
            acc[ejercicio.fundamento.nombre] = ejercicio.valoracion;
            return acc;
        }
        , {})
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

    useEffect(() => {
        if(ejerciciosStatus === 'idle') {
            dispatch(fetchEjercicios());
        }
    }, [ejerciciosStatus, dispatch])

    const onUpdateSesionClicked = () => {
        try {
            dispatch(updateSesion({
                id: sesion.id,
                sesion: {
                    fecha: fecha,
                    jugadorId: jugadorId,
                }
            })).then(() => {
                const fundamentosDefensivosDeleted = fundamentosDefensivosPrevios.filter(fundamento => !fundamentosDefensivos.includes(fundamento));
                const fundamentosDefensivosAdded = fundamentosDefensivos.filter(fundamento => !fundamentosDefensivosPrevios.includes(fundamento));
                const fundamentosDefensivosNotDeletedOrAdded = fundamentosDefensivos.filter(fundamento => fundamentosDefensivosPrevios.includes(fundamento));
                const fundamentosDefensivosDeletedPromises = fundamentosDefensivosDeleted.map(fundamento => dispatch(deleteEjercicio(
                    sesion.ejercicios.find(ejercicio => ejercicio.fundamento.nombre === fundamento).id
                )));
                const fundamentosDefensivosAddedPromises = fundamentosDefensivosAdded.map(fundamento => dispatch(addEjercicio({
                    sesionIndividualId: sesion.id,
                    fundamentoName: fundamento,
                    valoracion: ejerciciosDefensivos[fundamento]
                })));
                const fundamentosDefensivosNotDeletedOrAddedPromises = fundamentosDefensivosNotDeletedOrAdded.map(fundamento => dispatch(updateEjercicio({
                    id: sesion.ejercicios.find(ejercicio => ejercicio.fundamento.nombre === fundamento).id,
                    ejercicio: {
                        fundamentoName: fundamento,
                        valoracion: ejerciciosDefensivos[fundamento],
                        sesionIndividualId: sesion.id,
                    },  
                })));
                const fundamentosOfensivosDeleted = fundamentosOfensivosPrevios.filter(fundamento => !fundamentosOfensivos.includes(fundamento));
                const fundamentosOfensivosAdded = fundamentosOfensivos.filter(fundamento => !fundamentosOfensivosPrevios.includes(fundamento));
                const fundamentosOfensivosNotDeletedOrAdded = fundamentosOfensivos.filter(fundamento => fundamentosOfensivosPrevios.includes(fundamento));
                const fundamentosOfensivosDeletedPromises = fundamentosOfensivosDeleted.map(fundamento => dispatch(deleteEjercicio(
                    sesion.ejercicios.find(ejercicio => ejercicio.fundamento.nombre === fundamento).id
                )));
                const fundamentosOfensivosAddedPromises = fundamentosOfensivosAdded.map(fundamento => dispatch(addEjercicio({
                    sesionIndividualId: sesion.id,
                    fundamentoName: fundamento,
                    valoracion: ejerciciosOfensivos[fundamento]
                })));
                const fundamentosOfensivosNotDeletedOrAddedPromises = fundamentosOfensivosNotDeletedOrAdded.map(fundamento => dispatch(updateEjercicio({
                    id: sesion.ejercicios.find(ejercicio => ejercicio.fundamento.nombre === fundamento).id,
                    ejercicio: {
                        fundamentoName: fundamento,
                        valoracion: ejerciciosOfensivos[fundamento],
                        sesionIndividualId: sesion.id,
                    },
                })));
                Promise.all([
                    ...fundamentosDefensivosDeletedPromises,
                    ...fundamentosDefensivosAddedPromises,
                    ...fundamentosDefensivosNotDeletedOrAddedPromises,
                     ...fundamentosOfensivosDeletedPromises,
                    ...fundamentosOfensivosAddedPromises,
                    ...fundamentosOfensivosNotDeletedOrAddedPromises
                ]).then(() => {
                    dispatch(fetchSesiones()).then(() => router.navigate(paths.gestionSesionesIndividuales, {replace: true}));
                });   
            })
        } catch (error) {
            console.error('Failed to update sesion: ', error);
        } finally {
            setFecha(dayjs());
            setJugador('');
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
                            {jugadores.map(jugador => (
                                <MenuItem key={jugador.id} value={jugador.id}>
                                    {`Id: ${jugador.id} - ${jugador.nombre} ${jugador.apellido}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
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
                            <h4>{fundamento}:</h4>
                            <Slider 
                                value={ejerciciosDefensivos[fundamento] || 0}
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
                                value={ejerciciosOfensivos[fundamento]}
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
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={onUpdateSesionClicked}>Actualizar</Button>
                    <Button sx={{backgroundColor: '#273237'}} variant="contained" onClick={() => router.navigate(paths.gestionSesionesIndividuales, {replace: true})}>Cancelar</Button>
                </div>
            </form>
        </section>
    )
} */

export default UpdateSesionForm;