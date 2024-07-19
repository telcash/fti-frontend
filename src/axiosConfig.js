import axios from "axios";
import { paths, router } from "./router/router";

const axiosInstance = axios.create({
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            router.navigate(paths.login, {replace: true});
        }

        return Promise.reject(error);
    }
)

export default axiosInstance;