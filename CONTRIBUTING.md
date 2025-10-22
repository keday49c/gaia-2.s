# Guia de Contribuição - APOGEU

Obrigado por considerar contribuir para o APOGEU! Este documento fornece diretrizes e instruções para contribuir com o projeto.

## 📋 Código de Conduta

Todos os contribuidores devem seguir nosso código de conduta:
- Ser respeitoso e inclusivo
- Aceitar críticas construtivas
- Focar no que é melhor para a comunidade
- Mostrar empatia com outros membros

## 🚀 Como Começar

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/flower-bloom-network.git
cd apogeu

# Adicione o repositório original como upstream
git remote add upstream https://github.com/keday49c/flower-bloom-network.git
```

### 2. Crie uma Branch

```bash
# Atualize a branch main
git fetch upstream
git checkout main
git merge upstream/main

# Crie uma branch para sua feature
git checkout -b feature/sua-feature
```

### 3. Desenvolvimento

```bash
# Instale dependências
pnpm install

# Configure variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
pnpm dev
```

### 4. Commit e Push

```bash
# Faça commits com mensagens descritivas
git commit -m "feat: adiciona nova funcionalidade"

# Push para seu fork
git push origin feature/sua-feature
```

### 5. Pull Request

1. Vá para o repositório original no GitHub
2. Clique em "New Pull Request"
3. Selecione sua branch
4. Descreva as mudanças em detalhes
5. Aguarde revisão

## 📝 Padrões de Código

### Commits

Use o padrão Conventional Commits:

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: mudanças de formatação
refactor: refatoração de código
test: adiciona ou atualiza testes
chore: atualiza dependências
```

### Código TypeScript

```typescript
// Use tipos explícitos
const getUserData = (userId: string): Promise<User> => {
  // ...
};

// Use interfaces para objetos
interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
}

// Use enums para valores constantes
enum SubscriptionPlan {
  BASIC = "basic",
  PRO = "pro",
  PREMIUM = "premium",
}
```

### React Components

```typescript
// Use componentes funcionais
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<Type>(initialValue);

  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### Testes

```typescript
describe("Feature", () => {
  it("should do something", () => {
    // Arrange
    const input = "test";

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe("expected");
  });
});
```

## 🧪 Testes

Antes de fazer um PR, certifique-se de que:

```bash
# Todos os testes passam
pnpm test

# TypeScript sem erros
pnpm check

# Código formatado
pnpm format
```

## 📚 Documentação

Ao adicionar novas funcionalidades:

1. Atualize o README.md se necessário
2. Adicione comentários JSDoc em funções públicas
3. Crie documentação em `/docs` para features complexas
4. Atualize o CHANGELOG.md

## 🐛 Reportando Bugs

Ao reportar um bug, inclua:

1. **Descrição clara** do problema
2. **Passos para reproduzir**
3. **Comportamento esperado**
4. **Comportamento atual**
5. **Screenshots** (se aplicável)
6. **Ambiente** (OS, Node version, etc)

## 💡 Sugestões de Features

Para sugerir uma nova feature:

1. Verifique se já não existe uma issue similar
2. Descreva o caso de uso
3. Explique os benefícios
4. Sugira uma implementação (opcional)

## 🔍 Processo de Revisão

1. Um mantenedor revisará seu PR
2. Podem ser solicitadas mudanças
3. Após aprovação, seu PR será mergeado
4. Você será creditado na release notes

## 📦 Dependências

Ao adicionar novas dependências:

1. Use `pnpm add` para instalar
2. Justifique por que a dependência é necessária
3. Verifique se não há alternativas menores
4. Atualize o CHANGELOG.md

## 🎯 Áreas de Contribuição

### Frontend
- Melhorias na UI/UX
- Novos componentes
- Otimizações de performance
- Acessibilidade

### Backend
- Novas rotas/endpoints
- Otimizações de banco de dados
- Melhorias de segurança
- Novos serviços

### Documentação
- Guias de uso
- Exemplos de código
- Tutoriais
- Tradução

### Testes
- Novos testes
- Melhor cobertura
- Testes de integração
- Testes de performance

## 💬 Comunicação

- **GitHub Issues**: Para bugs e features
- **GitHub Discussions**: Para perguntas e ideias
- **Pull Requests**: Para contribuições de código

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a Licença MIT.

## 🙏 Obrigado!

Obrigado por contribuir para tornar o APOGEU melhor! Sua ajuda é inestimável.

---

**Dúvidas?** Abra uma issue ou entre em contato conosco!

