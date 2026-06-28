import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../utils/helpers';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const toast = useToast();

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created!', 'Welcome to TaskFlow');
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error('Registration failed', msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">✓</div>
            <h1>Create your account</h1>
            <p>Start organizing your tasks with TaskFlow</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} id="register-form">
            {errors.general && (
              <div className="form-error" style={{ padding: '10px', background: 'var(--danger-bg)', borderRadius: 'var(--radius-sm)', justifyContent: 'center' }}>
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="register-name">Full Name</label>
              <input
                type="text"
                id="register-name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="John Doe"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors({}); }}
                autoComplete="name"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">Email</label>
              <input
                type="email"
                id="register-email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                autoComplete="email"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-password">Password</label>
              <input
                type="password"
                id="register-password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                autoComplete="new-password"
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-confirm">Confirm Password</label>
              <input
                type="password"
                id="register-confirm"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
              id="register-submit"
            >
              {loading ? <span className="spinner sm" /> : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
