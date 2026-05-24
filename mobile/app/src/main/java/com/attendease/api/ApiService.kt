package com.attendease.api

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Header

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val email: String,
    val password: String,
    val firstname: String,
    val lastname: String,
    val role: String
)

data class AuthResponse(
    val accessToken: String,
    val refreshToken: String,
    val user: UserDto
)

data class UserDto(
    val id: Long,
    val email: String,
    val firstname: String,
    val lastname: String,
    val role: String
)

interface ApiService {
    @POST("/auth/login")
    suspend fun login(@Body request: LoginRequest): AuthResponse

    @POST("/auth/register")
    suspend fun register(@Body request: RegisterRequest): UserDto

    @GET("/auth/health")
    suspend fun health(): String
}
