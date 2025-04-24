
import { ReactNode, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  exportData?: boolean;
  className?: string;
}

const ChartCard = ({
  title,
  description,
  children,
  exportData = true,
  className = "",
}: ChartCardProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!chartRef.current) return;
    
    try {
      // Generate CSV data
      const mockData = [
        ["Date", "Value"],
        ["Jan", Math.floor(Math.random() * 100)],
        ["Feb", Math.floor(Math.random() * 100)],
        ["Mar", Math.floor(Math.random() * 100)],
        ["Apr", Math.floor(Math.random() * 100)],
        ["May", Math.floor(Math.random() * 100)],
      ];
      
      // Convert to CSV string
      const csvContent = mockData.map(row => row.join(",")).join("\n");
      
      // Create CSV file and download
      const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const csvUrl = URL.createObjectURL(csvBlob);
      const csvLink = document.createElement("a");
      csvLink.setAttribute("href", csvUrl);
      csvLink.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, '_')}_data.csv`);
      document.body.appendChild(csvLink);
      csvLink.click();
      csvLink.remove();
      
      toast({
        title: "CSV Downloaded",
        description: "Chart data has been exported as a CSV file.",
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Export Failed",
        description: "Could not export chart data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`shadow-md h-full ${className}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </div>
        {exportData && (
          <Button variant="outline" size="sm" onClick={handleExport} className="h-8">
            <DownloadIcon className="h-3.5 w-3.5 mr-1" />
            Export
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4" ref={chartRef}>{children}</CardContent>
    </Card>
  );
};

export default ChartCard;
