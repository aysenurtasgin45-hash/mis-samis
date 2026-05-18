import { useEffect, useState } from 'react';
import { Heart, MessageCircle, ClipboardList, Search, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavLink } from 'react-router-dom';
import { getCitizenDashboard } from '@/lib/dashboards';

export default function CitizenDashboard() {
  const [dashboard, setDashboard] = useState<Awaited<ReturnType<typeof getCitizenDashboard>> | null>(null);

  useEffect(() => {
    getCitizenDashboard().then(setDashboard).catch(() => setDashboard(null));
  }, []);

  const displayName = dashboard?.profile?.first_name ? `${dashboard.profile.first_name} ${dashboard.profile.last_name}` : 'Vatandas';

  return (
    <DashboardLayout role="citizen">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl text-primary-navy">Merhaba, {displayName}</h1>
            <p className="text-sm text-slate-500">Sokaktaki dostlarimiz icin neler yapabilecegimize goz atin.</p>
          </div>
          <NavLink to="/portal/sikayet">
            <Button className="bg-red-500 hover:bg-red-600 text-white rounded-xl gap-2 font-bold px-6">
              <MessageCircle size={18} /> Acil Ihbar Bildir
            </Button>
          </NavLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-primary-navy rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="space-y-4 z-10">
                <Badge className="bg-sky-500/20 text-sky-200 border-none">Canli Veriler</Badge>
                <h2 className="text-3xl font-display">Size uygun sahiplenme onerileri hazir</h2>
                <p className="text-slate-300 max-w-md text-sm">
                  Oneriler Supabase hayvan rehberinden, aktif barinak kayitlarina gore listelenir.
                </p>
                <NavLink to="/portal/sahiplenme">
                  <Button className="bg-white text-primary-navy hover:bg-sky-50 rounded-xl font-bold">Basvurulari Incele</Button>
                </NavLink>
              </div>
              <div className="relative z-10 w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 rotate-3">
                <img
                  src={dashboard?.recommendations[0]?.photo_url ?? 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400'}
                  alt={dashboard?.recommendations[0]?.name ?? 'Onerilen hayvan'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-5">
                <Heart size={300} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <h3 className="text-xl font-bold text-primary-navy">Size Uygun Olabilecek Canlar</h3>
                <NavLink to="/portal/sahiplenme" className="text-sm text-primary-navy font-bold flex items-center gap-1 hover:underline">
                  Tumunu Gor <ChevronRight size={14} />
                </NavLink>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(dashboard?.recommendations ?? []).map((animal) => (
                  <Card key={animal.animal_id} className="rounded-3xl border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                    <CardContent className="p-0 flex">
                      <div className="w-1/3 aspect-square overflow-hidden bg-slate-100">
                        <img
                          src={animal.photo_url ?? 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=200'}
                          className="w-full h-full object-cover"
                          alt={animal.name ?? 'Hayvan'}
                        />
                      </div>
                      <div className="w-2/3 p-4 flex flex-col justify-between">
                        <div>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider mb-2">{animal.species} - {animal.breed ?? 'Belirtilmedi'}</Badge>
                          <h4 className="font-bold text-slate-800">{animal.name ?? 'Isimsiz'}</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin size={10} /> {animal.city ?? '-'}, {animal.district ?? '-'}
                          </p>
                        </div>
                        <Button variant="ghost" className="w-full justify-between h-8 text-primary-navy font-bold text-xs p-0 group">
                          Incele <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="text-lg">Islemlerim</CardTitle>
                <CardDescription>Sisteme kayitli kayitlariniz</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <NavLink to="/portal/basvurularim" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-100 p-2 rounded-xl text-sky-700">
                      <ClipboardList size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Basvurular</p>
                      <p className="text-[10px] text-slate-400">{dashboard?.applicationsCount ?? 0} Kayit</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-primary-navy" />
                </NavLink>

                <NavLink to="/portal/sikayet" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-xl text-amber-700">
                      <MessageCircle size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Ihbarlarim</p>
                      <p className="text-[10px] text-slate-400">{dashboard?.complaintsCount ?? 0} Kayit</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-primary-navy" />
                </NavLink>

                <div className="bg-slate-50 rounded-2xl p-4 mt-4 text-center space-y-2">
                  <ShieldCheck className="mx-auto text-green-600 mb-1" size={24} />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Dogrulanmis Profil</h4>
                  <p className="text-[10px] text-slate-400">Profil verileriniz Supabase Auth ile eslestirilir.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-slate-200 shadow-sm border-dashed">
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className="bg-slate-100 p-4 rounded-full text-slate-400">
                  <Search size={32} />
                </div>
                <h4 className="font-bold text-primary-navy">Barinaklari Kesfedin</h4>
                <p className="text-xs text-slate-500">Yakin belediye barinaklari tesis tablosundan listelenecek.</p>
                <Button variant="outline" className="w-full rounded-xl text-xs">Haritada Goster</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
