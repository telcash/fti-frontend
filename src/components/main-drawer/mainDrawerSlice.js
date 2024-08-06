import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    drawerOpen: false,
    userSession: false,
    activeMenuIndex: 0,
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
        },
        setActiveMenuIndex: (state, action) => {
            state.activeMenuIndex = action.payload;
        }
    }
})

export const { toggleDrawer, setUserSession, setActiveMenuIndex } = mainDrawerSlice.actions;

export const getDrawerOpen = state => state.mainDrawer.drawerOpen;
export const getUserSession = state => state.mainDrawer.userSession;
export const getActiveMenuIndex = state => state.mainDrawer.activeMenuIndex;

export default mainDrawerSlice.reducer;