import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    drawerOpen: false,
    userSession: false,
}

const mainDrawerSlice = createSlice({
    name: 'mainDrawer',
    initialState,
    reducers: {
        toggleDrawer: state => {
            state.drawerOpen = !state.drawerOpen;
        },
        setUserSession: (state, action) => {
            state.userSession = action.payload;
        }
    }
})

export const { toggleDrawer, setUserSession } = mainDrawerSlice.actions;

export const getDrawerOpen = state => state.mainDrawer.drawerOpen;
export const getUserSession = state => state.mainDrawer.userSession;

export default mainDrawerSlice.reducer;