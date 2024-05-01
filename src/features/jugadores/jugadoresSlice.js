import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const JUGADOR_URL = process.env.REACT_APP_API_URL + "jugador";

const initialState = {
    jugadores: [],
    jugadorSelected: null,
    status: 'idle',
    error: null 
}

export const fetchJugadores = createAsyncThunk('jugadores/fetchJugadores', async () => {
    try {
        const response = await axios.get(JUGADOR_URL);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const fetchJugadorById = createAsyncThunk('jugadores/fetchJugadorById', async (id) => {
    try {
        const response = await axios.get(`${JUGADOR_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const addJugador = createAsyncThunk('jugadores/addJugador', async (jugador) => {
    try {
        const response = await axios.post(JUGADOR_URL, jugador);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const updateJugador = createAsyncThunk('jugadores/updateJugador', async (arg) => {
    try {
        const response = await axios.patch(`${JUGADOR_URL}/${arg.id}`, arg.jugador);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const deleteJugador = createAsyncThunk('jugadores/deleteJugador', async (id) => {
    try {
        const response = await axios.delete(`${JUGADOR_URL}/${id}`);
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
        }
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
                state.jugadores.push(action.payload);
            })
            .addCase(updateJugador.fulfilled, (state, action) => {
                state.jugadores.splice(state.jugadores.findIndex(jugador => jugador.id === state.jugadorSelected.id), 1, action.payload);
            })
            .addCase(deleteJugador.fulfilled, (state, action) => {
                if (action.payload.affected === 1) {
                    state.jugadores.splice(state.jugadores.findIndex(jugador => jugador.id === state.jugadorSelected.id), 1);
                }
                state.jugadorSelected = 0;
            })
    }
})

export const selectAllJugadores = (state) => state.jugadores.jugadores;
export const getJugadoresStatus = (state) => state.jugadores.status;
export const getJugadoresError = (state) => state.jugadores.error;
export const getJugadorSelected = (state) => state.jugadores.jugadorSelected;

export const { jugadorAdded, jugadorSelected } = jugadoresSlice.actions;

export default jugadoresSlice.reducer;