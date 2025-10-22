import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Plus, Mail, Phone } from "lucide-react";

export default function CRM() {
  const { isAuthenticated } = useAuth();
  const { data: leads, isLoading } = trpc.crm.getLeads.useQuery(undefined, {
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
            <h1 className="text-3xl font-bold">CRM - Leads</h1>
            <p className="text-slate-600">Gerencie seus contatos e leads</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>

        {isLoading ? (
          <div>Carregando...</div>
        ) : leads && leads.length > 0 ? (
          <div className="grid gap-4">
            {leads.map((lead) => (
              <Card key={lead.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{lead.name}</CardTitle>
                      <CardDescription>{lead.source}</CardDescription>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {lead.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-slate-600">
                    {lead.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {lead.email}
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {lead.phone}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600 mb-4">Nenhum lead cadastrado</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Lead
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
