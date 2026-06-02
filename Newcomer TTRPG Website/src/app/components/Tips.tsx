import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, User, Gamepad2 } from "lucide-react";

const tips = [
  {
    icon: Users,
    category: "Antes de Começar",
    title: "Sessão 0: Defina Prioridades e Limites",
    content: "A Sessão 0 é uma reunião antes do jogo começar onde o grupo discute expectativas, limites e preferências. É o momento de alinhar o tom da campanha, estabelecer regras de convivência e garantir que todos estejam confortáveis.",
    example: "Exemplo: O grupo pode decidir que não quer horror gráfico na campanha, definir que sessões serão às quintas-feiras às 20h, e acordar que todos devem avisar com antecedência se não puderem comparecer.",
    points: [
      "Discuta temas sensíveis e linhas vermelhas (tópicos proibidos)",
      "Defina o tom da campanha (comédia, drama, ação, horror)",
      "Estabeleça horários e frequência das sessões",
      "Alinhe expectativas sobre regras e estilo de jogo",
    ],
  },
  {
    icon: User,
    category: "Interpretação",
    title: "Como Interpretar Seu Personagem",
    content: "Interpretar não significa ser ator profissional. Comece com conceitos simples: como seu personagem fala, o que valoriza e como reage a situações. A interpretação cresce naturalmente com o tempo.",
    example: "Exemplo: Se seu personagem é um guerreiro desconfiado, você pode descrever: 'Mantenho a mão na espada enquanto examino o estranho de cima a baixo antes de responder.' Não precisa mudar sua voz ou fazer teatro elaborado.",
    points: [
      "Pense em 2-3 traços de personalidade principais",
      "Considere motivações: o que move seu personagem?",
      "Não tenha medo de descrever ações em terceira pessoa",
      "Deixe a interpretação evoluir naturalmente durante o jogo",
    ],
  },
  {
    icon: Gamepad2,
    category: "Sistemas",
    title: "Escolhendo o Sistema Certo",
    content: "Diferentes sistemas de RPG servem para diferentes estilos de jogo. Alguns focam em combate tático, outros em narrativa livre. Escolha baseado no tipo de história que quer contar e na complexidade que seu grupo prefere.",
    example: "Exemplo: D&D 5e é ótimo para fantasia medieval com combate detalhado. Fate Core funciona melhor para histórias cinematográticas e narrativas. Call of Cthulhu é perfeito para terror e investigação. Shadowrun mistura fantasia e cyberpunk.",
    points: [
      "D&D 5e: Fantasia medieval, regras moderadas, muito material disponível",
      "Fate/Fate Accelerated: Narrativo, flexível, regras leves",
      "Call of Cthulhu: Terror investigativo, mecânicas de sanidade",
      "Pathfinder 2e: Fantasia tática, regras complexas e customização profunda",
    ],
  },
];

export function Tips() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl text-foreground mb-4">Dicas para Iniciantes</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Conselhos práticos para começar sua jornada no mundo dos TTRPGs
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {tips.map((tip, index) => (
          <Card
            key={index}
            className="bg-card border-border hover:border-primary transition-colors"
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <tip.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary border-primary/20">
                    {tip.category}
                  </Badge>
                  <CardTitle className="text-2xl text-foreground">{tip.title}</CardTitle>
                  <CardDescription className="mt-2 text-base">
                    {tip.content}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Example */}
                <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
                  <p className="text-sm font-medium text-primary mb-2">💡 Exemplo Prático</p>
                  <p className="text-muted-foreground text-sm">{tip.example}</p>
                </div>

                {/* Points */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Pontos importantes:</p>
                  <ul className="space-y-2">
                    {tip.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
