import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios";

const POSICIONES_URL = process.env.REACT_APP_API_URL + "posicion";

const initialState = {
    posiciones: [],
    posicionSelected: null,
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
});

export const addPosicion = createAsyncThunk('posiciones/addPosicion', async (posicion) => {
    try {
        const response = await axios.post(POSICIONES_URL, posicion);
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const updatePosicion = createAsyncThunk('posiciones/updatePosicion', async (arg) => {
    try {
        const response = await axios.patch(`${POSICIONES_URL}/${arg.id}`, arg.posicion);
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const deletePosicion = createAsyncThunk('posiciones/deletePosicion', async (id) => {
    try {
        const response = await axios.delete(`${POSICIONES_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

const posicionesSlice = createSlice({
    name: 'posiciones',
    initialState,
    reducers: {
        posicionSelected: {
            reducer(state, action) {
                state.posicionSelected = action.payload;
            }
        }
    },
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
            .addCase(addPosicion.fulfilled, (state, action) => {
                state.posiciones.push(action.payload);
            })
            .addCase(updatePosicion.fulfilled, (state, action) => {
                state.posiciones.splice(state.posiciones.findIndex(posicion => posicion.id === state.posicionSelected.id), 1, action.payload);
            })
            .addCase(deletePosicion.fulfilled, (state, action) => {
                if(action.payload.affected === 1) {
                    state.posiciones.splice(state.posiciones.findIndex(posicion => posicion.id === state.posicionSelected.id), 1);
                }
                state.posicionSelected = null;
            })

    }
})

export const selectAllPosiciones = (state) => state.posiciones.posiciones;
export const getPosicionesStatus = (state) => state.posiciones.status;
export const getPosicionesError = (state) => state.posiciones.error;
export const getPosicionSelected = (state) => state.posiciones.posicionSelected;

export const { posicionSelected } = posicionesSlice.actions;

export default posicionesSlice.reducer;