import * as React from 'react';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import './maindrawer.css';
import { CalendarMonth, ExpandMore, NotificationsRounded, PermIdentity, PlaylistAdd, ExpandLess } from '@mui/icons-material';
import { Collapse } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import {paths, router} from '../../router/router';
import { MaterialSymbolsBidLandscape, MaterialSymbolsClockLoader90, MaterialSymbolsFinance, MaterialSymbolsLightFinanceMode } from '../material-symbols/MaterialSymbols';
import { getActiveMenuIndex, getDrawerOpen, getUserSession, setActiveMenuIndex, setUserSession, toggleDrawer } from './mainDrawerSlice';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../axiosConfig';

const drawerWidth = window.innerWidth / 4.32;
const USERS_URL = process.env.REACT_APP_API_URL + "users";

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#273237',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  })
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const menuList = [
    {
        icon: <PermIdentity />,
        text: 'Jugadores',
        path: paths.jugadores,
    },
    {
        icon: <MaterialSymbolsFinance />,
        text: 'Estadísticas jugador',
        path: paths.estadisticasJugador,
    },
    {
        icon: <MaterialSymbolsClockLoader90 />,
        text: 'Gráficas',
        path: paths.graficas,
    },
    {
        icon: <MaterialSymbolsBidLandscape />,
        text: 'Desarrollo Táctico Individual',
        path: paths.desarrolloTacticoIndividual,
    },
    {
        icon: <MaterialSymbolsLightFinanceMode />,
        text: 'Estadísticas de equipo',
        path: paths.estadisticasEquipo,
    },
    {
        icon: <CalendarMonth />,
        text: 'Conceptos Generales',
        path: paths.calendario,
    },
    {
        icon: <NotificationsRounded />,
        text: 'Notificaciones',
        path: paths.notificaciones,
    },
    {
        icon: <PlaylistAdd />,
        text: 'Gestión y Creación',
    }
]

const gestionList = [
  {
    text: 'Jugadores',
    path: paths.gestionJugadores
  },
  {
    text: 'Equipos',
    path: paths.gestionEquipos
  },
  {
    text: 'Fundamentos',
    path: paths.gestionFundamentos
  },
  {
    text: 'Posiciones',
    path: paths.gestionPosiciones
  },
  {
    text: 'Partidos',
    path: paths.gestionPartidos
  },
  {
    text: 'Sesiones Individuales',
    path: paths.gestionSesionesIndividuales
  },
  {
    text: 'Actualizar contraseña',
    path: paths.actualizarPassword
  }
]

export default function MainDrawer() {

  const dispatch = useDispatch();
  const userSession = useSelector(getUserSession);
  const activeMenuIndex = useSelector(getActiveMenuIndex);

  const open = useSelector(getDrawerOpen);
  const [gestionOpen, setGestionOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(menuList.map((menuItem, index) => index === 0 ? true : false));
  const [activeGestion, setActiveGestion] = useState(gestionList.map(() => false));
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(userSession);
  }, [userSession])

  const handleToggleDrawer = () => {
    dispatch(toggleDrawer());
  };

  const handleGestionClick = () => {
    setGestionOpen(!gestionOpen);
  }

  const handleLogout = async () => {
    //setActiveMenu(activeMenu.map((menuItem, i) => i === 0 ? true : false));
    dispatch(setActiveMenuIndex(0));
    setGestionOpen(false);
    dispatch(setUserSession(false));
    try {
      await axiosInstance.post(`${USERS_URL}/logout`);
      router.navigate(paths.login, {replace: true});
    } catch (err) {
      return err.message;
    }
    
  }

  const handleLogin = () => {
    //setActiveMenu(activeMenu.map((menuItem, i) => i === 0 ? true : false));
    dispatch(setActiveMenuIndex(0));
    router.navigate(paths.login, {replace: true});
  }

  useEffect(() => {
    setActiveMenu(activeMenu.map((menuItem, i) => i === activeMenuIndex ? true : false));
  }, [activeMenuIndex]);

  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            onClick={handleToggleDrawer}
            edge="start"
            sx={{
              marginRight: 2,
            }}
          >
            <div className="menu">
                <img src="assets/menu.png" alt="menu" />
            </div>
          </IconButton>
          <div className="logo">
              <img src="assets/logo.png" alt="logo" />
          </div>
          <div className='sesion-buttons'>
            {
              !session && <Button onClick={handleLogin}>INICIAR SESIÓN</Button>}
            {
              session && <Button onClick={handleLogout}>CERRAR SESIÓN</Button>
            }
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader />
        <List >
          {session && menuList.map((item, index) => (
            <div className='list' key={index}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        position: 'relative',
                        '&:hover::after': {
                            color: 'white',
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: activeMenu[index] ? '#007bff' : 'rgba(86, 179, 227, 0.3)',
                            zIndex: 0,
                        },
                        backgroundColor: activeMenu[index] ? '#007bff' : 'transparent',
                        }}
                        onClick={() => {
                            if (item.text === 'Gestión y Creación') {
                                handleGestionClick();
                                //dispatch(toggleDrawer());
                            } else {
                              //setActiveMenu(activeMenu.map((menuItem, i) => i === index ? true : false));
                              dispatch(setActiveMenuIndex(index));
                              setGestionOpen(false);
                              setActiveGestion(gestionList.map(() => false));
                              router.navigate(`../${item.path}`)
                            } 
                        }}
                    >
                        <ListItemIcon
                        sx={{
                            minWidth: 0,
                            color: 'white',
                            mr: open ? 1 : 'auto',
                            justifyContent: 'center',
                            zIndex: 1
                        }}
                        >
                        {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={item.text}
                            sx={{ 
                                opacity: open ? 1 : 0, 
                                color: 'white', 
                                textTransform: 'uppercase',
                                zIndex: 1
                            }} 
                        />
                        {item.text === 'Gestión y Creación' ? (gestionOpen ? <ExpandLess sx={{color: 'white'}} /> : <ExpandMore sx={{color: 'white'}} />) : ''}
                    </ListItemButton>
                </ListItem>
            </div>
          ))}
          <Collapse in={gestionOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {session && gestionList.map((item, index) => (
                    <ListItemButton
                        onClick={() => 
                          {
                            dispatch(setActiveMenuIndex(activeMenu.length - 1));
                            setActiveGestion(activeGestion.map((gestionItem, i) => i === index ? true : false));
                            router.navigate(`../${item.path}`);
                          }
                        }
                        disabled={!open}
                        key={index}
                        sx={{ 
                            pl: 6.5,
                            position: 'relative',
                            '&:hover::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: activeGestion[index] ? 'rgba(0, 123, 255, 0.3)' : 'rgba(86, 179, 227, 0.3)',
                                zIndex: 0,
                            },
                            backgroundColor: activeGestion[index] ? 'rgba(0, 123, 255, 0.3)' : 'transparent',
                        }}
                    >
                        <ListItemText primary={item.text} sx={{color: open ? 'white' : 'transparent', textTransform: 'uppercase', zIndex: 1}} />
                    </ListItemButton>
                ))
                }
            </List>
          </Collapse>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <RouterProvider router={router} />
      </Box>
    </Box>
  );
}
