import { useState, type FormEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PawPrint, ArrowLeft, Shield, Info, MapPin, Building2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { registerCitizen } from '@/lib/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    tcNo: '',
    phone: '',
    address: '',
    housingType: '',
    hasGarden: false,
    prevExperience: 0,
    trainingCompleted: false,
    financialStatus: '',
  });

  const validateTC = (tc: string) => {
    if (tc.length !== 11) return false;
    if (!/^[1-9][0-9]{10}$/.test(tc)) return false;

    const digits = tc.split('').map(Number);
    const sumAll = digits.slice(0, 10).reduce((a, b) => a + b, 0);
    const sumOdds = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const sumEvens = digits[1] + digits[3] + digits[5] + digits[7];

    const digit10 = (sumOdds * 7 - sumEvens) % 10;
    const digit11 = (sumAll) % 10;

    return digit10 === digits[9] && digit11 === digits[10];
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        toast.error('Lütfen tüm zorunlu alanları doldurun.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!validateTC(formData.tcNo)) {
        toast.error('Geçerli bir T.C. Kimlik Numarası giriniz.');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await registerCitizen(formData);
      toast.success('Kayit isleminiz basarili! Yonlendiriliyorsunuz...');
      navigate('/portal');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Kayit tamamlanamadi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="bg-primary-navy p-2 rounded-xl text-white">
          <PawPrint size={32} />
        </div>
        <span className="text-3xl font-bold font-display text-primary-navy">SAMIS</span>
      </div>

      <Card className="w-full max-w-xl border-slate-200 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <NavLink to="/giris" className="text-slate-400 hover:text-primary-navy transition-colors">
              <ArrowLeft size={20} />
            </NavLink>
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 w-12 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-primary-navy' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-2xl text-primary-navy font-display">
            {step === 1 ? 'Hesap Oluştur' : step === 2 ? 'Kimlik Doğrulama' : 'Profil Bilgileri'}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? 'SAMIS sistemine katılmak için temel bilgilerinizi girin.'
              : step === 2
              ? 'T.C. kanunları gereği mülkiyet işlemleri için gerçek kişi doğrulaması gereklidir.'
              : 'Sahiplenme eşleşme puanınızın hesaplanması için bu bilgileri doldurun.'}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-8 space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ad</Label>
                    <Input
                      id="firstName"
                      placeholder="Örn: Ahmet"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyad</Label>
                    <Input
                      id="lastName"
                      placeholder="Örn: Yılmaz"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ahmet@e-posta.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tcNo">T.C. Kimlik Numarası</Label>
                  <Input
                    id="tcNo"
                    maxLength={11}
                    placeholder="11 Haneli T.C. No"
                    className="text-lg tracking-[0.2em] font-mono"
                    value={formData.tcNo}
                    onChange={(e) => setFormData({ ...formData, tcNo: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon Numarası</Label>
                  <Input
                    id="phone"
                    placeholder="05XX XXX XX XX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <Card className="bg-slate-50 border-dashed border-slate-300">
                  <CardContent className="p-4 flex gap-3 text-slate-500 text-sm">
                    <Shield className="shrink-0 text-primary-navy" size={20} />
                    <p>
                      Verileriniz 6698 sayılı KVKK kapsamında korunmaktadır. Sadece NVİ doğrulaması
                      için kullanılacaktır.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Building2 size={14} /> Konut Tipi
                    </Label>
                    <Select onValueChange={(v) => setFormData({ ...formData, housingType: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartman</SelectItem>
                        <SelectItem value="House">Müstakil Ev</SelectItem>
                        <SelectItem value="House_with_Garden">Bahçeli Ev</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Wallet size={14} /> Mali Durum
                    </Label>
                    <Select onValueChange={(v) => setFormData({ ...formData, financialStatus: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Medium">Orta</SelectItem>
                        <SelectItem value="High">Yüksek</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Checkbox
                      id="hasGarden"
                      checked={formData.hasGarden}
                      onCheckedChange={(v) => setFormData({ ...formData, hasGarden: v as boolean })}
                    />
                    <label htmlFor="hasGarden" className="text-sm font-medium leading-none cursor-pointer">
                      Müsait bir bahçem var
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Checkbox
                      id="training"
                      checked={formData.trainingCompleted}
                      onCheckedChange={(v) => setFormData({ ...formData, trainingCompleted: v as boolean })}
                    />
                    <label htmlFor="training" className="text-sm font-medium leading-none cursor-pointer">
                      Sorumlu Hayvan Sahibi Eğitimimi tamamladım
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Daha Önce Sahiplenilen Hayvan Sayısı</Label>
                  <Input
                    id="experience"
                    type="number"
                    min={0}
                    value={formData.prevExperience}
                    onChange={(e) => setFormData({ ...formData, prevExperience: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-slate-50 p-8 border-t border-slate-100 flex gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setStep(step - 1)}
              >
                Geri
              </Button>
            )}
            <Button
              type={step === 3 ? 'submit' : 'button'}
              disabled={isSubmitting}
              className="flex-[2] bg-primary-navy hover:bg-sky-900 text-white rounded-xl py-6"
              onClick={step < 3 ? handleNext : undefined}
            >
              {isSubmitting ? 'Kayit yapiliyor...' : step === 3 ? 'Kayit Ol ve Profilimi Tamamla' : 'Devam Et'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-8 text-sm text-slate-500">
        Zaten hesabınız var mı?{' '}
        <NavLink to="/giris" className="text-primary-navy font-bold hover:underline">
          Giriş Yapın
        </NavLink>
      </div>
    </div>
  );
}

