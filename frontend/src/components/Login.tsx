import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface LoginProps {
  onToggleRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onToggleRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      const { access_token, user } = response.data;
      login(access_token, user);
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.login_failed'));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center p-4">      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="card p-8 lg:p-10 backdrop-blur-sm bg-white/95">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft-lg">
              <span className="text-white text-3xl">⚽</span>
            </div>            <h1 className="text-3xl font-bold text-secondary-800 mb-2">{t('auth.welcome_back')}</h1>
            <p className="text-secondary-600">{t('auth.sign_in_subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>              <label htmlFor="email" className="block text-sm font-semibold text-secondary-700 mb-3">
                {t('auth.email_address')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-primary"
                placeholder={t('auth.email_placeholder')}
                required
              />
            </div>            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-secondary-700 mb-3">
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-primary"
                placeholder={t('auth.password_placeholder')}
                required
              />
            </div>

            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl text-sm animate-slide-up">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 text-lg relative overflow-hidden group"
            >              <span className={`transition-transform duration-200 ${isLoading ? 'translate-y-5 opacity-0' : 'translate-y-0 opacity-100'}`}>
                {t('auth.sign_in')}
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </form>          <div className="mt-8 text-center">
            <p className="text-secondary-600">
              {t('auth.dont_have_account')}{' '}
              <button
                onClick={onToggleRegister}
                className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors"
              >
                {t('auth.create_one_now')}
              </button>
            </p>
          </div>          {/* Desktop only: Additional info */}
          <div className="hidden lg:block mt-8 pt-6 border-t border-secondary-200">
            <div className="text-center text-sm text-secondary-500">
              <p>{t('auth.premium_fields')}</p>
              <p>{t('auth.instant_confirmation')}</p>
              <p>{t('auth.secure_payments')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
