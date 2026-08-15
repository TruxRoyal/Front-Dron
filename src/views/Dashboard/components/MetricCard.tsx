import { Card, CardContent } from '@/components/ui/card';

export const MetricCard = ({ icon: Icon, label, value, subValue, colorClass = "bg-primary" }: { icon: any, label: string, value: string, subValue?: string, colorClass?: string }) => (
  <Card className="border-none shadow-sm overflow-hidden group">
    <CardContent className="p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl text-white ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-bold">{value}</p>
          {subValue && <span className="text-xs text-muted-foreground font-medium">{subValue}</span>}
        </div>
      </div>
    </CardContent>
  </Card>
);
