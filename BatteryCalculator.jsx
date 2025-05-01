import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

export default function BatteryCalculator() {
  const [pdfFile, setPdfFile] = useState(null);
  const [mode, setMode] = useState("battery");
  const [result, setResult] = useState(null);

  const handleFileUpload = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!pdfFile) return;
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("mode", mode);

    const res = await fetch("http://localhost:8000/api/calculate", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Whole Home Battery Calculator</h1>

      <div className="space-y-4">
        <input type="file" accept="application/pdf" onChange={handleFileUpload} className="block" />

        <div className="flex space-x-4">
          <Button variant={mode === "battery" ? "default" : "outline"} onClick={() => setMode("battery")}>Battery Only</Button>
          <Button variant={mode === "solar" ? "default" : "outline"} onClick={() => setMode("solar")}>Battery + Solar</Button>
        </div>

        <Button onClick={handleSubmit} className="mt-4 flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          <span>Calculate</span>
        </Button>

        {result && (
          <Card className="mt-6">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Recommendation</h2>
              <p><strong>Battery Size:</strong> {result.batterySize} kWh</p>
              <p><strong>Units Needed:</strong> {result.units}</p>
              <p><strong>Daily Usage:</strong> {result.dailyUsage} kWh</p>
              {mode === "solar" && <p><strong>Panels Needed:</strong> {result.panelCount} (470W each)</p>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}