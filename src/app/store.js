import { configureStore } from "@reduxjs/toolkit";
import jugadoresReducer from '../features/jugadores/jugadoresSlice';
import equiposReducer from '../features/equipos/equiposSlice';
import posicionesReducer from '../features/posiciones/posicionesSlice';
import fundamentosReducer from '../features/fundamentos/fundamentosSlice';
import partidosReducer from '../features/partidos/partidosSlice';
import sesionesReducer from '../features/sesion-individual/sesionIndividualSlice';
import ejerciciosReducer from '../features/ejercicios/ejerciciosSlice';
import jugadorToPartidosReducer from '../features/jugador-to-partido/jugadorToPartidoSlice';

export const store = configureStore({
    reducer: {
        jugadores: jugadoresReducer,
        equipos: equiposReducer,
        posiciones: posicionesReducer,
        fundamentos: fundamentosReducer,
        partidos: partidosReducer,
        sesiones: sesionesReducer,
        ejercicios: ejerciciosReducer,
        jugadorToPartidos: jugadorToPartidosReducer
    }
})