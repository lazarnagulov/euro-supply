export interface LoginRequest {
    username: string;
    password: string;
}

export interface UserStateResponse {
    token: string;
    expiresIn: string;
}