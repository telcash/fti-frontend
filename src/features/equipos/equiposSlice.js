import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const EQUIPO_URL = "http://localhost:3000/api/equipo";

const initialState = {
    equipos: [],
    status: 'idle',
    error: null 
}

export const fetchEquipos = createAsyncThunk('equipos/fetchEquipos', async () => {
    try {
        const response = await axios.get(EQUIPO_URL);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

const equiposSlice = createSlice({
    name: 'equipos',
    initialState,
    reducers: {
        equipoAdded: {
            reducer(state, action) {
                state.equipos.push(action.payload)
            }
        }
    },
    extraReducers(builder) {
        builder
        .addCase(fetchEquipos.pending, (state, action) => {
            state.status = 'loading';
        })
        .addCase(fetchEquipos.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.equipos = action.payload;
        })
        .addCase(fetchEquipos.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
})

export const selectAllEquipos = (state) => state.equipos.equipos;
export const getEquiposStatus = (state) => state.equipos.status;
export const getEquiposError = (state) => state.equipos.error;

export const { equipoAdded } = equiposSlice.actions;

export default equiposSlice.reducer;