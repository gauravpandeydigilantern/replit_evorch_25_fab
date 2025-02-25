import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { PersonaType } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.put("/api/user/persona", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const persona = PersonaType.safeParse(req.body.persona);
    if (!persona.success) {
      return res.status(400).json({ error: "Invalid persona type" });
    }

    const updatedUser = await storage.updateUserPersona(req.user.id, persona.data);
    res.json(updatedUser);
  });

  const httpServer = createServer(app);
  return httpServer;
}
