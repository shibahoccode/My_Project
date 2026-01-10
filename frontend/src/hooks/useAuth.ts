// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

// ✅ FIX: Token phải là required, không phải optional
interface User {
  username: string;
  token: string; // ❌ CŨ: token?: string | ✅ MỚI: token: string
  email?: string;
  fullName?: string;
}

// URL Backend
const API_BASE_URL = 'http://localhost:8080/api/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('=== useAuth INITIALIZATION ===');
    console.log('🔍 Checking localStorage...');
    
    // Kiểm tra localStorage khi load trang
    const token = localStorage.getItem('jwt_token');
    const savedUsername = localStorage.getItem('user_username');
    const savedEmail = localStorage.getItem('user_email');
    const savedFullName = localStorage.getItem('user_fullname');

    console.log('📦 localStorage data:');
    console.log('  - jwt_token:', token ? `${token.substring(0, 50)}... (length: ${token.length})` : '❌ NULL');
    console.log('  - user_username:', savedUsername || '❌ NULL');
    console.log('  - user_email:', savedEmail || '(empty)');
    console.log('  - user_fullname:', savedFullName || '(empty)');
    
    if (token && savedUsername) {
      const userObj: User = { 
        username: savedUsername, 
        token, // ✅ Token luôn có ở đây
        email: savedEmail || undefined,
        fullName: savedFullName || undefined
      };
      console.log('✅ User object created successfully');
      console.log('   - username:', userObj.username);
      console.log('   - has token:', !!userObj.token);
      console.log('   - token length:', userObj.token.length);
      setUser(userObj);
    } else {
      console.log('❌ Cannot restore user session');
      if (!token) console.log('   - Reason: No jwt_token in localStorage');
      if (!savedUsername) console.log('   - Reason: No user_username in localStorage');
    }
    
    console.log('⏱️ Setting loading to false');
    setLoading(false);
    console.log('=== useAuth INITIALIZATION COMPLETE ===');
  }, []);

  // Hàm gọi API
  const authRequest = async (endpoint: string, payload: any) => {
    console.log(`=== API REQUEST: ${endpoint} ===`);
    console.log('Payload:', payload);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        return { success: true, data };
      } else {
        return { success: false, message: data.message || 'Có lỗi xảy ra' };
      }
    } catch (error) {
      console.error('❌ API Request failed:', error);
      return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra backend.' };
    }
  };

  // ✅ Login function
  const login = async (username: string, password: string) => {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Username:', username);
    
    const result = await authRequest('/login', { username, password });
    
    if (result.success) {
      console.log('✅ Login successful');
      
      // ✅ Lưu vào localStorage
      localStorage.setItem('jwt_token', result.data.token);
      localStorage.setItem('user_username', result.data.username);
      
      if (result.data.email) {
        localStorage.setItem('user_email', result.data.email);
      }
      if (result.data.fullName) {
        localStorage.setItem('user_fullname', result.data.fullName);
      }
      
      // ✅ Set user state với token
      const userObj: User = { 
        username: result.data.username, 
        token: result.data.token, // ✅ Token required
        email: result.data.email,
        fullName: result.data.fullName
      };
      
      console.log('✅ User object created:', { username: userObj.username, hasToken: !!userObj.token });
      setUser(userObj);
      
      return { error: null };
    }
    
    console.log('❌ Login failed:', result.message);
    return { error: { message: result.message } };
  };

  // ✅ Register function
  const register = async (username: string, email: string, password: string, fullName: string) => {
    console.log('=== REGISTER ATTEMPT ===');
    console.log('Username:', username, 'Email:', email);
    
    const result = await authRequest('/register', { username, email, password, fullName });
    
    if (result.success) {
      console.log('✅ Registration successful');
      return { error: null };
    }
    
    console.log('❌ Registration failed:', result.message);
    return { error: { message: result.message } };
  };

  // ✅ Logout function
  const logout = async () => {
    console.log('=== LOGOUT ===');
    
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_username');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_fullname');
    
    setUser(null);
    console.log('✅ Logged out successfully');
    
    return { error: null };
  };

  return {
    user, // ✅ User sẽ luôn có token khi không null
    loading,
    signIn: login,
    signUp: register,
    signOut: logout,
    logout, // Alias để dễ sử dụng
  };
};