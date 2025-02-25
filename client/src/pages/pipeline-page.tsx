import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip,
  BarChart, Bar, Cell, LineChart, Line, FunnelChart, Funnel, LabelList,
} from "recharts";
import { ArrowLeft, BarChart3, Brain, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import AgentCard from "@/components/dashboard/agent-card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Mock data for visualizations
const conversionData = Array.from({ length: 12 }, (_, i) => ({
  month: `${i + 1}`,
  value: 25 + Math.random() * 20,
}));

const leadScoreData = [
  { score: "90-100", count: 24, probability: "95%" },
  { score: "80-89", count: 45, probability: "82%" },
  { score: "70-79", count: 67, probability: "73%" },
  { score: "60-69", count: 52, probability: "58%" },
  { score: "50-59", count: 31, probability: "42%" },
  { score: "<50", count: 18, probability: "25%" },
];

const topLeads = [
  { name: "Acme Corp", score: 98, value: "$125K", probability: "95%", lastActivity: "1h ago" },
  { name: "TechStart Inc", score: 92, value: "$85K", probability: "88%", lastActivity: "3h ago" },
  { name: "Global Solutions", score: 89, value: "$250K", probability: "82%", lastActivity: "2h ago" },
  { name: "InnovateCo", score: 87, value: "$175K", probability: "79%", lastActivity: "30m ago" },
];

const activityData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  email: Math.floor(Math.random() * 100),
  web: Math.floor(Math.random() * 100),
  call: Math.floor(Math.random() * 100),
}));

const funnelData = [
  { value: 1000, name: "Leads", fill: "#4CAF50" },
  { value: 750, name: "Qualified", fill: "#2196F3" },
  { value: 500, name: "Proposal", fill: "#9C27B0" },
  { value: 250, name: "Negotiation", fill: "#FF9800" },
  { value: 100, name: "Closed", fill: "#F44336" },
];

const attributionData = [
  { source: "Website", value: 35 },
  { source: "Email", value: 25 },
  { source: "Social", value: 20 },
  { source: "Direct", value: 15 },
  { source: "Other", value: 5 },
];

type PipelineMetric = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

const PIPELINE_METRICS: Record<string, PipelineMetric[]> = {
  SALES: [
    { title: "Conversion Rate", value: "24.8%", change: "+2.4%", trend: "up" },
    { title: "Avg. Lead Score", value: "78", change: "+5", trend: "up" },
    { title: "Time to Convert", value: "12 days", change: "-2 days", trend: "up" },
    { title: "Active Opportunities", value: "342", change: "+28", trend: "up" },
  ],
  MARKETING: [
    { title: "Campaign ROI", value: "312%", change: "+15%", trend: "up" },
    { title: "Click-through Rate", value: "4.2%", change: "+0.5%", trend: "up" },
    { title: "Cost per Lead", value: "$24.50", change: "-$2.30", trend: "up" },
    { title: "Lead Quality Score", value: "82", change: "+4", trend: "up" },
  ],
  OPERATIONS: [
    { title: "Process Efficiency", value: "94%", change: "+3%", trend: "up" },
    { title: "Resource Utilization", value: "87%", change: "+5%", trend: "up" },
    { title: "Cycle Time", value: "3.2 days", change: "-0.5 days", trend: "up" },
    { title: "Error Rate", value: "0.8%", change: "-0.3%", trend: "up" },
  ],
};

interface ActionRecommendation {
  title: string;
  description: string;
  type: "insight" | "action" | "alert";
}

interface ExploreResponse {
  content: string;
  format: "text" | "markdown" | "chart";
  recommendations: ActionRecommendation[];
  timestamp: string;
}

