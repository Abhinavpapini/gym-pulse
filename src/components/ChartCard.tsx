
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

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
  const handleExport = () => {
    // Mock export functionality - in a real app, this would generate and download
    // the actual chart data as CSV or the chart image as PDF
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ title, mockData: "This would be real data in production" })
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, '_')}_data.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
};

export default ChartCard;
