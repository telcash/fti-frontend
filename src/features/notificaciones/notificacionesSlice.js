import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../axiosConfig";

const NOTIFICACIONES_URL = process.env.REACT_APP_API_URL + "notificacion";

const initialState = {
    notificaciones: [],
    lastDate: null,
}

export const fetchNotificaciones = createAsyncThunk('notificaciones/fetchNotificaciones', async () => {
    try {
        const response = await axiosInstance.get(NOTIFICACIONES_URL + '/all');
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const fetchNotificationLastDate = createAsyncThunk('notificaciones/fetchNotificationLastDate', async () => {
    try {
        const response = await axiosInstance.get(NOTIFICACIONES_URL);
        return response.data[0].fecha;
    } catch (err) {
        return err.message;
    }
})


export const updateNotificationLastDate = createAsyncThunk('notificaciones/updateNotificaciones', async (notification) => {
    try {
        const response = await axiosInstance.patch(`${NOTIFICACIONES_URL}/1`, notification);
        return response.data[0].fecha;
    } catch (err) {
        return err.message;
    }
})

const notificacionesSlice = createSlice({
    name: 'notificaciones',
    initialState,
    reducers: {
        setNotificaciones: (state, action) => {
            state.notificaciones = action.payload;
        },
        setNotificacionesLastDate: (state, action) => {
            state.lastDate = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchNotificaciones.fulfilled, (state, action) => {
                state.notificaciones = action.payload;
            })
            .addCase(updateNotificationLastDate.fulfilled, (state, action) => {
                state.lastDate = action.payload;
            })
            .addCase('CLEAR_PERSISTED_DATA', () => initialState)
    }
})

export const getNotificaciones = (state) => state.notificaciones.notificaciones;

export const { setNotificaciones, setNotificacionesLastDate } = notificacionesSlice.actions;

export default notificacionesSlice.reducer;