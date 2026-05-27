package com.attendease.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.attendease.api.ApiService
import com.attendease.api.AdminAttendanceRecord
import com.attendease.api.AuthResponse
import com.attendease.api.CartItemDto
import com.attendease.api.LoginRequest
import com.attendease.api.ProductDto
import com.attendease.api.RegisterRequest
import com.attendease.api.RetrofitClient
import com.attendease.api.UserDto
import com.attendease.api.AttendanceRecord
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class AuthState {
    object Idle : AuthState()
    object Loading : AuthState()
    data class Success(val user: UserDto) : AuthState()
    object Registered : AuthState()
    data class Error(val message: String) : AuthState()
}

class AuthViewModel : ViewModel() {
    private val apiService = RetrofitClient.getApiService()

    private val _authState = MutableStateFlow<AuthState>(AuthState.Idle)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    private val _isLoggedIn = MutableStateFlow(false)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn.asStateFlow()

    // Attendance State
    private val _attendanceRecords = MutableStateFlow<List<AttendanceRecord>>(emptyList())
    val attendanceRecords: StateFlow<List<AttendanceRecord>> = _attendanceRecords.asStateFlow()

    private val _adminAttendanceRecords = MutableStateFlow<List<AdminAttendanceRecord>>(emptyList())
    val adminAttendanceRecords: StateFlow<List<AdminAttendanceRecord>> = _adminAttendanceRecords.asStateFlow()

    private val _loadingAttendance = MutableStateFlow(false)
    val loadingAttendance: StateFlow<Boolean> = _loadingAttendance.asStateFlow()

    private val _attendanceError = MutableStateFlow<String?>(null)
    val attendanceError: StateFlow<String?> = _attendanceError.asStateFlow()

    private val _checkingIn = MutableStateFlow(false)
    val checkingIn: StateFlow<Boolean> = _checkingIn.asStateFlow()

    private val _products = MutableStateFlow<List<ProductDto>>(emptyList())
    val products: StateFlow<List<ProductDto>> = _products.asStateFlow()

    private val _loadingProducts = MutableStateFlow(false)
    val loadingProducts: StateFlow<Boolean> = _loadingProducts.asStateFlow()

    private val _productsMessage = MutableStateFlow<String?>(null)
    val productsMessage: StateFlow<String?> = _productsMessage.asStateFlow()

    private val _cartItems = MutableStateFlow<List<CartItemDto>>(emptyList())
    val cartItems: StateFlow<List<CartItemDto>> = _cartItems.asStateFlow()

    private val _loadingCart = MutableStateFlow(false)
    val loadingCart: StateFlow<Boolean> = _loadingCart.asStateFlow()

    private val _cartMessage = MutableStateFlow<String?>(null)
    val cartMessage: StateFlow<String?> = _cartMessage.asStateFlow()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                val response = apiService.login(LoginRequest(email, password))
                RetrofitClient.setAccessToken(response.accessToken)
                _isLoggedIn.value = true
                _authState.value = AuthState.Success(response.user)
            } catch (e: Exception) {
                val errorMessage = getErrorMessage(e)
                _authState.value = AuthState.Error(errorMessage)
            }
        }
    }

    fun register(email: String, password: String, firstname: String, lastname: String, role: String) {
        viewModelScope.launch {
            _authState.value = AuthState.Loading
            try {
                apiService.register(RegisterRequest(email, password, firstname, lastname, role))
                _authState.value = AuthState.Registered
            } catch (e: Exception) {
                val errorMessage = getErrorMessage(e)
                _authState.value = AuthState.Error(errorMessage)
            }
        }
    }

    fun logout() {
        RetrofitClient.clearAccessToken()
        _isLoggedIn.value = false
        _authState.value = AuthState.Idle
        _attendanceRecords.value = emptyList()
        _adminAttendanceRecords.value = emptyList()
        _products.value = emptyList()
        _cartItems.value = emptyList()
    }

    fun resetState() {
        _authState.value = AuthState.Idle
    }

    fun loadAttendance() {
        viewModelScope.launch {
            _loadingAttendance.value = true
            _attendanceError.value = null
            try {
                val records = apiService.getAttendance()
                _attendanceRecords.value = records
            } catch (e: Exception) {
                _attendanceError.value = getErrorMessage(e)
            } finally {
                _loadingAttendance.value = false
            }
        }
    }

    fun loadAdminAttendance() {
        viewModelScope.launch {
            _loadingAttendance.value = true
            _attendanceError.value = null
            try {
                _adminAttendanceRecords.value = apiService.getAllAttendance()
            } catch (e: Exception) {
                _attendanceError.value = getErrorMessage(e)
            } finally {
                _loadingAttendance.value = false
            }
        }
    }

    fun checkIn(onComplete: (Boolean) -> Unit = {}) {
        viewModelScope.launch {
            _checkingIn.value = true
            _attendanceError.value = null
            try {
                val record = apiService.checkIn()
                val currentList = _attendanceRecords.value.toMutableList()
                if (currentList.none { it.id == record.id }) {
                    currentList.add(0, record)
                    _attendanceRecords.value = currentList
                }
                onComplete(true)
            } catch (e: Exception) {
                _attendanceError.value = getErrorMessage(e)
                onComplete(false)
            } finally {
                _checkingIn.value = false
            }
        }
    }

    fun loadProducts() {
        viewModelScope.launch {
            _loadingProducts.value = true
            _productsMessage.value = null
            try {
                _products.value = apiService.getProducts()
            } catch (e: Exception) {
                _productsMessage.value = getErrorMessage(e)
            } finally {
                _loadingProducts.value = false
            }
        }
    }

    fun addToCart(productId: Long, quantity: Int = 1) {
        viewModelScope.launch {
            _productsMessage.value = null
            try {
                apiService.addToCart(productId, quantity)
                _productsMessage.value = "Item added to cart."
                loadCart()
            } catch (e: Exception) {
                _productsMessage.value = getErrorMessage(e)
            }
        }
    }

    fun loadCart() {
        viewModelScope.launch {
            _loadingCart.value = true
            _cartMessage.value = null
            try {
                _cartItems.value = apiService.getCart()
            } catch (e: Exception) {
                _cartMessage.value = getErrorMessage(e)
            } finally {
                _loadingCart.value = false
            }
        }
    }

    fun removeFromCart(cartItemId: Long) {
        viewModelScope.launch {
            _cartMessage.value = null
            try {
                apiService.removeFromCart(cartItemId)
                _cartItems.value = _cartItems.value.filterNot { it.id == cartItemId }
            } catch (e: Exception) {
                _cartMessage.value = getErrorMessage(e)
            }
        }
    }

    fun clearCart() {
        viewModelScope.launch {
            _cartMessage.value = null
            try {
                apiService.clearCart()
                _cartItems.value = emptyList()
            } catch (e: Exception) {
                _cartMessage.value = getErrorMessage(e)
            }
        }
    }

    private fun getErrorMessage(e: Exception): String {
        return if (e is retrofit2.HttpException) {
            try {
                val errorBody = e.response()?.errorBody()?.string()
                if (!errorBody.isNullOrEmpty()) {
                    if (errorBody.contains("\"message\"")) {
                        // Simple parse of message
                        val regex = "\"message\"\\s*:\\s*\"([^\"]+)\"".toRegex()
                        regex.find(errorBody)?.groupValues?.get(1) ?: errorBody
                    } else {
                        errorBody
                    }
                } else {
                    e.message()
                }
            } catch (ex: Exception) {
                e.message ?: "Network error"
            }
        } else {
            e.message ?: "Network error"
        }
    }
}