export default function PipelinePage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState<ExploreResponse[]>([]);

  if (!user?.persona) return null;

  const metrics = PIPELINE_METRICS[user.persona];

  const handleExploreSubmit = () => {
    // Simulate AI response for now
    const newResponse: ExploreResponse = {
      content: "Based on the analysis of your lead scoring patterns, here are the key insights:\n\n" +
        "1. High-value leads show increased engagement after personalized email campaigns\n" +
        "2. The optimal time for follow-up communications is between 2-4 PM EST\n" +
        "3. Companies in the technology sector have a 35% higher conversion rate",
      format: "markdown",
      recommendations: [
        {
          title: "Optimize Email Timing",
          description: "Schedule follow-up emails for the 2-4 PM EST window",
          type: "action"
        },
        {
          title: "High-Value Lead Alert",
          description: "3 leads from tech sector showing strong engagement signals",
          type: "alert"
        },
        {
          title: "Conversion Pattern",
          description: "Tech sector leads convert 35% more frequently",
          type: "insight"
        }
      ],
      timestamp: new Date().toISOString()
    };

    setResponses(prev => [...prev, newResponse]);
    setPrompt("");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container max-w-7xl mx-auto py-4 px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{user.persona} Pipeline</h1>
              <p className="text-sm text-muted-foreground">
                Detailed analytics and agent performance
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto py-8 px-4">
        <Tabs defaultValue="analytics" className="space-y-8">
          <TabsList>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="agents">
              <Brain className="h-4 w-4 mr-2" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="explore">
              <Search className="h-4 w-4 mr-2" />
              Explore
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-8">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric) => (
                <Card key={metric.title}>
                  <CardHeader className="space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {metric.change} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Conversion Trend and Lead Score Distribution */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={conversionData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor="hsl(var(--primary))"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(var(--primary))"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          fillOpacity={1}
                          fill="url(#colorValue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lead Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leadScoreData}>
                        <XAxis dataKey="score" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count">
                          {leadScoreData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`hsl(var(--primary) / ${0.4 + index * 0.1})`}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Leads Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top Scoring Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase">
                      <tr>
                        <th className="px-6 py-3">Company</th>
                        <th className="px-6 py-3">Score</th>
                        <th className="px-6 py-3">Deal Value</th>
                        <th className="px-6 py-3">Probability</th>
                        <th className="px-6 py-3">Last Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topLeads.map((lead) => (
                        <tr key={lead.name} className="border-t">
                          <td className="px-6 py-4 font-medium">{lead.name}</td>
                          <td className="px-6 py-4">{lead.score}</td>
                          <td className="px-6 py-4">{lead.value}</td>
                          <td className="px-6 py-4">{lead.probability}</td>
                          <td className="px-6 py-4">{lead.lastActivity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Activity Heatmap and Sales Funnel */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Activity Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData}>
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="email"
                          stackId="1"
                          stroke="#8884d8"
                          fill="#8884d8"
                        />
                        <Area
                          type="monotone"
                          dataKey="web"
                          stackId="1"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                        />
                        <Area
                          type="monotone"
                          dataKey="call"
                          stackId="1"
                          stroke="#ffc658"
                          fill="#ffc658"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales Funnel Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <FunnelChart>
                        <Tooltip />
                        <Funnel
                          dataKey="value"
                          data={funnelData}
                          isAnimationActive
                          fill="#8884d8"
                        >
                          <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                        </Funnel>
                      </FunnelChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attribution Model */}
            <Card>
              <CardHeader>
                <CardTitle>Attribution Modeling</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attributionData}>
                      <XAxis dataKey="source" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))">
                        {attributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 50}, 70%, 50%)`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AgentCard type="context" />
              <AgentCard type="awareness" />
              <AgentCard type="autonomy" />
              <AgentCard type="collaboration" />
              <AgentCard type="multimodal" />
              <AgentCard type="reasoning" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Agent Activity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="email"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="web"
                        stroke="#82ca9d"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="call"
                        stroke="#ffc658"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="explore" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ask EvoOrch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Textarea
                    placeholder="Ask about your pipeline data, lead scoring patterns, or request specific insights..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button
                    className="self-end"
                    onClick={handleExploreSubmit}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Ask
                  </Button>
                </div>

                <ScrollArea className="h-[500px] rounded-md border p-4">
                  {responses.map((response, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <div className="text-sm text-muted-foreground mb-2">
                        {new Date(response.timestamp).toLocaleString()}
                      </div>
                      <div className="prose dark:prose-invert max-w-none">
                        {response.content}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {response.recommendations.map((rec, recIndex) => (
                          <Card
                            key={recIndex}
                            className={cn(
                              "transition-colors hover:border-primary cursor-pointer",
                              rec.type === "action" && "border-blue-500",
                              rec.type === "alert" && "border-yellow-500",
                              rec.type === "insight" && "border-green-500"
                            )}
                          >
                            <CardHeader>
                              <CardTitle className="text-sm">{rec.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                {rec.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}