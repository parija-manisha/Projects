import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from '../api/authApi';
import { loginSuccess, loginFailure, clearAuth, setLoading } from '../../../store/slices/authSlice';
import { AUTH_ERROR_MESSAGES } from '../constants/authConstants';
import type { RootState, AppDispatch } from '../../../store/store';
import type { LoginRequest, RegisterRequest } from '../types/authTypes';

interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error } = useSelector((state: RootState) => state.auth);
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = async (credentials: LoginRequest) => {
    try {
      dispatch(setLoading(true));
      const result = await loginMutation(credentials).unwrap();
      dispatch(
        loginSuccess({
          user: result.user,
          token: result.accessToken,
        })
      );
    } catch (err) {
      const errorMessage =
        (err as ApiError)?.data?.message || AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
      dispatch(loginFailure(String(errorMessage)));
      throw new Error(String(errorMessage), { cause: err });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      dispatch(setLoading(true));
      await registerMutation(data).unwrap();
      const result = await loginMutation({
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(
        loginSuccess({
          user: result.user,
          token: result.accessToken,
        })
      );
    } catch (err) {
      const errorMessage =
        (err as ApiError)?.data?.message || AUTH_ERROR_MESSAGES.UNKNOWN_ERROR;
      dispatch(loginFailure(String(errorMessage)));
      throw new Error(String(errorMessage), { cause: err });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      dispatch(setLoading(true));
      await logoutMutation().unwrap();
      dispatch(clearAuth());
    } catch (err) {
      console.error("Logout error:", err);
      // Still clear auth even if API call fails
      dispatch(clearAuth());
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };
};

