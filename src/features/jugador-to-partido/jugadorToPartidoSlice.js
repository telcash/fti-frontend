import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios";

const JUGADOR_TO_PARTIDO_URL = process.env.REACT_APP_API_URL + "jugador-to-partido";

const initialState = {
    jugadorToPartidos: [],
    jugadorToPartidoSelected: null,
    status: 'idle',
    error: null
}

export const fetchJugadorToPartidos = createAsyncThunk('jugadorToPartidos/fetchJugadorToPartidos', async () => {
    try {
        const response = await axios.get(JUGADOR_TO_PARTIDO_URL);
        return response.data;
    } catch (err) {
        return err.message
    }
}   );

export const addJugadorToPartido = createAsyncThunk('jugadorToPartidos/addJugadorToPartido', async (jugadorToPartido) => {
    try {
        const response = await axios.post(JUGADOR_TO_PARTIDO_URL, jugadorToPartido);
        return response.data;
    } catch (err) {
        return err.message;
    }
}   );

export const updateJugadorToPartido = createAsyncThunk('jugadorToPartidos/updateJugadorToPartido', async (arg) => {
    try {
        const response = await axios.patch(`${JUGADOR_TO_PARTIDO_URL}/${arg.id}`, arg.jugadorToPartido);
        return response.data;
    } catch (err) {
        return err.message;
    }
}   );

export const deleteJugadorToPartido = createAsyncThunk('jugadorToPartidos/deleteJugadorToPartido', async (id) => {  
    try {
        const response = await axios.delete(`${JUGADOR_TO_PARTIDO_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
}   );

const jugadorToPartidoSlice = createSlice({
    name: 'jugadorToPartidos',
    initialState,
    reducers: {
        jugadorToPartidoSelected: {
            reducer(state, action) {
                state.jugadorToPartidoSelected = action.payload;
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchJugadorToPartidos.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchJugadorToPartidos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.jugadorToPartidos = action.payload;
            })
            .addCase(fetchJugadorToPartidos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addJugadorToPartido.fulfilled, (state, action) => {
                state.jugadorToPartidos.push(action.payload);
            })
            .addCase(updateJugadorToPartido.fulfilled, (state, action) => {
                state.jugadorToPartidos.splice(state.jugadorToPartidos.findIndex(jugadorToPartido => jugadorToPartido.jugadorToPartidoId === action.payload.jugadorToPartidoId), 1, action.payload);
            })
            .addCase(deleteJugadorToPartido.fulfilled, (state, action) => {
                if(action.payload.affected === 1) {
                    state.jugadorToPartidos = state.jugadorToPartidos.splice(state.jugadorToPartidos.findIndex(jugadorToPartido => jugadorToPartido.id === state.jugadorToPartidoSelected.id), 1);
                }
            })
    }
});

export const selectAllJugadorToPartidos = state => state.jugadorToPartidos.jugadorToPartidos;
export const getJugadorToPartidosStatus = state => state.jugadorToPartidos.status;
export const getJugadorToPartidosError = state => state.jugadorToPartidos.error;
export const getJugadorToPartidoSelected = state => state.jugadorToPartidos.jugadorToPartidoSelected;

export const { jugadorToPartidoSelected } = jugadorToPartidoSlice.actions;

export default jugadorToPartidoSlice.reducer;