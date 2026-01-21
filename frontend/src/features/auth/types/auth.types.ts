export interface LoginRequest {
    username: string;
    password: string;
}

export interface UserStateResponse {
    token: string;
    expiresIn: string;
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
    // TODO: add photo
}