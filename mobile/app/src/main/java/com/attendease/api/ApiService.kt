package com.attendease.api

import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.POST
import retrofit2.http.Query

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

data class AttendanceRecord(
    val id: Long,
    val userId: Long,
    val date: String,
    val status: String,
    val createdAt: String
)

data class AdminAttendanceRecord(
    val id: Long,
    val userId: Long,
    val firstname: String,
    val lastname: String,
    val email: String,
    val role: String?,
    val date: String,
    val status: String,
    val createdAt: String
)

data class TodayAttendanceResponse(
    val checkedIn: Boolean
)

data class ProductDto(
    val id: Long,
    val name: String,
    val description: String?,
    val price: Double,
    val stockQuantity: Int,
    val imageUrl: String?
)

data class CartItemDto(
    val id: Long,
    val product: ProductDto,
    val quantity: Int
)

interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): AuthResponse

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): UserDto

    @GET("auth/health")
    suspend fun health(): String

    @GET("attendance/me")
    suspend fun getAttendance(): List<AttendanceRecord>

    @GET("attendance/all")
    suspend fun getAllAttendance(): List<AdminAttendanceRecord>

    @GET("attendance/today")
    suspend fun getTodayAttendance(): TodayAttendanceResponse

    @POST("attendance/check-in")
    suspend fun checkIn(): AttendanceRecord

    @GET("products")
    suspend fun getProducts(): List<ProductDto>

    @GET("products/{id}")
    suspend fun getProduct(@Path("id") id: Long): ProductDto

    @GET("cart")
    suspend fun getCart(): List<CartItemDto>

    @POST("cart/items")
    suspend fun addToCart(
        @Query("productId") productId: Long,
        @Query("quantity") quantity: Int
    ): CartItemDto

    @DELETE("cart/items/{id}")
    suspend fun removeFromCart(@Path("id") cartItemId: Long)

    @DELETE("cart")
    suspend fun clearCart()
}
