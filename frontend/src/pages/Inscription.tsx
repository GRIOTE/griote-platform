import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import grioteLogo from '@/assets/griote.svg';

const Inscription = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setIsLoading(false);
      return;
    }

    // Vérifier la complexité du mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(formData.password)) {
      setError('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)');
      setIsLoading(false);
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(true);
      toast.success('Inscription réussie ! Veuillez vérifier votre email.');
      
      setTimeout(() => {
        navigate('/connexion');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
      toast.error(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-griote-blue to-griote-blue-dark flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 griote-hover">
            <div className="w-12 h-12 bg-griote-white rounded-lg flex items-center justify-center p-2">
              <img src={grioteLogo} alt="Logo Griote" className="w-full h-full" />
            </div>
            <span className="text-2xl font-bold text-griote-white">
              Fondation Griote
            </span>
          </Link>
          <p className="text-griote-white/80 mt-4 text-lg">
            Rejoignez la communauté des chercheurs africains
          </p>
        </div>

        {/* Formulaire d'inscription */}
        <Card className="bg-griote-white border-griote-accent/20 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-griote-blue">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-center text-griote-gray-800">
              Remplissez les informations ci-dessous pour créer votre compte
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Inscription réussie ! Un email de vérification vous a été envoyé. Vous serez redirigé vers la page de connexion...
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-griote-blue font-medium">
                    Prénom
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-griote-blue/60" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Votre prénom"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="pl-12 border-griote-blue/20 focus:border-griote-accent focus:ring-griote-accent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-griote-blue font-medium">
                    Nom
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-griote-blue/60" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Votre nom"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="pl-12 border-griote-blue/20 focus:border-griote-accent focus:ring-griote-accent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-griote-blue font-medium">
                  Adresse e-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-griote-blue/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-12 border-griote-blue/20 focus:border-griote-accent focus:ring-griote-accent"
                    required
                  />
                </div>
              </div>

              {/* Mots de passe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-griote-blue font-medium">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-griote-blue/60" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Votre mot de passe"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-12 pr-12 border-griote-blue/20 focus:border-griote-accent focus:ring-griote-accent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-griote-blue/60 hover:text-griote-blue"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-griote-gray-600">
                    Min. 8 caractères avec majuscule, minuscule, chiffre et symbole
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-griote-blue font-medium">
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-griote-blue/60" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirmez votre mot de passe"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-12 pr-12 border-griote-blue/20 focus:border-griote-accent focus:ring-griote-accent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-griote-blue/60 hover:text-griote-blue"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full griote-button"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-griote-blue border-t-transparent rounded-full animate-spin"></div>
                    <span>Création du compte...</span>
                  </div>
                ) : (
                  'Créer mon compte'
                )}
              </Button>

              <div className="text-center text-sm text-griote-gray-800">
                Vous avez déjà un compte ?{' '}
                <Link
                  to="/connexion"
                  className="text-griote-blue hover:text-griote-blue-dark font-medium transition-colors"
                >
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </form>
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

export default Inscription;