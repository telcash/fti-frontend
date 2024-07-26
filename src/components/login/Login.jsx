import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { paths, router } from "../../router/router";
import './login.css';
import { clearPersistedData, persistor, store } from "../../app/store";
import { useDispatch } from "react-redux";
import { setUserSession } from "../main-drawer/mainDrawerSlice";

const USERS_URL = process.env.REACT_APP_API_URL + "users";

const Login = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorStatus, setErrorStatus] = useState(false);
    const errorMessage = "Credenciales inválidas";

    const onUsernameChanged = e => setUsername(e.target.value);
    const onPasswordChanged = e => setPassword(e.target.value);

    const clearData = async () => {
        store.dispatch(clearPersistedData());
        await persistor.purge();
    }

    useEffect(() => {
        clearData();
    })

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${USERS_URL}/login`, {
                username: username,
                password: password
            },
            {
                withCredentials: true,
            });
            if (response.status === 201) {
                dispatch(setUserSession(true));
                router.navigate(paths.jugadores, {replace: true});
            }
        }
        catch (err) {
            setErrorStatus(true);
            return err.message;
        }
    }

    return (
        <section className="login">
            <h2>Iniciar sesión</h2>
            <form className="login-form">
                <div className="login-form-fields">
                    <TextField
                        required
                        id="username"
                        label="Nombre de usuario"
                        value={username}
                        onChange={onUsernameChanged} 
                    />
                    <TextField
                        required
                        type="password"
                        id="password"
                        label="Contraseña"
                        value={password}
                        onChange={onPasswordChanged} 
                    />
                </div>
                <div>
                    {
                        errorStatus && <Typography color='red'>{errorMessage}</Typography>
                    }
                </div>
                <div className="login-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={handleLogin}>Iniciar Sesión</Button>
                </div>
            </form>
        </section>
    )
}

export default Login;