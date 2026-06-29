import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../utils/helpers';

const checkPasswordStrength = (pass) => {
  if (!pass) return { score: 0, label: '', color: '' };
  
  let score = 0;
  
  const hasMinLength = pass.length >= 8;
  const hasUpperCase = /[A-Z]/.test(pass);
  const hasLowerCase = /[a-z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(pass);
  
  if (pass.length >= 6) score += 1;
  if (hasMinLength) score += 1;
  if (hasUpperCase && hasLowerCase) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecialChar) score += 1;

  let label = 'Very Weak';
  let color = 'var(--danger)';
  
  if (score === 2) {
    label = 'Weak';
    color = '#f97316';
  } else if (score === 3) {
    label = 'Medium';
    color = 'var(--status-pending)';
  } else if (score === 4) {
    label = 'Strong';
    color = 'var(--status-completed)';
  } else if (score === 5) {
    label = 'Very Strong';
    color = '#059669';
  }
  
  return { score, label, color };
};

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const strength = checkPasswordStrength(password);

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
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="register-password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              
              {/* Real-time password strength checking */}
              {password && (
                <div className="pwd-strength-container" style={{ marginTop: '6px' }}>
                  <div className="pwd-strength-bars" style={{ display: 'flex', gap: '4px', height: '4px' }}>
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div
                        key={index}
                        className="pwd-strength-bar"
                        style={{
                          flex: 1,
                          height: '100%',
                          borderRadius: '2px',
                          backgroundColor: index <= strength.score ? strength.color : 'var(--border-light)',
                          transition: 'background-color 0.2s ease',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', color: strength.color, fontWeight: '600', marginTop: '4px', display: 'block' }}>
                    Password strength: {strength.label}
                  </span>
                </div>
              )}
              
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-confirm">Confirm Password</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="register-confirm"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {/* Real-time password matching status */}
              {confirmPassword && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: password === confirmPassword ? 'var(--status-completed)' : 'var(--danger)',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </span>
              )}

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

// ── SVG Icon Helper Components ─────────────────────────
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export default RegisterForm;
