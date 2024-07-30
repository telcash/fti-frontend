import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import JugadorAvatar from "./JugadorAvatar";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDispatch, useSelector } from "react-redux";
import { fetchSesiones, getSesionesStatus, selectAllSesiones } from "../sesion-individual/sesionIndividualSlice";
import { getJugadorSelected } from "./jugadoresSlice";
import { useEffect, useState } from "react";
import { Box, Button, IconButton, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from "@mui/material";
import { paths, router } from "../../router/router";
import { deleteVideo, fetchVideos, getVideoSelected, getVideosStatus, selectAllVideos, videoSelected } from "../videos-jugador/videosJugadorSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SimpleDialog from "../../components/simple-dialog/SimpleDialog";

const JugadorDesarrolloTactico = () => {

    const dispatch = useDispatch();

    const jugador = useSelector(getJugadorSelected);
    const video = useSelector(getVideoSelected);

    const sesiones = useSelector(selectAllSesiones);
    const videos = useSelector(selectAllVideos);
    const sesionesStatus = useSelector(getSesionesStatus);
    const videosStatus = useSelector(getVideosStatus);

    const [open, setOpen] = useState(false);

    const [sesionesJugador, setSesionesJugador] = useState([]);
    const [videosJugador, setVideosJugador] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedSesion, setSelectedSesion] = useState();
    const [tipoFundamento, setTipoFundamento] = useState('');
    const activeDates = sesiones.filter(sesion => sesion.jugador.id === jugador.id).map(sesion => dayjs(sesion.fecha));

    const onDateChange = (e) => {
        setSelectedDate(e);
        setSelectedSesion(sesionesJugador.find(s => dayjs(s.fecha).isSame(e, 'day')));
    }

    const onTipoFundamentoChange = (e, newValue) => setTipoFundamento(newValue);

    useEffect(() => {
        if(sesionesStatus === 'idle') {
            dispatch(fetchSesiones());
        }
    }
    , [sesionesStatus, dispatch]);

    useEffect(() => {
        if(videosStatus === 'idle') {
            dispatch(fetchVideos());
        }
    }, [videosStatus, dispatch]);

    useEffect(() => {
        if (sesiones.length > 0) {
            setSesionesJugador(sesiones.filter(s => s.jugador.id === jugador.id));
        }
    }
    , [sesiones, jugador]);

    useEffect(() => {
        if (videos.length > 0) {
            setVideosJugador(videos.filter(v => v.jugador.id === jugador.id));
        }
    }, [jugador, videos])

    const handleClickOpen = (video) => {
        dispatch(videoSelected(video));
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        if(value === 'Eliminar') {
            dispatch(deleteVideo(video.id))
        }
    }

    return (
        <section className="jugador-desarrollo-tactico">
            <h2>Análisis Táctico</h2>
            <div className="jugador-desarrollo-tactico-info">
                <div className="jugador-desarrollo-tactico-info-jugador">
                    <JugadorAvatar jugador={jugador} />
                    <div className="jugador-desarrollo-tactico-info-jugador-leyendas">
                        <div className="jugador-desarrollo-tactico-info-jugador-leyendas-item">
                            <Box bgcolor="#A8D6A6" sx={{ width: 60, height: 20, borderRadius: '5%' }} />
                            <h5>+90% aciertos</h5>  
                        </div>
                        <div className="jugador-desarrollo-tactico-info-jugador-leyendas-item">
                            <Box bgcolor='#42A3D5' sx={{ width: 60, height: 20, borderRadius: '5%' }} />
                            <h5>Entre 80% y 90% aciertos</h5>
                        </div>
                        <div className="jugador-desarrollo-tactico-info-jugador-leyendas-item">
                            <Box bgcolor="#F5D16B" sx={{ width: 60, height: 20, borderRadius: '5%' }} />
                            <h5>Entre 70% y 80% aciertos</h5>
                        </div>
                        <div className="jugador-desarrollo-tactico-info-jugador-leyendas-item">
                            <Box bgcolor="#F26E71" sx={{ width: 60, height: 20, borderRadius: '5%' }} />
                            <h5>-70% aciertos</h5>
                        </div>
                    </div>
                </div>
                <div className="jugador-desarrollo-tactico-info-calendario">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                        <DateCalendar 
                            value={selectedDate}
                            onChange={onDateChange}
                            shouldDisableDate={(date) => !activeDates.some(activeDate => activeDate.isSame(date, 'day'))}
                        />
                    </LocalizationProvider>
                </div>
            </div>
            <div className="jugador-desarrollo-tactico-fundamentos">
                <div className="jugador-desarrollo-tactico-fundamentos-tabs">
                    <Tabs
                        value={tipoFundamento}
                        onChange={onTipoFundamentoChange}
                        sx={{
                            ".Mui-selected": {
                                color: 'white!important',
                            }
                        }}
                    >
                        <Tab sx={{ color: 'gray', mr: 5, ml: 5 }} value="Defensivo" label="Fundamentos defensivos"/>
                        <Tab sx={{ color: 'gray', mr: 5, ml: 5}} value="Ofensivo" label="Fundamentos ofensivos"/>
                    </Tabs>
                </div>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}}>
                        <TableBody>
                            {selectedSesion && Array.isArray(selectedSesion.ejercicios) && selectedSesion.ejercicios.filter( ejercicio => ejercicio.fundamento.tipo === tipoFundamento).map((ejercicio, index) => (
                                <TableRow key={ejercicio.id}>
                                    <TableCell sx={{ fontSize: 16}} align="left">{`${index + 1} - ${ejercicio.fundamento.nombre}`}</TableCell>
                                    <TableCell 
                                        align="center"
                                        width={150}
                                        sx={{
                                            backgroundColor: ejercicio.valoracion / ejercicio.valoracionMaxima > 0.9 ? '#A8D6A6' : 
                                                            ejercicio.valoracion / ejercicio.valoracionMaxima >= 0.8 ? '#42A3D5' :
                                                            ejercicio.valoracion / ejercicio.valoracionMaxima >= 0.7 ? '#F5D16B' :
                                                            '#F26E71',
                                            fontWeight: 'bolder',
                                            fontSize: '1.2rem'
                                        }}
                                    >
                                        {`${ejercicio.valoracion}/${ejercicio.valoracionMaxima}`}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </TableContainer>
                <h2>Videos</h2>
                <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={() => router.navigate(paths.agregarVideo, {replace: true})}>Añadir video</Button>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 400}}>
                        <TableHead sx={{backgroundColor: '#273237'}}>
                            <TableRow>
                                <TableCell align="center" sx={{color: 'white'}}>Nombre</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>URL</TableCell>
                                <TableCell align="center" sx={{color: 'white'}}>Acción</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {videosJugador.length === 0 &&
                                <TableCell align="center" colSpan={3}>El jugador no tiene videos</TableCell> 
                            }
                            {
                                videosJugador && Array.isArray(videosJugador) && videosJugador.map((video) => (
                                    <TableRow key={video.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell align="center">{video.nombre}</TableCell>
                                        <TableCell align="center">{video.url}</TableCell>
                                        <TableCell align="center">
                                            <div className="action-buttons">
                                                <IconButton
                                                    onClick={() => {
                                                        dispatch(videoSelected(video));
                                                    }}
                                                >
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                                <IconButton onClick={() => {
                                                    dispatch(videoSelected(video));
                                                    handleClickOpen(video);
                                                }}>
                                                    <DeleteIcon color="primary" />
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                        <SimpleDialog 
                                            title="Eliminar Video"
                                            contentText={`¿Deseas eliminar el video ${video.nombre} del jugador ${jugador.nombre}?`}
                                            open={open}
                                            onClose={handleClose}
                                        />
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div>
                <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={() => router.navigate(paths.desarrolloTacticoIndividual, {replace: true})}>Regresar</Button>
            </div>
        </section>
    )
}

export default JugadorDesarrolloTactico;