import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const EQUIPO_URL = "http://localhost:3000/api/equipo";

const initialState = {
    equipos: [],
    equipoSelected: 0,
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

export const addEquipo = createAsyncThunk('equipos/addEquipo', async (equipo) => {
    try {
        const response = await axios.post(EQUIPO_URL, equipo);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const deleteEquipo = createAsyncThunk('equipos/deleteJugador', async (id) => {
    try {
        const response = await axios.delete(`${EQUIPO_URL}/${id}`);
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
        },
        equipoSelected: {
            reducer(state, action) {
                state.equipoSelected = action.payload;
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
        .addCase(addEquipo.fulfilled, (state, action) => {
            state.equipos.push(action.payload);
        })
        .addCase(deleteEquipo.fulfilled, (state, action) => {
            if(action.payload.affected === 1) {
                state.equipos.splice(state.equipos.findIndex(equipo => equipo.id === state.equipoSelected), 1);
            }
            state.equipoSelected = 0;
        })
    }
})

export const selectAllEquipos = (state) => state.equipos.equipos;
export const getEquiposStatus = (state) => state.equipos.status;
export const getEquiposError = (state) => state.equipos.error;
export const getEquipoSelected = (state) => state.equipos.equipoSelected;

export const { equipoAdded, equipoSelected } = equiposSlice.actions;

export default equiposSlice.reducer;