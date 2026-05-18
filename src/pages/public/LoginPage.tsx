import { useState, type FormEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PawPrint, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { routeForRole, signIn } from '@/lib/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const profile = await signIn(email, password);
      toast.success('Giris basarili.');
      navigate(routeForRole(profile?.role));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Giris yapilamadi.');
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

      <Card className="w-full max-w-md border-slate-200 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary-navy text-white p-8">
          <CardTitle className="text-2xl font-display">Giris Yap</CardTitle>
          <CardDescription className="text-slate-300">
            SAMIS platformuna erismek icin bilgilerinizi girin.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresi</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@e-posta.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Sifre</Label>
                  <button type="button" className="text-xs text-primary-navy hover:underline">Sifremi Unuttum</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex gap-3 text-xs text-slate-500">
              <AlertCircle className="shrink-0 text-amber-500" size={16} />
              <p>
                Kamu gorevlisiyseniz lutfen kurumsal e-posta adresiniz veya e-Devlet secenegi ile giris yapin.
              </p>
            </div>
          </CardContent>

          <CardFooter className="p-8 pt-0 flex flex-col gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-navy hover:bg-sky-900 text-white rounded-xl py-6 text-lg font-bold"
            >
              {isSubmitting ? 'Giris yapiliyor...' : 'Giris Yap'}
            </Button>
            <div className="relative w-full text-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <span className="relative bg-white px-4 text-xs text-slate-400 uppercase">Veya</span>
            </div>
            <Button type="button" variant="outline" className="w-full rounded-xl border-slate-200 hover:bg-slate-50 py-6 text-slate-600 flex items-center justify-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/E-Devlet_Logo.png" alt="e-Devlet" className="h-5 grayscale hover:grayscale-0 transition-all" />
              e-Devlet ile Giris Yap (Yakinda)
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-8 text-sm text-slate-500">
        Hesabiniz yok mu?{' '}
        <NavLink to="/kayit" className="text-primary-navy font-bold hover:underline">
          Yeni Kayit Olusturun
        </NavLink>
      </div>
    </div>
  );
}
