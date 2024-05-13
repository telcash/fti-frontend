import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    drawerOpen: false
}

const mainDrawerSlice = createSlice({
    name: 'mainDrawer',
    initialState,
    reducers: {
        toggleDrawer: state => {
            state.drawerOpen = !state.drawerOpen;
        }
    }
})

export const { toggleDrawer } = mainDrawerSlice.actions;

export const getDrawerOpen = state => state.mainDrawer.drawerOpen;

export default mainDrawerSlice.reducer;