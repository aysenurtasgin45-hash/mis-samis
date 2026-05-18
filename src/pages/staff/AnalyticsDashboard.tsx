import { ReactNode, useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Home, 
  AlertTriangle, 
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAnalyticsDashboard } from '@/lib/analytics';

export default function AnalyticsDashboard() {
  const [dashboard, setDashboard] = useState<Awaited<ReturnType<typeof getAnalyticsDashboard>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAnalyticsDashboard()
      .then(setDashboard)
      .catch(() => setDashboard(null))
      .finally(() => setIsLoading(false));
  }, []);

  const registrationData = dashboard?.registrationData ?? [];
  const statusDistribution = dashboard?.statusDistribution ?? [];
  const projections = dashboard?.projections ?? [];
  const municipalityPerformance = dashboard?.municipalityPerformance ?? [];
  const kpis = dashboard?.kpis ?? [];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl text-primary-navy">Ulusal Analiz & KPI Paneli</h1>
            <p className="text-sm text-slate-500">Türkiye geneli sahipsiz hayvan verileri ve projeksiyonları.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download size={18} /> Rapor Oluştur
            </Button>
            <Button className="bg-primary-navy hover:bg-sky-900 text-white gap-2">
              <Calendar size={18} /> Dönem Filtresi
            </Button>
          </div>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading && <Card className="col-span-full p-8 text-center text-slate-500">Yukleniyor...</Card>}
          {!isLoading && kpis.map((kpi) => (
            <KpiCard
              key={kpi.key}
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              isUp={kpi.is_up}
              icon={iconForKpi(kpi.key)}
            />
          ))}
        </div>
        {/* Main Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Trend */}
          <Card className="lg:col-span-2 rounded-3xl border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div>
                <CardTitle>Aylık Kayıt Trendi</CardTitle>
                <CardDescription>Sisteme yeni eklenen hayvan sayısı (Son 7 Ay)</CardDescription>
              </div>
              <Button variant="ghost" size="icon"><Filter size={18} /></Button>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={registrationData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a5276" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1a5276" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    cursor={{stroke: '#1a5276', strokeWidth: 2, strokeDasharray: '5 5'}}
                  />
                  <Area type="monotone" dataKey="count" stroke="#1a5276" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="rounded-3xl border-slate-200">
            <CardHeader>
              <CardTitle>Durum Dağılımı</CardTitle>
              <CardDescription>Ulusal bazda güncel durumlar</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <span className="text-3xl font-bold font-display">100%</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Toplam</span>
              </div>
            </CardContent>
            <CardContent className="pt-0 space-y-3">
              {statusDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Projections Section */}
        <Card className="rounded-3xl border-slate-200 bg-slate-900 border-none">
          <CardHeader className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-sky-500/20 p-2 rounded-lg">
                <TrendingUp className="text-sky-400" size={20} />
              </div>
              <CardTitle>5 Yıllık Nüfus Projeksiyonu</CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              Kısırlaştırma ve sahiplenme hedeflerine göre beklenen sokak hayvanı popülasyonu değişimi.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] mt-4 px-8 pb-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projections}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                  tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', color: '#fff'}}
                  itemStyle={{color: '#38bdf8'}}
                />
                <Line type="monotone" dataKey="population" stroke="#38bdf8" strokeWidth={4} dot={{fill: '#38bdf8', strokeWidth: 2, r: 4}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Municipality Ranking */}
        <Card className="rounded-3xl border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Belediye Performans İzleyici</CardTitle>
              <CardDescription>Aktif işlem hacmine göre ilk 5 belediye</CardDescription>
            </div>
            <Tabs defaultValue="animalCount">
              <TabsList className="bg-slate-100 rounded-xl p-1 h-9">
                <TabsTrigger value="animalCount" className="rounded-lg text-xs">Hayvan Sayısı</TabsTrigger>
                <TabsTrigger value="cnvrRate" className="rounded-lg text-xs">CNVR Oranı</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {municipalityPerformance.map((mun) => (
                <div key={mun.name} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="font-bold text-sm text-primary-navy">{mun.name}</h4>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{mun.city}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600">{mun.count.toLocaleString()} Can</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-navy" 
                      style={{width: `${mun.progress}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function iconForKpi(key: string) {
  switch (key) {
    case 'sterilization_rate': return <ShieldCheck className="text-green-600" />;
    case 'shelter_occupancy': return <Home className="text-orange-600" />;
    case 'active_complaints': return <AlertTriangle className="text-red-600" />;
    default: return <TrendingUp className="text-blue-600" />;
  }
}

function KpiCard({ title, value, trend, isUp, icon }: { title: string, value: string, trend: string, isUp: boolean, icon: ReactNode }) {
  return (
    <Card className="rounded-3xl border-slate-200 overflow-hidden group hover:border-primary-navy/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-primary-navy/5 transition-colors">
            {icon}
          </div>
          <Badge className={cn(
            "border-none rounded-lg px-2",
            isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {isUp ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
            {trend}
          </Badge>
        </div>
        <h3 className="text-3xl font-bold text-primary-navy mb-1">{value}</h3>
        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">{title}</p>
      </CardContent>
    </Card>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}


