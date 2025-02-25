import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Brain, Activity, Link, Zap, Database, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type AgentType = "context" | "awareness" | "autonomy" | "collaboration" | "multimodal" | "reasoning";

const AGENT_CONFIG: Record<AgentType, {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  metrics: Array<{ label: string; value: string }>;
  promptPlaceholder: string;
  capabilities: string[];
}> = {
  context: {
    title: "Context-Based Decisions",
    description: "Analyzes historical data for informed decision making",
    icon: Brain,
    metrics: [
      { label: "Accuracy", value: "94%" },
      { label: "Decisions/hr", value: "126" },
    ],
    promptPlaceholder: "Ask about historical lead score adjustments...",
    capabilities: [
      "Historical data analysis",
      "Pattern recognition",
      "Trend identification",
      "Score adjustment recommendations"
    ]
  },
  awareness: {
    title: "Situational Awareness",
    description: "Monitors real-time events and changes",
    icon: Activity,
    metrics: [
      { label: "Response Time", value: "1.2s" },
      { label: "Alert Accuracy", value: "98%" },
    ],
    promptPlaceholder: "Query real-time lead behavior...",
    capabilities: [
      "Real-time monitoring",
      "Event detection",
      "Behavioral analysis",
      "Immediate response triggers"
    ]
  },
  autonomy: {
    title: "Autonomy Agent",
    description: "Manages automated decision processes",
    icon: Zap,
    metrics: [
      { label: "Auto-resolved", value: "76%" },
      { label: "Success Rate", value: "92%" },
    ],
    promptPlaceholder: "Set autonomy levels and decision thresholds...",
    capabilities: [
      "Automated decision making",
      "Rule-based actions",
      "Performance optimization",
      "Self-adjustment protocols"
    ]
  },
  collaboration: {
    title: "Multiagent Collaboration",
    description: "Coordinates between different AI agents",
    icon: Link,
    metrics: [
      { label: "Sync Rate", value: "99.9%" },
      { label: "Latency", value: "45ms" },
    ],
    promptPlaceholder: "Configure agent collaboration rules...",
    capabilities: [
      "Inter-agent communication",
      "Task coordination",
      "Resource sharing",
      "Conflict resolution"
    ]
  },
  multimodal: {
    title: "Multimodal Capabilities",
    description: "Processes various types of input data",
    icon: Database,
    metrics: [
      { label: "Data Types", value: "8" },
      { label: "Throughput", value: "2.4GB/s" },
    ],
    promptPlaceholder: "Configure data source processing...",
    capabilities: [
      "Multi-source integration",
      "Format conversion",
      "Cross-modal analysis",
      "Unified data processing"
    ]
  },
  reasoning: {
    title: "Reasoning Abilities",
    description: "Performs complex logical analysis",
    icon: Calculator,
    metrics: [
      { label: "Precision", value: "96%" },
      { label: "Depth", value: "Level 4" },
    ],
    promptPlaceholder: "Query decision logic and reasoning...",
    capabilities: [
      "Logical inference",
      "Decision trees",
      "Causal analysis",
      "Uncertainty handling"
    ]
  },
};

export default function AgentCard({ type }: { type: AgentType }) {
  const config = AGENT_CONFIG[type];
  const [isExpanded, setIsExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");

  return (
    <TooltipProvider>
      <Card className={`transition-all duration-300 ${isExpanded ? 'col-span-2 row-span-2' : ''}`}>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <config.icon className="h-5 w-5 text-primary" />
            <Badge variant="outline" className="ml-2">Active</Badge>
          </div>
          <CardTitle className="text-lg">{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {config.metrics.map((metric) => (
                <div key={metric.label}>
                  <div className="text-sm font-medium">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </Button>

            {isExpanded && (
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Capabilities</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {config.capabilities.map((capability, index) => (
                      <li key={index} className="text-muted-foreground">{capability}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Agent Interaction</h4>
                  <Textarea
                    placeholder={config.promptPlaceholder}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button className="w-full">
                    Submit Query
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}