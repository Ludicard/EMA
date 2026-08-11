import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Shield, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary selection:text-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                E
              </div>
              <span className="font-bold text-xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>EMA</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-full font-medium transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-8 animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-purple-600"></span>
          El futuro de la gestión empresarial
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl">
          Gestiona tu empresa con <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">inteligencia y velocidad</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
          Enterprise Management Assistant (EMA) es la plataforma modular definitiva para escalar tus operaciones. Comienza hoy mismo con una base sólida.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/register" 
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Comenzar Gratis <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/login" 
            className="flex items-center justify-center bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-semibold text-lg transition-all"
          >
            Ya tengo una cuenta
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left w-full">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Arquitectura Modular</h3>
            <p className="text-slate-600">Diseñado para crecer. Agrega módulos de negocio únicamente cuando tu empresa los necesite.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Rendimiento Extremo</h3>
            <p className="text-slate-600">Construido con las últimas tecnologías para garantizar una experiencia fluida e instantánea.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Seguridad Empresarial</h3>
            <p className="text-slate-600">Protección de datos de primer nivel con autenticación robusta y roles de usuario avanzados.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
