package com.nvt.eurosupply.shared.config;

import com.nvt.eurosupply.security.auth.CustomAccessDeniedHandler;
import com.nvt.eurosupply.security.auth.JwtRequestFilter;
import com.nvt.eurosupply.security.auth.PasswordChangeFilter;
import com.nvt.eurosupply.security.auth.RestAuthenticationEntryPoint;
import com.nvt.eurosupply.security.utils.JwtTokenUtil;
import com.nvt.eurosupply.user.services.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;
    private final PasswordChangeFilter passwordChangeFilter;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return customUserDetailsService;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtTokenUtil jwtTokenUtil) throws Exception {
        http.cors(Customizer.withDefaults());
        http.csrf(AbstractHttpConfigurer::disable);
        http.exceptionHandling(e -> e
                .accessDeniedHandler(customAccessDeniedHandler)
                .authenticationEntryPoint(restAuthenticationEntryPoint)
        );
        http.authorizeHttpRequests(request -> request
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/api/v1/ws/**").permitAll()
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/v3/api-docs.yaml"
                        ).permitAll()
                        .requestMatchers("/api/v1/auth/login").permitAll()
                        .requestMatchers("/api/v1/auth/authorize-file").permitAll()
                        .requestMatchers("/api/v1/users/registration").permitAll()
                        .requestMatchers("/api/v1/users/password").permitAll()

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new JwtRequestFilter(jwtTokenUtil, userDetailsService()), UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(passwordChangeFilter, JwtRequestFilter.class);
        http.authenticationProvider(authenticationProvider());
        return http.build();
    }

}
