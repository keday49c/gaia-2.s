import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function Campaigns() {
  const { isAuthenticated } = useAuth();
  const { data: campaigns, isLoading } = trpc.campaigns.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <div>Acesso não autorizado</div>;
  }

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
            <h1 className="text-3xl font-bold">Campanhas</h1>
            <p className="text-slate-600">Gerencie suas campanhas de marketing</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>
        </div>

        {isLoading ? (
          <div>Carregando...</div>
        ) : campaigns && campaigns.length > 0 ? (
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{campaign.name}</CardTitle>
                      <CardDescription>{campaign.platform}</CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      campaign.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-800"
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{campaign.description}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Deletar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600 mb-4">Nenhuma campanha criada ainda</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Campanha
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
