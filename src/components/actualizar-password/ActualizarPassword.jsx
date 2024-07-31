import { useState } from "react";
import { useDispatch } from "react-redux"
import axios from "axios";
import { setUserSession } from "../main-drawer/mainDrawerSlice";
import { paths, router } from "../../router/router";
import { Button, TextField, Typography } from "@mui/material";
import './actualizar-password.css'

const USERS_URL = process.env.REACT_APP_API_URL + "users";

const ActualizarPassword = () => {
    const dispatch = useDispatch();
    const [password, setPassword] = useState();
    const [checkPassword, setCheckPassword] = useState();
    const [errorStatus, setErrorStatus] = useState(false);
    const errorMessage = "Las contraseñas no coinciden";

    const onPasswordChanged = e => setPassword(e.target.value);
    const onCheckPasswordChanged = e => setCheckPassword(e.target.value);

    const handleActualizarPassword = async () => {
        try {
            if( password === checkPassword) {
                const response = await axios.post(`${USERS_URL}/password`, {
                    password: password
                }, 
                {
                    withCredentials: true,    
                });
                if (response.status === 201) {
                    dispatch(setUserSession(false));
                    router.navigate(paths.login, {replace: true});
                }
            } else {
                setErrorStatus(true);
            }
        } catch (error) {
            setErrorStatus(true);
            return error.message;
        }
    }

    return (
        <section className="actualizar-password">
            <h2>Actualizar Password</h2>
            <form className="actualizar-password-form">
                <div className="actualizar-password-form-fields">
                    <TextField
                        required
                        id="password"
                        type="password"
                        label="Contraseña"
                        value={password}
                        onChange={onPasswordChanged} 
                    />
                    <TextField
                        required
                        id="checkPassword"
                        type="password"
                        label="Repita la nueva contraseña"
                        value={checkPassword}
                        onChange={onCheckPasswordChanged} 
                    />
                </div>
                <div>
                    {
                        errorStatus && <Typography color='red'>{errorMessage}</Typography>
                    }
                </div>
                <div className="actualizar-password-form-buttons">
                    <Button sx={{backgroundColor: '#007bff'}} variant="contained" onClick={handleActualizarPassword}>Actualizar Contraseña</Button>
                </div>
            </form>
        </section>
    )
}

export default ActualizarPassword;