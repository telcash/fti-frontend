import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

const SESION_URL = process.env.REACT_APP_API_URL + "sesion-individual";

const initialState = {
    sesiones: [],
    sesionSelected: null,
    status: 'idle',
    error: null
}

export const fetchSesiones = createAsyncThunk('sesiones/fetchSesiones', async () => {
    try {
        const response = await axiosInstance.get(SESION_URL);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const fetchSesionById = createAsyncThunk('sesiones/fetchSesionById', async (id) => {
    try {
        const response = await axiosInstance.get(`${SESION_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const addSesion = createAsyncThunk('sesiones/addSesion', async (sesion) => {
    try {
        const response = await axiosInstance.post(SESION_URL, sesion);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const updateSesion = createAsyncThunk('sesiones/updateSesion', async (arg) => {
    try {
        const response = await axiosInstance.patch(`${SESION_URL}/${arg.id}`, arg.sesion);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const deleteSesion = createAsyncThunk('sesiones/deleteSesion', async (id) => {
    try {
        const response = await axiosInstance.delete(`${SESION_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

const sesionesSlice = createSlice({
    name: 'sesiones',
    initialState,
    reducers: {
        sesionSelected: {
            reducer(state, action) {
                state.sesionSelected = action.payload;
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchSesiones.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchSesiones.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sesiones = action.payload;
            })
            .addCase(fetchSesiones.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addSesion.fulfilled, (state, action) => {
                action.payload ?? state.sesiones.push(action.payload);
            })
            .addCase(updateSesion.fulfilled, (state, action) => {
                state.sesiones.splice(state.sesiones.findIndex(sesion => sesion.id === state.sesionSelected.id), 1, action.payload);
            })
            .addCase(deleteSesion.fulfilled, (state, action) => {
                if (action.payload.affected === 1) {
                    state.sesiones.splice(state.sesiones.findIndex(sesion => sesion.id === state.sesionSelected.id), 1);
                }
                state.sesionSelected = 0;
            })
            .addCase('CLEAR_PERSISTED_DATA', () => initialState)
    }
})

export const selectAllSesiones = (state) => state.sesiones.sesiones;
export const getSesionesStatus = (state) => state.sesiones.status;
export const getSesionesError = (state) => state.sesiones.error;
export const getSesionSelected = (state) => state.sesiones.sesionSelected;

export const { sesionSelected } = sesionesSlice.actions;

export default sesionesSlice.reducer;