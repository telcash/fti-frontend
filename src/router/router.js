import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Jugadores from "../features/jugadores/Jugadores";
import JugadoresList from "../features/jugadores/JugadoresList";
import AddJugadorForm from "../features/jugadores/AddJugadorForm";
import UpdateJugadorForm from "../features/jugadores/UpdateJugadorForm";
import EquiposList from "../features/equipos/EquiposList";
import AddEquipoForm from "../features/equipos/AddEquipoForm";
import UpdateEquipoForm from "../features/equipos/UpdateEquipoForm";
import PosicionesList from "../features/posiciones/PosicionesList";
import AddPosicionForm from "../features/posiciones/AddPosicionForm";
import UpdatePosicionForm from "../features/posiciones/UpdatePosicionForm";
import FundamentosList from "../features/fundamentos/FundamentosList";
import AddFundamentoForm from "../features/fundamentos/AddFundamentoForm";
import UpdateFundamentoForm from "../features/fundamentos/UpdateFundamentoForm";
import PartidosList from "../features/partidos/PartidosList";
import AddPartidoForm from "../features/partidos/AddPartidoForm";
import UpdatePartidoForm from "../features/partidos/UpdatePartidoForm";
import SesionesList from "../features/sesion-individual/SesionesList";
import AddSesionForm from "../features/sesion-individual/AddSesionForm";
import UpdateSesionForm from "../features/sesion-individual/UpdateSesionForm";
import JugadorDatos from "../features/jugadores/JugadorDatos";
import JugadorEstadisticas from "../features/jugadores/JugadorEstadisticas";
import JugadoresNotificaciones from "../features/jugadores/JugadoresNotificaciones";
import JugadorCalendario from "../features/jugadores/JugadorCalendario";
import JugadorGraficas from "../features/jugadores/JugadorGraficas";
import EstadisticasEquipo from "../features/equipos/EstadisticasEquipo";

export const paths = {
  jugadores: "/jugadores",
  jugadorDatos: "/jugador-datos",
  estadisticasJugador: "/estadisticas-jugador",
  jugadorEstadistica: "/jugador-estadisticas",
  graficas: "/graficas",
  jugadorGraficas: "/jugador-graficas",
  desarrolloTacticoIndividual: "/desarrollo-tactico-individual",
  estadisticasEquipo: "/estadisticas-equipo",
  calendario: "/calendario",
  jugadorCalendario : "/jugador-calendario",
  notificaciones: "/notificaciones",
  jugadoresNotificaciones: "/jugadores-notificaciones",
  gestionJugadores: "/gestion-jugadores",
  agregarJugador: "/agregar-jugador",
  actualizarJugador: "/actualizar-jugador",
  gestionEquipos: "/gestion-equipos",
  agregarEquipo: "/agregar-equipo",
  actualizarEquipo: "/actualizar-equipo",
  gestionFundamentos: "/gestion-fundamentos",
  agregarFundamento: "/agregar-fundamento",
  actualizarFundamento: "/actualizar-fundamento",
  gestionPosiciones: "/gestion-posiciones",
  agregarPosicion: "/agregar-posicion",
  actualizarPosicion: "/actualizar-posicion",
  gestionPartidos: "/gestion-partidos",
  agregarPartido: "/agregar-partido",
  actualizarPartido: "/actualizar-partido",
  gestionSesionesIndividuales: "/gestion-sesionesindividuales",
  agregarSesionIndividual: "/agregar-sesionindividual",
  actualizarSesionIndividual: "/actualizar-sesionindividual"
};

export const router = createBrowserRouter([
  {
    path: paths.jugadores,
    element: <Jugadores />
  },
  {
    path: paths.jugadorDatos,
    element: <JugadorDatos />
  },
  {
    path: paths.estadisticasJugador,
    element: <Jugadores />
  },
  {
    path: paths.jugadorEstadistica,
    element: <JugadorEstadisticas />
  },
  {
    path: paths.graficas,
    element: <Jugadores />
  },
  {
    path: paths.jugadorGraficas,
    element: <JugadorGraficas />
  },
  {
    path: paths.desarrolloTacticoIndividual,
    element: <div>Desarrollo Tactico Individual</div>
  },
  {
    path: paths.estadisticasEquipo,
    element: <EstadisticasEquipo />
  },
  {
    path: paths.calendario,
    element: <Jugadores />
  },
  {
    path: paths.jugadorCalendario,
    element: <JugadorCalendario />
  },
  {
    path: paths.notificaciones,
    element: <Jugadores />
  },
  {
    path: paths.jugadoresNotificaciones,
    element: <JugadoresNotificaciones />
  },
  {
    path: paths.gestionJugadores,
    element: <JugadoresList />
  },
  {
    path: paths.agregarJugador,
    element: <AddJugadorForm />
  },
  {
    path: paths.actualizarJugador,
    element: <UpdateJugadorForm />
  },
  {
    path: paths.gestionEquipos,
    element: <EquiposList />
  },
  {
    path: paths.agregarEquipo,
    element: <AddEquipoForm />
  },
  {
    path: paths.actualizarEquipo,
    element: <UpdateEquipoForm />
  },
  {
    path: paths.gestionFundamentos,
    element: <FundamentosList />
  },
  {
    path: paths.agregarFundamento,
    element: <AddFundamentoForm />
  },
  {
    path: paths.actualizarFundamento,
    element: <UpdateFundamentoForm />
  },
  {
    path: paths.gestionPosiciones,
    element: <PosicionesList />
  },
  {
    path: paths.agregarPosicion,
    element: <AddPosicionForm />
  },
  {
    path: paths.actualizarPosicion,
    element: <UpdatePosicionForm />
  },
  {
    path: paths.gestionPartidos,
    element: <PartidosList />
  },
  {
    path: paths.agregarPartido,
    element: <AddPartidoForm />
  },
  {
    path: paths.actualizarPartido,
    element: <UpdatePartidoForm />
  },
  {
    path: paths.gestionSesionesIndividuales,
    element: <SesionesList />
  },
  {
    path: paths.agregarSesionIndividual,
    element: <AddSesionForm />
  },
  {
    path: paths.actualizarSesionIndividual,
    element: <UpdateSesionForm />
  }
  ]);
