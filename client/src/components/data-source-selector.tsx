import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiSalesforce } from "react-icons/si";
import { FileUp, Database, PenSquare } from "lucide-react";
import { useState } from "react";
import { DataSourceType } from "@shared/schema";

interface DataSourceSelectorProps {
  onSelect: (source: string, config?: any) => void;
}

export default function DataSourceSelector({ onSelect }: DataSourceSelectorProps) {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      onSelect("CSV_UPLOAD", { filename: files[0].name });
    }
  };

  const sources = [
    {
      id: "SALESFORCE",
      title: "Salesforce",
      description: "Connect your Salesforce account",
      icon: SiSalesforce,
      color: "text-[#00A1E0]"
    },
    {
      id: "CSV_UPLOAD",
      title: "CSV Upload",
      description: "Upload your data via CSV file",
      icon: FileUp,
      color: "text-green-500"
    },
    {
      id: "API",
      title: "API Integration",
      description: "Connect via REST API",
      icon: Database,
      color: "text-purple-500"
    },
    {
      id: "MANUAL",
      title: "Manual Entry",
      description: "Enter data manually",
      icon: PenSquare,
      color: "text-orange-500"
    }
  ];

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((source) => (
          <Card 
            key={source.id}
            className={`cursor-pointer transition-colors ${
              selectedSource === source.id ? "border-primary" : "hover:border-primary/50"
            }`}
            onClick={() => {
              setSelectedSource(source.id);
              onSelect(source.id);
            }}
          >
            <CardHeader>
              <source.icon className={`h-8 w-8 ${source.color}`} />
              <CardTitle className="text-lg mt-2">{source.title}</CardTitle>
              <CardDescription>{source.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSource === source.id && source.id === "CSV_UPLOAD" && (
                <div className="space-y-4">
                  <Label htmlFor="file-upload">Choose CSV File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                  {file && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              )}
              {selectedSource === source.id && source.id === "SALESFORCE" && (
                <Button className="w-full" variant="outline">
                  Connect Salesforce
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
