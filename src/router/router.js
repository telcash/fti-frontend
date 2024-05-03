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
      element: <FundamentosList />
    },
    {
      path: "agregar-fundamento",
      element: <AddFundamentoForm />
    },
    {
      path: "actualizar-fundamento",
      element: <UpdateFundamentoForm />
    },
    {
      path: "gestion-posiciones",
      element: <PosicionesList />
    },
    {
      path: "agregar-posicion",
      element: <AddPosicionForm />
    },
    {
      path: "actualizar-posicion",
      element: <UpdatePosicionForm />
    },
    {
      path: "gestion-partidos",
      element: <PartidosList />
    },
    {
      path: "agregar-partido",
      element: <AddPartidoForm />
    },
    {
      path: "actualizar-partido",
      element: <UpdatePartidoForm />
    },
    {
      path: "gestion-sesionesindividuales",
      element: <SesionesList />
    },
    {
      path: "agregar-sesionindividual",
      element: <AddSesionForm />
    },
    {
      path: "actualizar-sesionindividual",
      element: <UpdateSesionForm />
    }
  ]);
