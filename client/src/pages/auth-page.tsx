import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Redirect } from "wouter";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import DataSourceSelector from "@/components/data-source-selector";
import { useState } from "react";

const loginSchema = insertUserSchema.pick({ username: true, password: true });

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [step, setStep] = useState<"form" | "source">("form");
  const [registrationData, setRegistrationData] = useState<any>(null);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", password: "", email: "", name: "" },
  });

  const handleRegistrationSubmit = (data: any) => {
    setRegistrationData(data);
    setStep("source");
  };

  const handleDataSourceSelect = (source: string, config?: any) => {
    if (registrationData) {
      registerMutation.mutate({
        ...registrationData,
        dataSource: source,
        dataSourceConfig: config
      });
    }
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <Tabs defaultValue="login" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" {...loginForm.register("username")} />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input type="password" id="password" {...loginForm.register("password")} />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>
                  {step === "form" ? "Create Account" : "Choose Data Source"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {step === "form" ? (
                  <form onSubmit={registerForm.handleSubmit(handleRegistrationSubmit)}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" {...registerForm.register("name")} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" {...registerForm.register("email")} />
                      </div>
                      <div>
                        <Label htmlFor="reg-username">Username</Label>
                        <Input id="reg-username" {...registerForm.register("username")} />
                      </div>
                      <div>
                        <Label htmlFor="reg-password">Password</Label>
                        <Input type="password" id="reg-password" {...registerForm.register("password")} />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                      >
                        Continue
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <DataSourceSelector onSelect={handleDataSourceSelect} />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setStep("form")}
                    >
                      Back
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12">
        <div className="max-w-lg text-primary-foreground">
          <h1 className="text-4xl font-bold mb-4">AI-Powered Business Intelligence</h1>
          <p className="text-lg opacity-90">
            Transform your business with our intelligent platform that adapts to your role
            and provides actionable insights through advanced AI agents.
          </p>
        </div>
      </div>
    </div>
  );
}