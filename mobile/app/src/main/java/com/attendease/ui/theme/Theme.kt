package com.attendease.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF667eea),
    secondary = Color(0xFF764ba2),
    tertiary = Color(0xFF26c6da)
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF667eea),
    secondary = Color(0xFF764ba2),
    tertiary = Color(0xFF26c6da)
)

@Composable
fun AttendEaseTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
