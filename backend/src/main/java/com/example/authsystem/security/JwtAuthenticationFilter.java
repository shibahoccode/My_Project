package com.example.authsystem.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        try {
            // 1. Lấy token từ header Authorization
            String token = getTokenFromRequest(request);
            
            log.debug("🔍 Processing request: {} {}", request.getMethod(), request.getRequestURI());
            log.debug("📋 Authorization header: {}", request.getHeader("Authorization"));
            
            // 2. Nếu có token và token hợp lệ
            if (token != null && jwtUtil.validateToken(token)) {
                // 3. Lấy username từ token
                String username = jwtUtil.getUsernameFromToken(token);
                log.info("✅ Valid token for user: {}", username);
                
                // 4. Tạo Authentication object
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        username, 
                        null, 
                        new ArrayList<>() // Không cần roles cho app này
                    );
                
                authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                // 5. Set authentication vào SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("🔐 Authentication set in SecurityContext for user: {}", username);
                
            } else if (token != null) {
                log.warn("⚠️ Invalid token received");
            } else {
                log.debug("ℹ️ No token found in request");
            }
            
        } catch (Exception e) {
            log.error("❌ Error in JWT authentication filter", e);
            // Không throw exception, để request tiếp tục
        }
        
        // 6. Tiếp tục filter chain
        filterChain.doFilter(request, response);
    }
    
    /**
     * Lấy JWT token từ header Authorization
     * Format: "Bearer <token>"
     */
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            log.debug("📝 Token extracted (length: {})", token.length());
            return token;
        }
        
        return null;
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Không filter các endpoint public (login, register)
        String path = request.getRequestURI();
        boolean shouldSkip = path.startsWith("/api/auth/");
        
        if (shouldSkip) {
            log.debug("⏭️ Skipping JWT filter for public endpoint: {}", path);
        }
        
        return shouldSkip;
    }
}