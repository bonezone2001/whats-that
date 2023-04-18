// get extra from manifest
import Constants from "expo-constants";
const { extra } = Constants.manifest;
const API_BASE_URL = extra.API_BASE_URL;

export const user = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        return response;
    },

    register: async (first_name, last_name, email, password) => {
        const response = await fetch(`${API_BASE_URL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                first_name,
                last_name,
                email,
                password,
            }),
        });
        return response;
    }
};