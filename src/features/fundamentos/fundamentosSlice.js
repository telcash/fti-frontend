import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const FUNDAMENTOS_URL = process.env.REACT_APP_API_URL + "fundamento";

const initialState = {
    fundamentos: [],
    fundamentoSelected: null,
    status: 'idle',
    error: null
}

export const fetchFundamentos = createAsyncThunk('fundamentos/fetchFundamentos', async () => {
    try {
        const response = await axios.get(FUNDAMENTOS_URL);
        return response.data;
    } catch (err) {
        return err.message
    }
});

export const addFundamento = createAsyncThunk('fundamentos/addFundamento', async (fundamento) => {
    try {
        const response = await axios.post(FUNDAMENTOS_URL, fundamento);
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const updateFundamento = createAsyncThunk('fundamentos/updateFundamento', async (arg) => {
    try {
        const response = await axios.patch(`${FUNDAMENTOS_URL}/${arg.id}`, arg.fundamento);
        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const deleteFundamento = createAsyncThunk('fundamentos/deleteFundamento', async (id) => {
    try {
        const response = await axios.delete(`${FUNDAMENTOS_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

const fundamentosSlice = createSlice({
    name: 'fundamentos',
    initialState,
    reducers: {
        fundamentoSelected: {
            reducer(state, action) {
                state.fundamentoSelected = action.payload;
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchFundamentos.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchFundamentos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.fundamentos = action.payload;
            })
            .addCase(fetchFundamentos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addFundamento.fulfilled, (state, action) => {
                state.fundamentos.push(action.payload);
            })
            .addCase(updateFundamento.fulfilled, (state, action) => {
                state.fundamentos.splice(state.fundamentos.findIndex(fundamento => fundamento.id === state.fundamentoSelected.id), 1, action.payload);
            })
            .addCase(deleteFundamento.fulfilled, (state, action) => {
                if(action.payload.affected === 1) {
                    state.fundamentos.splice(state.fundamentos.findIndex(fundamento => fundamento.id === state.fundamentoSelected.id), 1);
                }
                state.fundamentoSelected = null;
            })
        }        
})

export const selectAllFundamentos = (state) => state.fundamentos.fundamentos;
export const getFundamentosStatus = (state) => state.fundamentos.status;
export const getFundamentosError = (state) => state.fundamentos.error;
export const getFundamentoSelected = (state) => state.fundamentos.fundamentoSelecte;

export const { fundamentoSelected } = fundamentosSlice.actions;

export default fundamentosSlice.reducer;