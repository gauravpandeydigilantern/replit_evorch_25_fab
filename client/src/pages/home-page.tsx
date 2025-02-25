import { useAuth } from "@/hooks/use-auth";
import PersonaSelector from "@/components/persona-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MetricCard from "@/components/dashboard/metric-card";
import AgentCard from "@/components/dashboard/agent-card";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowRight } from "lucide-react";
import { Link } from "wouter";

// Pipeline configuration for different personas
const PERSONA_PIPELINES = {
  SALES: [
    {
      id: "lead-scoring",
      title: "Lead Scoring",
      description: "AI-powered lead qualification and prioritization",
      metrics: { value: "82%", label: "Accuracy" }
    },
    {
      id: "prospect-nurturing",
      title: "Prospect Nurturing",
      description: "Automated prospect engagement and tracking",
      metrics: { value: "64%", label: "Engagement" }
    },
    {
      id: "conversion-optimization",
      title: "Conversion Optimization",
      description: "Smart conversion funnel optimization",
      metrics: { value: "28%", label: "Conversion" }
    }
  ],
  MARKETING: [
    // Marketing pipelines...
  ],
  OPERATIONS: [
    // Operations pipelines...
  ]
} as const;

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  if (!user?.persona) {
    return <PersonaSelector />;
  }

  const pipelines = PERSONA_PIPELINES[user.persona as keyof typeof PERSONA_PIPELINES] || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{user.persona} Dashboard</h1>
          <Button variant="ghost" size="sm" onClick={() => logoutMutation.mutate()}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto py-8 px-4">
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Available Pipelines</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pipelines.map((pipeline) => (
              <Link key={pipeline.id} href={`/pipeline/${pipeline.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle>{pipeline.title}</CardTitle>
                    <CardDescription>{pipeline.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold">{pipeline.metrics.value}</div>
                      <p className="text-sm text-muted-foreground">{pipeline.metrics.label}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {user.persona === 'SALES' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard 
              title="Lead Score"
              value="82"
              description="Average lead quality score"
            />
            <MetricCard 
              title="Conversion Rate"
              value="23%"
              description="Current conversion rate"
            />
            <MetricCard 
              title="Active Leads"
              value="1,284"
              description="Total active leads"
            />
            <MetricCard 
              title="Revenue"
              value="$124.5k"
              description="Monthly recurring revenue"
            />
          </div>
        )}


        <h2 className="text-xl font-semibold mb-6">AI Agents Overview</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AgentCard type="context" />
          <AgentCard type="awareness" />
          <AgentCard type="autonomy" />
          <AgentCard type="collaboration" />
          <AgentCard type="multimodal" />
          <AgentCard type="reasoning" />
        </div>
      </main>
    </div>
  );
}