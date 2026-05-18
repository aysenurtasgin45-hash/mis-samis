import { useEffect, useState, type FormEvent } from 'react';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  QrCode,
  FileDown,
  Dog,
  Cat,
  ShieldCheck,
  ShieldAlert,
  MapPin,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createAnimal, listAnimals, listFacilities, type AnimalDirectoryRow } from '@/lib/animals';

type FacilityOption = Awaited<ReturnType<typeof listFacilities>>[number];

export default function AnimalRegistry() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [animals, setAnimals] = useState<AnimalDirectoryRow[]>([]);
  const [facilities, setFacilities] = useState<FacilityOption[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [species, setSpecies] = useState<'Dog' | 'Cat' | 'Other'>('Dog');
  const [sex, setSex] = useState<'M' | 'F'>('M');
  const [sterile, setSterile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadAnimals() {
    setIsLoading(true);
    try {
      const data = await listAnimals(searchQuery);
      setAnimals(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Hayvan kayitlari yuklenemedi.');
      setAnimals([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(loadAnimals, 250);
    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    listFacilities()
      .then((data) => {
        setFacilities(data);
        if (data[0]) setSelectedFacilityId(data[0].facility_id);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : 'Tesis listesi yuklenemedi.'));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In_Shelter': return <Badge className="status-badge status-shelter">Barinakta</Badge>;
      case 'Adopted': return <Badge className="status-badge status-adopted">Sahiplendirildi</Badge>;
      case 'Active': return <Badge className="status-badge status-active">Aktif (Sokakta)</Badge>;
      case 'Deceased': return <Badge className="status-badge status-deceased">Vefat</Badge>;
      case 'Released': return <Badge className="status-badge status-released">Birakildi</Badge>;
      default: return null;
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const facility = facilities.find((item) => item.facility_id === selectedFacilityId);

    if (!facility) {
      toast.error('Once Supabase tesis kaydi ekleyin veya bir tesis secin.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createAnimal({
        microchip_id: String(form.get('microchip') ?? ''),
        name: String(form.get('name') ?? '') || null,
        species,
        sex,
        breed: String(form.get('breed') ?? '') || null,
        age_estimate: Number(form.get('age') || 0) || null,
        sterilization_status: sterile,
        status: 'In_Shelter',
        municipality_id: facility.municipality_id,
        current_facility_id: selectedFacilityId,
        entry_date: new Date().toISOString().slice(0, 10),
      });
      toast.success('Hayvan kaydi basariyla olusturuldu.');
      setIsAddModalOpen(false);
      await loadAnimals();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Hayvan kaydi olusturulamadi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="staff">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl text-primary-navy">Hayvan Kayit Rehberi</h1>
            <p className="text-sm text-slate-500">Belediyenizdeki tum kayitli hayvanlari yonetin ve izleyin.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2">
              <FileDown size={18} /> Excel Indir
            </Button>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary-navy hover:bg-sky-900 text-white gap-2">
                  <Plus size={18} /> Yeni Hayvan Kaydi
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl sm:max-w-[700px] rounded-3xl p-0 overflow-hidden outline-none">
                <form onSubmit={handleRegister}>
                  <DialogHeader className="bg-primary-navy text-white p-6">
                    <DialogTitle className="text-xl">Yeni Hayvan Kaydi</DialogTitle>
                    <DialogDescription className="text-slate-200">
                      Zorunlu alanlari doldurarak yeni bir sokak hayvanini sisteme kaydedin.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2">
                      <Label htmlFor="microchip">Mikrocip Numarasi (15 Hane)</Label>
                      <Input id="microchip" name="microchip" placeholder="900115000XXXXXX" maxLength={15} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Hayvan Ismi (Opsiyonel)</Label>
                      <Input id="name" name="name" placeholder="Orn: Pamuk" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="species">Tur</Label>
                      <Select value={species} onValueChange={(value) => setSpecies(value as typeof species)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seciniz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dog">Kopek</SelectItem>
                          <SelectItem value="Cat">Kedi</SelectItem>
                          <SelectItem value="Other">Diger</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sex">Cinsiyet</Label>
                      <Select value={sex} onValueChange={(value) => setSex(value as typeof sex)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seciniz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Erkek</SelectItem>
                          <SelectItem value="F">Disi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="breed">Irk / Tur Detayi</Label>
                      <Input id="breed" name="breed" placeholder="Orn: Golden Retriever Mix" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Tahmini Yas (Ay)</Label>
                      <Input id="age" name="age" type="number" min={0} placeholder="Orn: 24" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facility">Tesis Atamasi</Label>
                      <Select value={selectedFacilityId} onValueChange={setSelectedFacilityId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tesis Secin" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilities.map((facility) => (
                            <SelectItem key={facility.facility_id} value={facility.facility_id}>{facility.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox id="sterile" checked={sterile} onCheckedChange={(value) => setSterile(Boolean(value))} />
                      <label htmlFor="sterile" className="text-sm font-medium leading-none cursor-pointer">
                        Kisirlastirildi mi?
                      </label>
                    </div>
                  </div>
                  <DialogFooter className="bg-slate-50 p-6 border-t border-slate-100 mt-0">
                    <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Iptal</Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-primary-navy hover:bg-sky-900 text-white">
                      {isSubmitting ? 'Kaydediliyor...' : 'Degisiklikleri Kaydet'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="rounded-3xl border-slate-200 overflow-hidden">
          <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <Input
                placeholder="Cip no, isim veya irk ile ara..."
                className="pl-10 h-11 bg-slate-50 border-none focus-visible:ring-primary-navy/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="h-11 border-slate-200 text-slate-600 gap-2">
                <Filter size={18} /> Filtrelere Bak
              </Button>
              <Button variant="outline" className="h-11 border-slate-200 text-slate-600">
                <QrCode size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="w-[200px] font-bold text-primary-navy">Cip Numarasi</TableHead>
                <TableHead className="font-bold text-primary-navy">Isim / Tur</TableHead>
                <TableHead className="font-bold text-primary-navy">Durum</TableHead>
                <TableHead className="font-bold text-primary-navy">Kisirlastirma</TableHead>
                <TableHead className="font-bold text-primary-navy">Tesis</TableHead>
                <TableHead className="font-bold text-primary-navy">Giris Tarihi</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow><TableCell colSpan={7} className="text-center text-slate-500 py-8">Yukleniyor...</TableCell></TableRow>
              )}
              {!isLoading && animals.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-slate-500 py-8">Kayit bulunamadi.</TableCell></TableRow>
              )}
              {!isLoading && animals.map((animal) => (
                <TableRow key={animal.animal_id} className="hover:bg-slate-50/50 border-slate-100">
                  <TableCell className="font-mono text-xs font-bold text-slate-600">
                    {animal.microchip_id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                        {animal.species === 'Dog' ? <Dog size={16} /> : <Cat size={16} />}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{animal.name || 'Isimsiz'}</p>
                        <p className="text-xs text-slate-400">{animal.breed}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(animal.status)}</TableCell>
                  <TableCell>
                    {animal.sterilization_status ? (
                      <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                        <ShieldCheck size={14} /> Evet
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                        <ShieldAlert size={14} /> Hayir
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={12} /> {animal.facility_name ?? '-'}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{animal.entry_date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl p-2 w-48">
                        <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Islemler</DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-lg cursor-pointer">Detaylari Goruntule</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg cursor-pointer">Saglik Kaydi Ekle</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg cursor-pointer">Operasyon Gunlugu</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Toplam {animals.length.toLocaleString()} kayit gosteriliyor</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" disabled>Onceki</Button>
              <Button variant="ghost" size="sm" disabled>Sonraki</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
