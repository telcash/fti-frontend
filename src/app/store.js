import { configureStore } from "@reduxjs/toolkit";
import jugadoresReducer from '../features/jugadores/jugadoresSlice';
import equiposReducer from '../features/equipos/equiposSlice'

export const store = configureStore({
    reducer: {
        jugadores: jugadoresReducer,
        equipos: equiposReducer,
    }
})