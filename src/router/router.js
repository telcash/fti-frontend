import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Jugadores from "../features/jugadores/Jugadores";
import JugadoresList from "../features/jugadores/JugadoresList";
import AddJugadorForm from "../features/jugadores/AddJugadorForm";
import UpdateJugadorForm from "../features/jugadores/UpdateJugadorForm";
import EquiposList from "../features/equipos/EquiposList";
import AddEquipoForm from "../features/equipos/AddEquipoForm";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Jugadores />
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
    }
  ]);
