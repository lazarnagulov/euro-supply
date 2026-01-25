import type { StoredFile } from "../../../types/file.types";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface UserStateResponse {
    userId: number;
    token: string;
    expiresIn: string;
    mustChangePassword: boolean;
}

export interface RegistrationRequest {
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    person: PersonRequest;
}

export interface AuthResponse {
    id: number;
}

export interface PersonRequest {
    firstname: string;
    lastname: string;
    phoneNumber: string;
    imageUrl?: StoredFile;
}