import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig";

const VIDEOS_JUGADOR_URL = process.env.REACT_APP_API_URL + "video-jugador";

const initialState = {
    videos: [],
    videoSelected: null,
    status: 'idle',
    error: null
}

export const fetchVideos = createAsyncThunk('videos/fetchVideos', async () => {
    try {
        const response = await axiosInstance.get(VIDEOS_JUGADOR_URL);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const fetchVideoById = createAsyncThunk('videos/fetchVideoById', async (id) => {
    try {
        const response = await axiosInstance.get(`${VIDEOS_JUGADOR_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const addVideo = createAsyncThunk('videos/addVideo', async (video) => {
    try {
        const response = await axiosInstance.post(VIDEOS_JUGADOR_URL, video);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const updateVideo = createAsyncThunk('videos/updateVideo', async (arg) => {
    try {
        const response = await axiosInstance.patch(`${VIDEOS_JUGADOR_URL}/${arg.id}`, arg.video);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

export const deleteVideo = createAsyncThunk('videos/deleteVideo', async (id) => {
    try {
        const response = await axiosInstance.delete(`${VIDEOS_JUGADOR_URL}/${id}`);
        return response.data;
    } catch (err) {
        return err.message;
    }
})

const videosSlice = createSlice({
    name: 'videos',
    initialState,
    reducers: {
        videoSelected: {
            reducer(state, action) {
                state.videoSelected = action.payload;
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchVideos.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchVideos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.videos = action.payload;
            })
            .addCase(fetchVideos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addVideo.fulfilled, (state, action) => {
                if (action.payload) {
                    state.videos = [...state.videos, action.payload];
                }
                action.payload ?? state.videos.push(action.payload);
            })
            .addCase(updateVideo.fulfilled, (state, action) => {
                state.videos.splice(state.videos.findIndex(video => video.id === state.videoSelected.id), 1, action.payload);
            })
            .addCase(deleteVideo.fulfilled, (state, action) => {
                if (action.payload.affected === 1) {
                    state.videos.splice(state.videos.findIndex(video => video.id === state.videoSelected.id), 1);
                }
                state.videoSelected = 0;
            })
            .addCase('CLEAR_PERSISTED_DATA', () => initialState)
    }
})

export const selectAllVideos = (state) => state.videos.videos;
export const getVideosStatus = (state) => state.videos.status;
export const getVideosError = (state) => state.videos.error;
export const getVideoSelected = (state) => state.videos.videoSelected;

export const { videoSelected } = videosSlice.actions;

export default videosSlice.reducer;