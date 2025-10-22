import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Plus, Trash2, CheckCircle } from "lucide-react";

export default function Credentials() {
  const { isAuthenticated } = useAuth();
  const { data: credentials, isLoading } = trpc.credentials.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Voltar
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Credenciais de API</h1>
            <p className="text-slate-600">Gerencie suas chaves de acesso para plataformas de marketing</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Credencial
          </Button>
        </div>

        {isLoading ? (
          <div>Carregando...</div>
        ) : credentials && credentials.length > 0 ? (
          <div className="grid gap-4">
            {credentials.map((cred) => (
              <Card key={cred.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="capitalize">{cred.platform}</CardTitle>
                      <CardDescription>Última validação: {cred.lastValidated ? new Date(cred.lastValidated).toLocaleDateString() : "Nunca"}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {cred.isActive === "true" && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600 mb-4">Nenhuma credencial configurada</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Credencial
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
