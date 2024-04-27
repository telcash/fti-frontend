import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios";

const POSICIONES_URL = "http://localhost:3000/api/posicion";

const initialState = {
    posiciones: [],
    status: 'idle',
    error: null 
}

export const fetchPosiciones = createAsyncThunk('posiciones/fetchPosiciones', async () => {
    try {
        const response = await axios.get(POSICIONES_URL);
        return response.data;
    } catch (err) {
        return err.message
    }
})

const posicionesSlice = createSlice({
    name: 'posiciones',
    initialState,
    extraReducers(builder) {
        builder
            .addCase(fetchPosiciones.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchPosiciones.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posiciones = action.payload;
            })
            .addCase(fetchPosiciones.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
})

export const selectAllPosiciones = (state) => state.posiciones.posiciones;
export const getPosicionesStatus = (state) => state.posiciones.status;

export default posicionesSlice.reducer;