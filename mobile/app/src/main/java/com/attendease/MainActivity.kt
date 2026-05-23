package com.attendease

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.attendease.api.UserDto
import com.attendease.ui.screens.HomeScreen
import com.attendease.ui.screens.LoginScreen
import com.attendease.ui.screens.RegisterScreen
import com.attendease.ui.theme.AttendEaseTheme
import com.attendease.viewmodel.AuthState
import com.attendease.viewmodel.AuthViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AttendEaseTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AttendEaseApp()
                }
            }
        }
    }
}

@Composable
fun AttendEaseApp(viewModel: AuthViewModel = viewModel()) {
    val navController = rememberNavController()
    val authState by viewModel.authState.collectAsState()
    val isLoggedIn by viewModel.isLoggedIn.collectAsState()

    // Store user data when login succeeds
    var currentUser by remember { mutableStateOf<UserDto?>(null) }

    // Handle auth state changes
    LaunchedEffect(authState) {
        when (authState) {
            is AuthState.Success -> {
                currentUser = (authState as AuthState.Success).user
                navController.navigate("home") {
                    popUpTo("login") { inclusive = true }
                }
                viewModel.resetState()
            }
            else -> {}
        }
    }

    NavHost(navController = navController, startDestination = "login") {
        composable("login") {
            LoginScreen(
                onLoginSuccess = {
                    // Navigation handled by LaunchedEffect
                },
                onNavigateToRegister = {
                    navController.navigate("register")
                }
            )
        }

        composable("register") {
            RegisterScreen(
                onRegisterSuccess = {
                    navController.navigate("login") {
                        popUpTo("register") { inclusive = true }
                    }
                    viewModel.resetState()
                },
                onNavigateToLogin = {
                    navController.navigate("login") {
                        popUpTo("register") { inclusive = true }
                    }
                }
            )
        }

        composable("home") {
            currentUser?.let { user ->
                HomeScreen(
                    user = user,
                    onLogout = {
                        currentUser = null
                        navController.navigate("login") {
                            popUpTo("home") { inclusive = true }
                        }
                    }
                )
            }
        }
    }
}
