import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

const EJERCICIOS_URL = process.env.REACT_APP_API_URL + "ejercicio";

const initialState = {
    ejercicios: [],
    ejercicioSelected: null,
    status: 'idle',
    error: null
}

export const fetchEjercicios = createAsyncThunk('ejercicios/fetchEjercicios', async () => {
    try {
        const response = await axiosInstance.get(EJERCICIOS_URL);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const fetchEjercicioById = createAsyncThunk('ejercicios/fetchEjercicioById', async (id) => { 
    try {
        const response = await axiosInstance.get(`${EJERCICIOS_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const addEjercicio = createAsyncThunk('ejercicios/addEjercicio', async (ejercicio) => {
    try {
        const response = await axiosInstance.post(EJERCICIOS_URL, ejercicio);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const updateEjercicio = createAsyncThunk('ejercicios/updateEjercicio', async (arg) => {  
    try {
        const response = await axiosInstance.patch(`${EJERCICIOS_URL}/${arg.id}`, arg.ejercicio);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const deleteEjercicio = createAsyncThunk('ejercicios/deleteEjercicio', async (id) => {
    try {
        const response = await axiosInstance.delete(`${EJERCICIOS_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

const ejerciciosSlice = createSlice({
    name: 'ejercicios',
    initialState,
    reducers: {
        ejercicioSelected: (state, action) => {
            state.ejercicioSelected = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchEjercicios.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchEjercicios.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.ejercicios = action.payload;
            })
            .addCase(fetchEjercicios.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addEjercicio.fulfilled, (state, action) => {
                action.payload ?? state.ejercicios.push(action.payload);
            })
            .addCase(updateEjercicio.fulfilled, (state, action) => {
                state.ejercicios.splice(state.ejercicios.findIndex(ejercicio => ejercicio.id === action.payload.id), 1, action.payload);
            })
            .addCase(deleteEjercicio.fulfilled, (state, action) => {
                if (action.payload.affected === 1) {
                    state.ejercicios.splice(state.ejercicios.findIndex(ejercicio => ejercicio.id === action.payload.id), 1);
                }
            })
            .addCase('CLEAR_PERSISTED_DATA', () => initialState)
    }
})

export const selectAllEjercicios = state => state.ejercicios.ejercicios;
export const getEjerciciosStatus = state => state.ejercicios.status;
export const getEjerciciosError = state => state.ejercicios.error;
export const getEjercicioSelected = state => state.ejercicios.ejercicioSelected;

export const { ejercicioSelected } = ejerciciosSlice.actions;

export default ejerciciosSlice.reducer;
