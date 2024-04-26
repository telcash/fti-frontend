import { configureStore } from "@reduxjs/toolkit";
import jugadoresReducer from '../features/jugadores/jugadoresSlice';

export const store = configureStore({
    reducer: {
        jugadores: jugadoresReducer,
    }
})