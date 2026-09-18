import api from "./api";

export const login = (data) =>
    api.post("/api/customers/login", data);

export const register = (data) =>
    api.post("/api/customers/register", data);

export const forgotPassword = (data) =>
    api.post("/api/customers/forgot-password", data);

export const verifyOtp = (data) =>
    api.post("/api/customers/verify-otp", data);

export const resetPassword = (data) =>
    api.post("/api/customers/reset-password", data);