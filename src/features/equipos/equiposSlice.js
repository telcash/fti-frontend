import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../../axiosConfig';

const EQUIPO_URL = process.env.REACT_APP_API_URL + "equipo";

const initialState = {
    equipos: [],
    equipoSelected: null,
    equipoCancha: null,
    draggablePositions: {},
    status: 'idle',
    error: null 
}

export const fetchEquipos = createAsyncThunk('equipos/fetchEquipos', async () => {
    try {
        const response = await axiosInstance.get(EQUIPO_URL);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const addEquipo = createAsyncThunk('equipos/addEquipo', async (equipo) => {
    try {
        const response = await axiosInstance.post(EQUIPO_URL, equipo);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const updateEquipo = createAsyncThunk('equipos/updateEquipo', async (arg) => {
    try {
        const response = await axiosInstance.patch(`${EQUIPO_URL}/${arg.id}`, arg.equipo);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const deleteEquipo = createAsyncThunk('equipos/deleteJugador', async (id) => {
    try {
        const response = await axiosInstance.delete(`${EQUIPO_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

const equiposSlice = createSlice({
    name: 'equipos',
    initialState,
    reducers: {
        equipoSelected: {
            reducer(state, action) {
                state.equipoSelected = action.payload;
            }
        },
        selectEquipoCancha: {
            reducer(state, action) {
                state.equipoCancha = action.payload;
            }
        },
        selectDraggablePositions: {
            reducer(state, action) {
                state.draggablePositions = action.payload;
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
            if (action.payload) {
                state.equipos = [...state.equipos, action.payload];
            }
        })
        .addCase(updateEquipo.fulfilled, (state, action) => {
            state.equipos.splice(state.equipos.findIndex(equipo => equipo.id === state.equipoSelected.id), 1, action.payload);
        })
        .addCase(deleteEquipo.fulfilled, (state, action) => {
            if(action.payload.affected === 1) {
                state.equipos.splice(state.equipos.findIndex(equipo => equipo.id === state.equipoSelected.id), 1);
            }
            state.equipoSelected = null;
        })
        .addCase('CLEAR_PERSISTED_DATA', () => initialState)
    }
})

export const selectAllEquipos = (state) => state.equipos.equipos;
export const getEquiposStatus = (state) => state.equipos.status;
export const getEquiposError = (state) => state.equipos.error;
export const getEquipoSelected = (state) => state.equipos.equipoSelected;
export const getDraggablePositions = (state) => state.equipos.draggablePositions;
export const getEquipoCancha = (state) => state.equipos.equipoCancha;

export const { equipoSelected, selectDraggablePositions, selectEquipoCancha } = equiposSlice.actions;

export default equiposSlice.reducer;