import { combineReducers, configureStore } from "@reduxjs/toolkit";
import jugadoresReducer from '../features/jugadores/jugadoresSlice';
import equiposReducer from '../features/equipos/equiposSlice';
import posicionesReducer from '../features/posiciones/posicionesSlice';
import fundamentosReducer from '../features/fundamentos/fundamentosSlice';
import partidosReducer from '../features/partidos/partidosSlice';
import sesionesReducer from '../features/sesion-individual/sesionIndividualSlice';
import ejerciciosReducer from '../features/ejercicios/ejerciciosSlice';
import jugadorToPartidosReducer from '../features/jugador-to-partido/jugadorToPartidoSlice';
import notificacionesReducer from '../features/notificaciones/notificacionesSlice';

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
 } from "redux-persist";

const rootPersistConfig = {
    key: 'root',
    storage,
}

const jugadoresPersistConfig = {
    key: 'jugadores',
    storage,
    whitelist: ['jugadores']
}

const equiposPersistConfig = {
    key: 'equipos',
    storage,
    whitelist: ['equipos']
}

const posicionesPersistConfig = {
    key: 'posiciones',
    storage,
    whitelist: ['posiciones']
}

const fundamentosPersistConfig = {
    key: 'fundamentos',
    storage,
    whitelist: ['fundamentos']
}

const partidosPersistConfig = {
    key: 'partidos',
    storage,
    whitelist: ['partidos']
}

const sesionesPersistConfig = {
    key: 'sesiones',
    storage,
    whitelist: ['sesiones']
}

const ejerciciosPersistConfig = {
    key: 'ejercicios',
    storage,
    whitelist: ['ejercicios']
}

const jugadorToPartidosPersistConfig = {
    key: 'jugadorToPartidos',
    storage,
    whitelist: ['jugadorToPartidos']
}

const notificacionesPersistConfig = {
    key: 'notificaciones',
    storage,
    whitelist: ['notificaciones']
}

const rootReducer = combineReducers({
    jugadores: persistReducer(jugadoresPersistConfig, jugadoresReducer),
    equipos: persistReducer(equiposPersistConfig, equiposReducer),
    posiciones: persistReducer(posicionesPersistConfig, posicionesReducer),
    fundamentos: persistReducer(fundamentosPersistConfig, fundamentosReducer),
    partidos: persistReducer(partidosPersistConfig, partidosReducer),
    sesiones: persistReducer(sesionesPersistConfig, sesionesReducer),
    ejercicios: persistReducer(ejerciciosPersistConfig, ejerciciosReducer),
    jugadorToPartidos: persistReducer(jugadorToPartidosPersistConfig, jugadorToPartidosReducer),
    notificaciones: persistReducer(notificacionesPersistConfig, notificacionesReducer),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
})

export const persistor = persistStore(store);