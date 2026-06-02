import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { BookOpen, Users, Dices, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl text-foreground mb-4">
            Bem-vindo ao <span className="text-primary">Level1.io</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Seu ponto de partida para o mundo dos TTRPGs
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/cadastro">
              <Button size="lg" className="bg-primary hover:bg-accent">
                Começar Agora
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/grupos">
              <Button size="lg" variant="outline">
                Encontre um grupo acolhedor
                <Users className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-foreground text-center mb-12">
            O que oferecemos
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <BookOpen className="w-10 h-10 text-primary mb-2" />
                <CardTitle className="text-foreground">Fichas de Personagem</CardTitle>
                <CardDescription>
                  Armazene e gerencie suas fichas de personagem com facilidade
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-2" />
                <CardTitle className="text-foreground">Encontre Grupos</CardTitle>
                <CardDescription>
                  Conecte-se com outros jogadores e encontre seu grupo ideal
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Dices className="w-10 h-10 text-primary mb-2" />
                <CardTitle className="text-foreground">Ferramentas para Mestres</CardTitle>
                <CardDescription>
                  PDFs, geradores e recursos para facilitar suas campanhas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Lightbulb className="w-10 h-10 text-primary mb-2" />
                <CardTitle className="text-foreground">Dicas para Iniciantes</CardTitle>
                <CardDescription>
                  Aprenda o básico e mergulhe no hobby com confiança
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl text-foreground">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-xl text-muted-foreground">
            Junte-se a uma comunidade acolhedora de jogadores de TTRPG
          </p>
          <Link to="/cadastro">
            <Button size="lg" className="bg-primary hover:bg-accent">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
