import { configureStore } from "@reduxjs/toolkit";
import jugadoresReducer from '../features/jugadores/jugadoresSlice';
import equiposReducer from '../features/equipos/equiposSlice';
import posicionesReducer from '../features/posiciones/posicionesSlice';
import fundamentosReducer from '../features/fundamentos/fundamentosSlice';

export const store = configureStore({
    reducer: {
        jugadores: jugadoresReducer,
        equipos: equiposReducer,
        posiciones: posicionesReducer,
        fundamentos: fundamentosReducer,
    }
})