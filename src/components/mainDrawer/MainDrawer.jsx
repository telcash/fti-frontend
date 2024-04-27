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
import JugadoresList from '../../features/jugadores/JugadoresList';
import EquiposList from '../../features/equipos/EquiposList';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AddJugadorForm from '../../features/jugadores/AddJugadorForm';
import AddEquipoForm from '../../features/equipos/AddEquipoForm';

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>Home</div>
    )
  },
  {
    path: "gestion-jugadores",
    element: <JugadoresList />
  },
  {
    path: "agregar-jugador",
    element: <AddJugadorForm />
  },
  {
    path: "gestion-equipos",
    element: <EquiposList />
  },
  {
    path: "agregar-equipo",
    element: <AddEquipoForm />
  }
]);

export function MaterialSymbolsLightFinanceMode(props) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M8.692 12.265V6.692h1.616v5.573l-.808-.823zm4.346 2.231V2.692h1.616v10.189zm-8.73 2.142v-5.946h1.615v4.331zm-.116 3.912l5.296-5.296l3.55 3.05l6.754-6.754H17.5v-1h4v4h-1v-2.292l-7.438 7.438l-3.55-3.05l-3.904 3.904z"></path></svg>);
}

export function MaterialSymbolsFinance(props) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V3h2v16h16v2zm1-3V9h4v9zm5 0V4h4v14zm5 0v-5h4v5z"></path></svg>);
}

export function MaterialSymbolsClockLoader90(props) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22M6.325 6.325L12 12V4q-1.6 0-3.075.6t-2.6 1.725"></path></svg>);
}

export function MaterialSymbolsBidLandscape(props) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zM19 7.25l-6.05 6.8L9 10.1l-4 4v2.85l4-4L13.05 17L19 10.25z"></path></svg>);
}

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
    },
    {
        icon: <MaterialSymbolsFinance />,
        text: 'Estadísticas jugador'
    },
    {
        icon: <MaterialSymbolsClockLoader90 />,
        text: 'Gráficas'
    },
    {
        icon: <MaterialSymbolsBidLandscape />,
        text: 'Desarrollo Táctico Individual'
    },
    {
        icon: <MaterialSymbolsLightFinanceMode />,
        text: 'Estadísticas de equipo'
    },
    {
        icon: <CalendarMonth />,
        text: 'Calendario'
    },
    {
        icon: <NotificationsRounded />,
        text: 'Notificaciones'
    },
    {
        icon: <PlaylistAdd />,
        text: 'Gestión y Creación'
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

export default function MiniDrawer() {
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
