package com.attendease.config;

import com.attendease.security.JwtAuthenticationFilter;
<<<<<<< HEAD
import com.attendease.security.OAuth2LoginSuccessHandler;
=======
>>>>>>> 22472d3ea753ec6ffce45255a8580bf00526b655
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
<<<<<<< HEAD
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
=======
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
>>>>>>> 22472d3ea753ec6ffce45255a8580bf00526b655
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
<<<<<<< HEAD
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .and()
                .authorizeRequests()
                .antMatchers("/auth/**", "/oauth2/**", "/login/oauth2/**", "/api/v1/auth/**", "/api/v1/oauth2/**", "/api/v1/login/oauth2/**").permitAll()
=======
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/auth/**").permitAll()
>>>>>>> 22472d3ea753ec6ffce45255a8580bf00526b655
                .antMatchers("/public/**").permitAll()
                .antMatchers("/api/v1/products/**").permitAll()
                .antMatchers("/api/v1/cart/**").authenticated()
                .anyRequest().authenticated()
                .and()
<<<<<<< HEAD
                .oauth2Login()
                    .successHandler(oAuth2LoginSuccessHandler)
                .and()
=======
>>>>>>> 22472d3ea753ec6ffce45255a8580bf00526b655
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
