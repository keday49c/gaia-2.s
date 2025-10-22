import React, { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Painel Administrativo de Desenvolvedor
 * Controle total da plataforma APOGEU
 */
export default function DeveloperPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPassword, setShowPassword] = useState(false);
  const [apiKey, setApiKey] = useState('apogeu_dev_key_xxxxxxxxxxxx');
  const [apiSecret, setApiSecret] = useState('••••••••••••••••');

  // Dados simulados de desenvolvedor
  const developerInfo = {
    username: 'keday49c',
    email: 'developer@apogeu.com',
    role: 'Creator & Developer',
    joinDate: '2024-01-15',
    permissions: ['admin', 'developer', 'campaigns', 'analytics', 'users', 'settings'],
    twoFactorEnabled: false,
    lastLogin: '2024-10-22 14:30:00',
  };

  const systemStats = {
    totalUsers: 1250,
    activeCampaigns: 89,
    totalRevenue: 125430.50,
    systemUptime: '99.98%',
    apiRequests: 45230,
    databaseSize: '2.5 GB',
  };

  const recentLogs = [
    { id: 1, action: 'User Login', user: 'user@example.com', timestamp: '2024-10-22 14:30:00', status: 'success' },
    { id: 2, action: 'Campaign Created', user: 'user@example.com', timestamp: '2024-10-22 14:25:00', status: 'success' },
    { id: 3, action: 'API Call', user: 'api_client', timestamp: '2024-10-22 14:20:00', status: 'success' },
    { id: 4, action: 'Settings Updated', user: 'keday49c', timestamp: '2024-10-22 14:15:00', status: 'success' },
    { id: 5, action: 'Payment Processed', user: 'user@example.com', timestamp: '2024-10-22 14:10:00', status: 'success' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔐 Painel de Desenvolvedor</h1>
          <p className="text-gray-300">Controle total da plataforma APOGEU</p>
        </div>

        {/* Alerta de Acesso Restrito */}
        <Alert className="mb-6 bg-yellow-900 border-yellow-700">
          <AlertDescription className="text-yellow-100">
            ⚠️ Este painel é restrito apenas ao criador e desenvolvedor da plataforma. Acesso não autorizado será registrado.
          </AlertDescription>
        </Alert>

        {/* Informações do Desenvolvedor */}
        <Card className="mb-6 bg-gray-800 border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Informações do Desenvolvedor</h2>
              <div className="space-y-3 text-gray-300">
                <p><span className="font-semibold">Usuário:</span> {developerInfo.username}</p>
                <p><span className="font-semibold">Email:</span> {developerInfo.email}</p>
                <p><span className="font-semibold">Função:</span> {developerInfo.role}</p>
                <p><span className="font-semibold">Membro desde:</span> {developerInfo.joinDate}</p>
                <p><span className="font-semibold">Último acesso:</span> {developerInfo.lastLogin}</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Permissões</h2>
              <div className="flex flex-wrap gap-2">
                {developerInfo.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800 border-gray-700">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="credentials">Credenciais</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Usuários Ativos', value: systemStats.totalUsers, icon: '👥' },
                { label: 'Campanhas Ativas', value: systemStats.activeCampaigns, icon: '📊' },
                { label: 'Receita Total', value: `R$ ${systemStats.totalRevenue.toLocaleString('pt-BR')}`, icon: '💰' },
              ].map((stat, idx) => (
                <Card key={idx} className="bg-gray-800 border-gray-700 p-6">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Uptime do Sistema', value: systemStats.systemUptime, icon: '✅' },
                { label: 'Requisições API', value: systemStats.apiRequests.toLocaleString(), icon: '🔌' },
                { label: 'Tamanho do BD', value: systemStats.databaseSize, icon: '💾' },
              ].map((stat, idx) => (
                <Card key={idx} className="bg-gray-800 border-gray-700 p-6">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Credentials Tab */}
          <TabsContent value="credentials" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Gerenciar Credenciais</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Chave de API</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={apiKey}
                      readOnly
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setShowPassword(!showPassword)}
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      Copiar
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Segredo de API</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="password"
                      value={apiSecret}
                      readOnly
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Button
                      variant="outline"
                      className="border-gray-600 text-white hover:bg-gray-700"
                    >
                      Copiar
                    </Button>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    🔄 Regenerar Chave de API
                  </Button>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    🔄 Regenerar Segredo
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Autenticação de Dois Fatores</h2>
              <p className="text-gray-300 mb-4">
                Status: <span className="text-red-400 font-semibold">Desativado</span>
              </p>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                ✅ Ativar Autenticação de Dois Fatores
              </Button>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Gerenciar Usuários</h2>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar usuário..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700">Buscar</Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-gray-300">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2">Usuário</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Plano</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'João Silva', email: 'joao@example.com', plan: 'Pro', status: 'Ativo' },
                        { name: 'Maria Santos', email: 'maria@example.com', plan: 'Premium', status: 'Ativo' },
                        { name: 'Pedro Costa', email: 'pedro@example.com', plan: 'Básico', status: 'Inativo' },
                      ].map((user, idx) => (
                        <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700">
                          <td className="p-2">{user.name}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">{user.plan}</td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded ${user.status === 'Ativo' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="p-2">
                            <Button variant="ghost" className="text-blue-400 hover:text-blue-300">
                              Editar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Logs de Auditoria</h2>
              
              <div className="space-y-2">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div>
                      <p className="text-white font-semibold">{log.action}</p>
                      <p className="text-gray-400 text-sm">{log.user} • {log.timestamp}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-sm">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Configurações de Segurança</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Alterar Senha</Label>
                  <div className="space-y-2 mt-2">
                    <Input
                      type="password"
                      placeholder="Senha atual"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Input
                      type="password"
                      placeholder="Nova senha"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <Input
                      type="password"
                      placeholder="Confirmar nova senha"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  🔐 Alterar Senha
                </Button>
              </div>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Configurações da Plataforma</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span className="text-white">Modo de Manutenção</span>
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-600">
                    Desativar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span className="text-white">Registros de API</span>
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-600">
                    Ativar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span className="text-white">Backup Automático</span>
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-600">
                    Configurar
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

