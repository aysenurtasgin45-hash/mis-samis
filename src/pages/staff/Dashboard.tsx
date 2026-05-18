import { ReactNode, useEffect, useState } from 'react';
import {
  ClipboardList,
  Stethoscope,
  Activity,
  MessageCircle,
  Heart,
  AlertTriangle,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { getStaffDashboard } from '@/lib/dashboards';

export default function StaffDashboard() {
  const [dashboard, setDashboard] = useState<Awaited<ReturnType<typeof getStaffDashboard>> | null>(null);

  useEffect(() => {
    getStaffDashboard().then(setDashboard).catch(() => setDashboard(null));
  }, []);

  return (
    <DashboardLayout role="staff">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl text-primary-navy">Personel Paneli</h1>
          <p className="text-sm text-slate-500">Bugun belediyenizdeki sokak hayvanlari icin yapabileceginiz islemler asagidadir.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActionCard title="Hayvan Kayit" desc="Yeni bir hayvan kaydet veya listele" icon={<ClipboardList className="text-blue-600" />} to="/panel/hayvanlar" color="bg-blue-50" />
          <ActionCard title="Saglik & Asi" desc="Muayene ve asi kayitlarini yonet" icon={<Stethoscope className="text-emerald-600" />} to="/panel/saglik" color="bg-emerald-50" />
          <ActionCard title="Operasyonlar" desc="Saha operasyonlarini ve CNVR kaydet" icon={<Activity className="text-orange-600" />} to="/panel/operasyonlar" color="bg-orange-50" />
          <ActionCard title="Sikayetler" desc="Vatandas ihbarlarini cevapla" icon={<MessageCircle className="text-red-600" />} to="/panel/sikayetler" color="bg-red-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 rounded-3xl border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Yakin Zamandaki Islemler</CardTitle>
                <CardDescription>Supabase operasyon kayitlarindan gelen son islemler</CardDescription>
              </div>
              <Button variant="ghost" size="sm">Hepsini Gor</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(dashboard?.recentOperations ?? []).map((act) => (
                  <div key={act.operation_id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-orange-100 text-orange-700">
                        <Activity size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{act.result ?? act.operation_type}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">{new Date(act.operation_date).toLocaleDateString('tr-TR')}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">Detay</Button>
                  </div>
                ))}
                {(!dashboard || dashboard.recentOperations.length === 0) && (
                  <div className="p-6 text-center text-sm text-slate-500">Henuz operasyon kaydi yok.</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200">
            <CardHeader>
              <CardTitle>Genel Ozet</CardTitle>
              <CardDescription>Bagli oldugunuz belediye verileri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SummaryRow icon={<Heart size={18} />} label="Bekleyen Sahiplenme" value={dashboard?.pendingAdoptions ?? 0} color="text-primary-navy" />
              <SummaryRow icon={<AlertTriangle size={18} />} label="Kritik Ihbarlar" value={dashboard?.criticalComplaints ?? 0} color="text-red-600" />

              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Tesis Doluluklari</p>
                <div className="space-y-4">
                  {(dashboard?.facilities ?? []).map((facility) => {
                    const occupancy = facility.capacity ? Math.round((facility.current_occupancy / facility.capacity) * 100) : 0;
                    return (
                      <div key={facility.name}>
                        <div className="flex justify-between text-xs mb-1 font-medium">
                          <span>{facility.name}</span>
                          <span className={occupancy > 80 ? 'text-amber-600' : 'text-green-600'}>%{occupancy}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={cn('h-full', occupancy > 80 ? 'bg-amber-500' : 'bg-green-500')} style={{ width: `${occupancy}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SummaryRow({ icon, label, value, color }: { icon: ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
      <div className="flex items-center gap-3">
        <div className={cn('bg-white p-2 rounded-xl shadow-sm', color)}>{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className={cn('text-xl font-bold font-display', color)}>{value}</span>
    </div>
  );
}

function ActionCard({ title, desc, icon, to, color }: { title: string, desc: string, icon: ReactNode, to: string, color: string }) {
  return (
    <NavLink to={to} className="group">
      <Card className="rounded-3xl border-slate-200 hover:border-primary-navy/20 transition-all duration-300 h-full overflow-hidden">
        <CardContent className="p-6">
          <div className={cn('p-3 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300', color)}>
            {icon}
          </div>
          <h3 className="font-bold text-primary-navy mb-1">{title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
        </CardContent>
      </Card>
    </NavLink>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
