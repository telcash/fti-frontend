import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

const PARTIDO_URL = process.env.REACT_APP_API_URL + "partido";

const initialState = {
    partidos: [],
    partidoSelected: null,
    status: 'idle',
    error: null
}

export const fetchPartidos = createAsyncThunk('partidos/fetchPartidos', async () => {
    try {
        const response = await axiosInstance.get(PARTIDO_URL);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const fetchPartidoById = createAsyncThunk('partidos/fetchPartidoById', async (id) => {
    try {
        const response = await axiosInstance.get(`${PARTIDO_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const addPartido = createAsyncThunk('partidos/addPartido', async (partido) => {
    try {
        const response = await axiosInstance.post(PARTIDO_URL, partido);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const updatePartido = createAsyncThunk('partidos/updatePartido', async (arg) => {
    try {
        const response = await axiosInstance.patch(`${PARTIDO_URL}/${arg.id}`, arg.partido);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const deletePartido = createAsyncThunk('partidoss/deletePartido', async (id) => {
    try {
        const response = await axiosInstance.delete(`${PARTIDO_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

const partidosSlice = createSlice({
    name: 'partidos',
    initialState,
    reducers: {
        partidoSelected: {
            reducer(state, action) {
                state.partidoSelected = action.payload;
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPartidos.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchPartidos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.partidos = action.payload;
            })
            .addCase(fetchPartidos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addPartido.fulfilled, (state, action) => {
                if (action.payload) {
                    state.partidos = [...state.partidos, action.payload];
                }
            })
            .addCase(updatePartido.fulfilled, (state, action) => {
                state.partidos.splice(state.partidos.findIndex(partido => partido.id === state.partidoSelected.id), 1, action.payload);
            })
            .addCase(deletePartido.fulfilled, (state, action) => {
                if (action.payload.affected === 1) {
                    state.partidos.splice(state.partidos.findIndex(partido => partido.id === state.partidoSelected.id), 1);
                }
                state.partidoSelected = 0;
            })
            .addCase('CLEAR_PERSISTED_DATA', () => initialState)
    }
})

export const selectAllPartidos = (state) => state.partidos.partidos;
export const getPartidosStatus = (state) => state.partidos.status;
export const getPartidosError = (state) => state.partidos.error;
export const getPartidoSelected = (state) => state.partidos.partidoSelected;

export const { partidoSelected } = partidosSlice.actions;

export default partidosSlice.reducer;