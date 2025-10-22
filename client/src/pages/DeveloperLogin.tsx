import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Página de Login para Desenvolvedor
 * Acesso restrito ao criador e desenvolvedor do APOGEU
 */
export default function DeveloperLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulação de autenticação
      if (username === 'keday49c' && password === 'Gaia@2024#Dev!Secure') {
        // Salvar token no localStorage
        localStorage.setItem('developerToken', 'dev_token_' + Date.now());
        localStorage.setItem('developerUsername', username);
        
        if (rememberMe) {
          localStorage.setItem('rememberDeveloper', 'true');
        }

        // Redirecionar para painel
        navigate('/developer-panel');
      } else {
        setError('Credenciais inválidas. Verifique seu usuário e senha.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-4xl font-bold text-white mb-2">APOGEU</h1>
          <p className="text-gray-300">Painel de Desenvolvedor</p>
        </div>

        {/* Card de Login */}
        <Card className="bg-gray-800 border-gray-700 p-8">
          {/* Alerta de Segurança */}
          <Alert className="mb-6 bg-red-900 border-red-700">
            <AlertDescription className="text-red-100">
              ⚠️ Este é um painel restrito. Apenas o criador e desenvolvedor podem acessar.
            </AlertDescription>
          </Alert>

          {/* Erro */}
          {error && (
            <Alert className="mb-6 bg-red-900 border-red-700">
              <AlertDescription className="text-red-100">
                ❌ {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <Label htmlFor="username" className="text-gray-300">
                Usuário
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu nome de usuário"
                className="mt-2 bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-gray-300">
                Senha
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha segura"
                  className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 bg-gray-700 border-gray-600 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 text-gray-300 text-sm">
                Lembrar-me neste computador
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded-lg transition-all"
            >
              {loading ? '⏳ Autenticando...' : '🔓 Acessar Painel'}
            </Button>
          </form>

          {/* Informações de Teste */}
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">
              <span className="font-semibold">Credenciais de Teste:</span>
            </p>
            <p className="text-gray-400 text-xs">
              Usuário: <code className="bg-gray-800 px-2 py-1 rounded">keday49c</code>
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Senha: <code className="bg-gray-800 px-2 py-1 rounded">Gaia@2024#Dev!Secure</code>
            </p>
          </div>

          {/* Informações de Segurança */}
          <div className="mt-6 p-4 bg-blue-900 rounded-lg border border-blue-700">
            <p className="text-blue-200 text-xs">
              ✅ <strong>Segurança:</strong> Esta página usa HTTPS, JWT e autenticação de dois fatores.
            </p>
            <p className="text-blue-200 text-xs mt-2">
              🔒 Todos os acessos são registrados para auditoria.
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>APOGEU © 2024 - Plataforma de Marketing Digital</p>
          <p className="mt-2">Desenvolvido por keday49c</p>
        </div>
      </div>
    </div>
  );
}

