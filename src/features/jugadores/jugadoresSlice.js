import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

const JUGADOR_URL = process.env.REACT_APP_API_URL + "jugador";

const initialState = {
    jugadores: [],
    jugadorSelected: null,
    notificaciones: [],
    status: 'idle',
    error: null 
}

export const fetchJugadores = createAsyncThunk('jugadores/fetchJugadores', async () => {
    try {
        const response = await axiosInstance.get(JUGADOR_URL);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const fetchJugadorById = createAsyncThunk('jugadores/fetchJugadorById', async (id) => {
    try {
        const response = await axiosInstance.get(`${JUGADOR_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const addJugador = createAsyncThunk('jugadores/addJugador', async (jugador) => {
    try {
        const response = await axiosInstance.post(JUGADOR_URL, jugador);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const updateJugador = createAsyncThunk('jugadores/updateJugador', async (arg) => {
    try {
        const response = await axiosInstance.patch(`${JUGADOR_URL}/${arg.id}`, arg.jugador);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const updateJugadorPosition = createAsyncThunk('jugadores/updateJugadorPosition', async (arg) => {
    try {
        const response = await axiosInstance.patch(`${JUGADOR_URL}/position/${arg.id}`, arg.jugador);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const deleteJugador = createAsyncThunk('jugadores/deleteJugador', async (id) => {
    try {
        const response = await axiosInstance.delete(`${JUGADOR_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

const jugadoresSlice = createSlice({
    name: 'jugadores',
    initialState,
    reducers: {
        jugadorSelected: {
            reducer(state, action) {
                state.jugadorSelected = action.payload;
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchJugadores.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchJugadores.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.jugadores = action.payload;
            })
            .addCase(fetchJugadores.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addJugador.fulfilled, (state, action) => {
                if (action.payload) {
                    state.jugadores = [...state.jugadores, action.payload];
                }
            })
            .addCase(updateJugador.fulfilled, (state, action) => {
                state.jugadores.splice(state.jugadores.findIndex(jugador => jugador.id === action.payload.id), 1, action.payload);
            })
            .addCase(updateJugadorPosition.fulfilled, (state, action) => {
                state.jugadores.splice(state.jugadores.findIndex(jugador => jugador.id === action.payload.id), 1, action.payload);
            })
            .addCase(deleteJugador.fulfilled, (state, action) => {
                if (action.payload.affected === 1) {
                    state.jugadores.splice(state.jugadores.findIndex(jugador => jugador.id === state.jugadorSelected.id), 1);
                }
                state.jugadorSelected = 0;
            })
            .addCase('CLEAR_PERSISTED_DATA', () => initialState)
    }
})

export const selectAllJugadores = (state) => state.jugadores.jugadores;
export const getJugadoresStatus = (state) => state.jugadores.status;
export const getJugadoresError = (state) => state.jugadores.error;
export const getJugadorSelected = (state) => state.jugadores.jugadorSelected;

export const { jugadorSelected } = jugadoresSlice.actions;

export default jugadoresSlice.reducer;