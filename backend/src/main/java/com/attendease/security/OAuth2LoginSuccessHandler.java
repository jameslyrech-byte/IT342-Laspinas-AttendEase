package com.attendease.security;

import com.attendease.dto.UserDto;
import com.attendease.service.AuthService;
import com.attendease.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @org.springframework.beans.factory.annotation.Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        if (!(authentication instanceof OAuth2AuthenticationToken)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid authentication type");
            return;
        }

        OAuth2AuthenticationToken oauth2Token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauth2User = oauth2Token.getPrincipal();

        String email = oauth2User.getAttribute("email");
        String firstname = oauth2User.getAttribute("given_name");
        String lastname = oauth2User.getAttribute("family_name");
        if (firstname == null) {
            firstname = oauth2User.getAttribute("name");
        }
        if (lastname == null) {
            lastname = "";
        }

        UserDto userDto = authService.processOAuth2User(email, firstname, lastname);
        String accessToken = jwtUtil.generateToken(userDto.getEmail(), userDto.getId());

        String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth-success")
                .queryParam("token", accessToken)
                .queryParam("id", userDto.getId())
                .queryParam("email", userDto.getEmail())
                .queryParam("firstname", userDto.getFirstname())
                .queryParam("lastname", userDto.getLastname())
                .queryParam("role", userDto.getRole())
                .build(true)
                .toUriString();

        response.sendRedirect(redirectUrl);
    }
}
