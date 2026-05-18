import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { PawPrint, MapPin, Search, Filter, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { listAdoptableAnimals, type AnimalDirectoryRow } from '@/lib/animals';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [animals, setAnimals] = useState<AnimalDirectoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAnimals() {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const data = await listAdoptableAnimals(searchQuery);
        if (isMounted) setAnimals(data);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Hayvan listesi yuklenemedi.');
          setAnimals([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    const timeoutId = window.setTimeout(loadAnimals, 250);
    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary-navy p-1.5 rounded-lg text-white">
                <PawPrint size={24} />
              </div>
              <span className="text-xl font-bold font-display text-primary-navy">SAMIS</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <NavLink to="/" className="text-primary-navy border-b-2 border-primary-navy pb-1">Sahiplenme</NavLink>
              <NavLink to="/sikayet" className="text-slate-600 hover:text-primary-navy">Sikayet/Ihbar</NavLink>
              <NavLink to="/hakkimizda" className="text-slate-600 hover:text-primary-navy">Hakkimizda</NavLink>
            </div>
            <div className="flex items-center gap-3">
              <NavLink to="/giris">
                <Button variant="ghost" className="text-slate-600">Giris Yap</Button>
              </NavLink>
              <NavLink to="/kayit">
                <Button className="bg-primary-navy hover:bg-sky-900 text-white">Kayit Ol</Button>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-primary-navy text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge className="bg-sky-800 text-sky-200 border-none px-4 py-1">Yeni Bir Baslangic</Badge>
          <h1 className="text-4xl md:text-6xl tracking-tight leading-tight">
            Sokaktaki Canlar Icin <br /> <span className="text-accent-amber">Guvenli Bir Gelecek.</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            SAMIS, Turkiye genelindeki sahipsiz hayvanlarin kayit, tedavi ve sahiplendirme sureclerini
            tek bir merkezden yoneten milli bilgi sistemidir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <Input
                placeholder="Isim veya cip numarasi ile ara..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white focus:text-slate-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="lg" className="bg-accent-amber hover:bg-amber-600 text-primary-navy font-bold">
              Hemen Incele
            </Button>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl text-primary-navy">Sahiplenilmeyi Bekleyen Canlar</h2>
            <p className="text-slate-500">Su an barinaklarimizda yeni yuvalarini bekleyen dostlarimizla tanisin.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} /> Filtrele
            </Button>
            <select className="bg-white border border-slate-200 rounded-md text-sm p-2 outline-none">
              <option>Yeni Eklenenler</option>
              <option>Yas: Once Gencler</option>
              <option>Yas: Once Yetiskinler</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading && <Card className="col-span-full p-8 text-center text-slate-500">Yukleniyor...</Card>}
          {!isLoading && errorMessage && <Card className="col-span-full p-8 text-center text-red-600">{errorMessage}</Card>}
          {!isLoading && !errorMessage && animals.length === 0 && (
            <Card className="col-span-full p-8 text-center text-slate-500">Sahiplenmeye uygun kayit bulunamadi.</Card>
          )}
          {!isLoading && !errorMessage && animals.map((animal) => (
            <Card key={animal.animal_id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-primary-navy/30 flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={animal.photo_url ?? 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=800'}
                  alt={animal.name ?? 'Sahiplenilebilir hayvan'}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <Badge className="bg-white/90 text-primary-navy border-none backdrop-blur-sm">
                    {animal.species === 'Dog' ? 'Kopek' : animal.species === 'Cat' ? 'Kedi' : 'Diger'}
                  </Badge>
                  {animal.sterilization_status && (
                    <Badge className="bg-green-500/90 text-white border-none flex items-center gap-1 backdrop-blur-sm">
                      <ShieldCheck size={12} /> Kisirlastirilmis
                    </Badge>
                  )}
                </div>
              </div>
              <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-primary-navy">{animal.name ?? 'Isimsiz'}</CardTitle>
                    <CardDescription className="text-slate-500">{animal.breed}</CardDescription>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold">{animal.age_estimate ?? '-'} Ay</span>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Yas</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4 flex-1">
                <Separator className="bg-slate-100" />
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">{animal.city ?? '-'}, {animal.district ?? '-'}</p>
                    <p className="text-xs text-slate-400">{animal.facility_name ?? 'Tesis atanmadi'}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0 bg-slate-50 mt-auto">
                <NavLink to={`/giris?animal=${animal.animal_id}`} className="w-full">
                  <Button className="w-full bg-white hover:bg-primary-navy hover:text-white text-primary-navy border border-primary-navy/20 transition-colors">
                    <Heart size={16} className="mr-2" /> Sahiplenme Basvurusu Yap
                  </Button>
                </NavLink>
              </CardFooter>
            </Card>
          ))}
        </div>

        <section className="mt-24 bg-slate-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
          <div className="flex-1 space-y-6 z-10">
            <h2 className="text-3xl md:text-4xl text-primary-navy">Sorumlu Sahiplenme Ilkeleri</h2>
            <p className="text-slate-600">
              Bir hayvani sahiplenmek sadece ona bir yuva vermek degil, onun tum yasami boyunca bakimini,
              sagligini ve guvenligini ustlenmektir. SAMIS uzerinden sahiplenilen her can, duzenli olarak
              kontrol edilmektedir.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-accent-amber font-bold text-2xl">01</div>
                <h4 className="font-bold">Saglik Takibi</h4>
                <p className="text-xs text-slate-500">Tum asilar ve parazit uygulamalari sistem uzerinden takip edilir.</p>
              </div>
              <div className="space-y-2">
                <div className="text-accent-amber font-bold text-2xl">02</div>
                <h4 className="font-bold">Kimlik Kaydi</h4>
                <p className="text-xs text-slate-500">Her can mikrocip ile kayit altina alinir ve sahibine atanir.</p>
              </div>
            </div>
          </div>
          <div className="flex-1 relative w-full aspect-video md:aspect-square">
            <img
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=800"
              alt="Community"
              className="rounded-2xl shadow-2xl object-cover w-full h-full"
            />
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <PawPrint size={24} />
              <span className="text-xl font-bold font-display">SAMIS</span>
            </div>
            <p className="text-sm max-w-sm">
              T.C. Tarim ve Orman Bakanligi bunyesinde faaliyet gosteren Sahipsiz Hayvan Yonetim Bilgi Sistemi.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Hizli Baglantilar</h4>
            <ul className="text-sm space-y-2">
              <li><NavLink to="/">Giris Sayfasi</NavLink></li>
              <li><NavLink to="/sikayet">Sikayet Bildir</NavLink></li>
              <li><NavLink to="/yardim">Yardim Merkezi</NavLink></li>
              <li><NavLink to="/iletisim">Iletisim</NavLink></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Yasal</h4>
            <ul className="text-sm space-y-2">
              <li><NavLink to="/kvkk">KVKK Aydinlatma Metni</NavLink></li>
              <li><NavLink to="/kullanim-kosullari">Kullanim Kosullari</NavLink></li>
              <li><NavLink to="/etik">Hayvan Haklari ve Etik</NavLink></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-xs text-center">
          2026 T.C. Tarim ve Orman Bakanligi. Tum haklari saklidir.
        </div>
      </footer>
    </div>
  );
}
