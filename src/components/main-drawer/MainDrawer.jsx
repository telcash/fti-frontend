import * as React from 'react';

import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
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
import { CalendarMonth, ExpandMore, NotificationsRounded, PermIdentity, PlaylistAdd, ExpandLess, StarBorder } from '@mui/icons-material';
import { Collapse } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import {router} from '../../router/router';
import { MaterialSymbolsBidLandscape, MaterialSymbolsClockLoader90, MaterialSymbolsFinance, MaterialSymbolsLightFinanceMode } from '../material-symbols/MaterialSymbols';


const drawerWidth = window.innerWidth / 4.32;

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
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
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
        path: 'jugadores'
    },
    {
        icon: <MaterialSymbolsFinance />,
        text: 'Estadísticas jugador',
        path: 'estadisticas-jugador'
    },
    {
        icon: <MaterialSymbolsClockLoader90 />,
        text: 'Gráficas',
        path: 'graficas'
    },
    {
        icon: <MaterialSymbolsBidLandscape />,
        text: 'Desarrollo Táctico Individual',
        path: 'desarrollo-tactico-individual'
    },
    {
        icon: <MaterialSymbolsLightFinanceMode />,
        text: 'Estadísticas de equipo',
        path: 'estadisticas-equipo'
    },
    {
        icon: <CalendarMonth />,
        text: 'Calendario',
        path: 'calendario'
    },
    {
        icon: <NotificationsRounded />,
        text: 'Notificaciones',
        path: 'notificaciones'
    },
    {
        icon: <PlaylistAdd />,
        text: 'Gestión y Creación',
    }
]

const gestionList = [
  {
    text: 'Jugadores',
    path: 'gestion-jugadores'
  },
  {
    text: 'Equipos',
    path: 'gestion-equipos'
  },
  {
    text: 'Fundamentos',
    path: 'gestion-fundamentos'
  },
  {
    text: 'Posiciones',
    path: 'gestion-posiciones'
  },
  {
    text: 'Partidos',
    path: 'gestion-partidos'
  },
  {
    text: 'Jornadas',
    path: 'gestion-jornadas'
  },
  {
    text: 'Sesiones Individuales',
    path: 'gestion-sesionesindividuales'
  },
]

export default function MainDrawer() {
  const [open, setOpen] = useState(true);
  const [gestionOpen, setGestionOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleGestionClick = () => {
    setGestionOpen(!gestionOpen);
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            onClick={toggleDrawer}
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
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader />
        <List>
          {menuList.map((item, index) => (
            <div className='list'>
                <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        position: 'relative',
                        '&:hover::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(86, 179, 227, 0.3)',
                            zIndex: 2,
                        }
                        }}
                        onClick={() => {
                            if (item.text === 'Gestión y Creación') {
                                handleGestionClick();
                                setOpen(true);
                            } else {
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
                {gestionList.map(item => (
                    <ListItemButton
                        onClick={() => router.navigate(`../${item.path}`)} 
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
                                backgroundColor: 'rgba(86, 179, 227, 0.3)',
                                zIndex: 2,
                            }
                        }}
                    >
                        <ListItemText primary={item.text} sx={{color: 'white', textTransform: 'uppercase',}} />
                    </ListItemButton>
                ))
                }
            </List>
          </Collapse>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3}}>
        <DrawerHeader />
        <RouterProvider router={router} />
      </Box>
    </Box>
  );
}
