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

export const router = createBrowserRouter([
    {
      path: "jugadores",
      element: <Jugadores />
    },
    {
      path: "estadisticas-jugador",
      element: <div>Estadisticas Jugador</div>
    },
    {
      path: "graficas",
      element: <div>Graficas</div>
    },
    {
      path: "desarrollo-tactico-individual",
      element: <div>Desarrollo Tactico Individual</div>
    },
    {
      path: "estadisticas-equipo",
      element: <div>Estadisticas de equipo</div>
    },
    {
      path: "calendario",
      element: <div>Calendario</div>
    },
    {
      path: "notificaciones",
      element: <div>Notificaciones</div>
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
      path: "actualizar-jugador",
      element: <UpdateJugadorForm />
    },
    {
      path: "gestion-equipos",
      element: <EquiposList />
    },
    {
      path: "agregar-equipo",
      element: <AddEquipoForm />
    },
    {
      path: "actualizar-equipo",
      element: <UpdateEquipoForm />
    },
    {
      path: "gestion-fundamentos",
      element: <div>Gestion fundamentos</div>
    },
    {
      path: "agregar-fundamentos",
      element: <div>Agregar fundamento</div>
    },
    {
      path: "actualizar-fundamento",
      element: <div>Actualizar fundamento</div>
    },
    {
      path: "gestion-posiciones",
      element: <PosicionesList />
    },
    {
      path: "agregar-posicion",
      element: <div>Agregar Posicion</div>
    },
    {
      path: "actualizar-posicion",
      element: <div>Actualizar Posicion</div>
    },
    {
      path: "gestion-partidos",
      element: <div>Gestion partidos</div>
    },
    {
      path: "agregar-partido",
      element: <div>Agregar partido</div>
    },
    {
      path: "actualizar-partido",
      element: <div>Actualizar partido</div>
    },
    {
      path: "gestion-jornadas",
      element: <div>Gestion jornadas</div>
    },
    {
      path: "agregar-jornada",
      element: <div>Agregar jornada</div>
    },
    {
      path: "actualizar-jornada",
      element: <div>Actualizar jornada</div>
    },
    {
      path: "gestion-sesionesindividuales",
      element: <div>Sesion Individual</div>
    },
    {
      path: "agregar-sesionindividual",
      element: <div>Agregar Sesion Individual</div>
    },
    {
      path: "actualizar-sesionindividual",
      element: <div>Actualizar Sesion Individual</div>
    }
  ]);
