export interface LoginRequest {
    email: string
    password: string
}

export interface UserInfo {
    id: string
    name: string
    email: string
    role: string
}

export interface LoginResponse {
    token: string
    user: UserInfo
}