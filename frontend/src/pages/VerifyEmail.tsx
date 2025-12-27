import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import grioteLogo from '@/assets/griote.svg';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Token de vérification manquant. Veuillez vérifier votre lien.');
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Erreur lors de la vérification');
        }

        const data = await response.json();
        setStatus('success');
        setMessage(data.message || 'Votre email a été vérifié avec succès !');
        
        // Redirection automatique après 3 secondes
        setTimeout(() => {
          navigate('/connexion');
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Une erreur est survenue lors de la vérification de votre email.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-griote-blue to-griote-blue-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 griote-hover">
            <div className="w-12 h-12 bg-griote-white rounded-lg flex items-center justify-center p-2">
              <img src={grioteLogo} alt="Logo Griote" className="w-full h-full" />
            </div>
            <span className="text-2xl font-bold text-griote-white">
              Fondation Griote
            </span>
          </Link>
        </div>

        {/* Card de vérification */}
        <Card className="bg-griote-white border-griote-accent/20 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-griote-blue">
              Vérification de l'email
            </CardTitle>
            <CardDescription className="text-center text-griote-gray-800">
              {status === 'loading' && 'Vérification de votre email en cours...'}
              {status === 'success' && 'Email vérifié avec succès !'}
              {status === 'error' && 'Erreur de vérification'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Loading */}
            {status === 'loading' && (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-16 h-16 text-griote-blue animate-spin mb-4" />
                <p className="text-griote-gray-700 text-center">
                  Veuillez patienter pendant que nous vérifions votre email...
                </p>
              </div>
            )}

            {/* Success */}
            {status === 'success' && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <p className="text-griote-gray-700 text-center mb-2 font-medium">
                  {message}
                </p>
                <p className="text-griote-gray-600 text-center text-sm">
                  Vous allez être redirigé vers la page de connexion dans quelques secondes...
                </p>
              </div>
            )}

            {/* Error */}
            {status === 'error' && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <XCircle className="w-12 h-12 text-red-600" />
                  </div>
                  <p className="text-red-600 text-center mb-2 font-medium">
                    {message}
                  </p>
                  <p className="text-griote-gray-600 text-center text-sm">
                    Si le problème persiste, vous pouvez demander un nouvel email de vérification.
                  </p>
                </div>

                {/* Resend verification email form */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-griote-blue mb-4 text-center">
                    Renvoyer l'email de vérification
                  </h3>
                  <form onSubmit={handleResendVerification} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resendEmail" className="text-griote-blue font-medium">
                        Adresse email
                      </Label>
                      <Input
                        id="resendEmail"
                        type="email"
                        placeholder="votre@email.com"
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        className="border-griote-accent focus:border-griote-blue"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full griote-button"
                      disabled={isResending}
                    >
                      {isResending ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Envoi en cours...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>Renvoyer l'email</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            {status === 'success' && (
              <Button
                onClick={() => navigate('/connexion')}
                className="w-full griote-button"
              >
                Aller à la connexion
              </Button>
            )}
            {status === 'error' && (
              <Button
                onClick={() => navigate('/inscription')}
                variant="outline"
                className="w-full"
              >
                Retour à l'inscription
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Retour à l'accueil */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-griote-white/80 hover:text-griote-accent transition-colors text-sm"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
