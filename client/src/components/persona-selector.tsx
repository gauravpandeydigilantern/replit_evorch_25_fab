import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Persona } from "@shared/schema";
import { LineChart, Briefcase, BarChart3 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const PERSONAS: Array<{
  type: Persona;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    type: "SALES",
    title: "Sales",
    description: "Focus on lead scoring and conversion optimization",
    icon: LineChart,
  },
  {
    type: "MARKETING",
    title: "Marketing",
    description: "Track campaign performance and audience engagement",
    icon: BarChart3,
  },
  {
    type: "OPERATIONS",
    title: "Operations",
    description: "Monitor efficiency and process optimization",
    icon: Briefcase,
  },
];

export default function PersonaSelector() {
  const { toast } = useToast();

  const personaMutation = useMutation({
    mutationFn: async (persona: Persona) => {
      const res = await apiRequest("PUT", "/api/user/persona", { persona });
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Persona Selected",
        description: "Your dashboard has been customized for your role",
      });
    },
  });

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Select Your Role</h1>
        <p className="text-muted-foreground text-lg">
          Choose your primary role to customize your experience
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PERSONAS.map((persona) => (
          <Card 
            key={persona.type}
            className="relative overflow-hidden hover:border-primary transition-colors cursor-pointer"
            onClick={() => personaMutation.mutate(persona.type)}
          >
            <CardHeader>
              <persona.icon className="h-12 w-12 text-primary mb-4" />
              <CardTitle>{persona.title}</CardTitle>
              <CardDescription>{persona.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Select {persona.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
