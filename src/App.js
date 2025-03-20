import React, { useState, useEffect } from 'react';
import ProfileHeader from './components/ProfileHeader';
import CompetencySummary from './components/CompetencySummary';
import StrengthsWeaknesses from './components/StrengthsWeaknesses';
import BenchmarkingView from './components/BenchmarkingView';
import DevelopmentPath from './components/DevelopmentPath';
import './styles.css';

function App() {
  // Estados para almacenar los datos
  const [perfiles, setPerfiles] = useState(null);
  const [dominios, setDominios] = useState(null);
  const [benchmarking, setBenchmarking] = useState(null);
  const [datosSimplificados, setDatosSimplificados] = useState(null);
  const [perfilesDetallados, setPerfilesDetallados] = useState(null);
  const [rutasDesarrollo, setRutasDesarrollo] = useState(null);
  const [analisisGeneral, setAnalisisGeneral] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParticipant, setSelectedParticipant] = useState('3');
  const [activeTab, setActiveTab] = useState('perfil');

  // Colores para los gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const NIVEL_COLORS = {
    'Básico': '#FF8042',
    'Intermedio': '#FFBB28',
    'Avanzado': '#00C49F',
    'Experto': '#0088FE',
    'Experto+': '#8884d8'
  };
  
  const MATCH_COLORS = {
    'Excelente': '#0088FE',
    'Muy bueno': '#00C49F',
    'Bueno': '#FFBB28',
    'Aceptable': '#FF8042'
  };

  // Función para cargar los datos
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar todos los archivos JSON
        const [
          perfilesData,
          dominiosData,
          benchmarkingData,
          datosSimplificadosData,
          perfilesDetalladosData,
          rutasDesarrolloData,
          analisisGeneralData
        ] = await Promise.all([
          fetch('/data/analisis_perfiles.json').then(res => res.json()),
          fetch('/data/analisis_por_dominio.json').then(res => res.json()),
          fetch('/data/benchmarking.json').then(res => res.json()),
          fetch('/data/datos_simplificados.json').then(res => res.json()),
          fetch('/data/perfiles_detallados.json').then(res => res.json()),
          fetch('/data/rutas_desarrollo.json').then(res => res.json()),
          fetch('/data/analisis_general.json').then(res => res.json())
        ]);

        // Establecer los datos en el estado
        setPerfiles(perfilesData);
        setDominios(dominiosData);
        setBenchmarking(benchmarkingData);
        setDatosSimplificados(datosSimplificadosData);
        setPerfilesDetallados(perfilesDetalladosData);
        setRutasDesarrollo(rutasDesarrolloData);
        setAnalisisGeneral(analisisGeneralData);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    loadData();
  }, []);

  // Renderizar carga o dashboard
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const currentParticipant = datosSimplificados.find(p => p.id.toString() === selectedParticipant.toString());

  return (
    <div className="container mx-auto min-h-screen p-4 pb-10">
      <header className="dashboard-header">
        <h1>Dashboard Individual de Competencias en BI</h1>
        <p>Análisis detallado de perfiles, habilidades y rutas de desarrollo personalizadas</p>
      </header>
      
      {/* Selector de participante */}
      <div className="participant-selector">
        <label>Seleccionar Participante:</label>
        <select
          value={selectedParticipant}
          onChange={(e) => setSelectedParticipant(e.target.value)}
        >
          {datosSimplificados && datosSimplificados.map(p => (
            <option key={p.id} value={p.id.toString()}>
              Participante {p.id} - {p.perfil}
            </option>
          ))}
        </select>
      </div>
      
      {/* Cabecera de perfil */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-info">
            <div className="profile-header-title">
              <h2>{analisisGeneral[selectedParticipant].Perfil}</h2>
              <span className="profile-match-badge">
                Match: {perfilesDetallados[selectedParticipant].match_exactitud}%
              </span>
            </div>
            <p className="profile-description">{perfilesDetallados[selectedParticipant].descripcion}</p>
            
            <div className="profile-details-grid">
              <div className="profile-detail-box">
                <div className="profile-detail-label">ID Participante</div>
                <div className="profile-detail-value">{analisisGeneral[selectedParticipant].ID}</div>
              </div>
              <div className="profile-detail-box">
                <div className="profile-detail-label">Rol / Cargo</div>
                <div className="profile-detail-value">{analisisGeneral[selectedParticipant].Rol_Cargo}</div>
              </div>
              <div className="profile-detail-box">
                <div className="profile-detail-label">Sector / Industria</div>
                <div className="profile-detail-value">{analisisGeneral[selectedParticipant].Sector_Industria}</div>
              </div>
              <div className="profile-detail-box">
                <div className="profile-detail-label">Nivel Formación</div>
                <div className="profile-detail-value">{analisisGeneral[selectedParticipant].Nivel_Formacion}</div>
              </div>
            </div>
            
            <div className="profile-approach">
              <div className="profile-approach-label">Enfoque Recomendado:</div>
              <div className="profile-approach-content">{perfilesDetallados[selectedParticipant].enfoque_recomendado}</div>
            </div>
          </div>
          
          <div className="profile-score">
            <div className="score-badge">
              {analisisGeneral[selectedParticipant].Total_Puntos}
            </div>
            <div className="score-label">Puntuación Total</div>
            <div className="evaluation-date">
              Evaluado: {new Date(analisisGeneral[selectedParticipant].Fecha_Evaluacion).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Navegación */}
      <div className="nav-tabs-container">
        <button 
          className={`nav-tab ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          Competencias
        </button>
        <button 
          className={`nav-tab ${activeTab === 'fortalezas' ? 'active' : ''}`}
          onClick={() => setActiveTab('fortalezas')}
        >
          Fortalezas y Debilidades
        </button>
        <button 
          className={`nav-tab ${activeTab === 'benchmark' ? 'active' : ''}`}
          onClick={() => setActiveTab('benchmark')}
        >
          Benchmarking
        </button>
        <button 
          className={`nav-tab ${activeTab === 'desarrollo' ? 'active' : ''}`}
          onClick={() => setActiveTab('desarrollo')}
        >
          Plan de Desarrollo
        </button>
      </div>
      
      {/* Contenido según pestaña activa */}
      <div className="tab-content">
        {activeTab === 'perfil' && 
          <CompetencySummary 
            participantData={analisisGeneral[selectedParticipant]} 
            participant={currentParticipant} 
          />
        }
        {activeTab === 'fortalezas' && 
          <StrengthsWeaknesses 
            perfilesDetallados={perfilesDetallados[selectedParticipant]}
            participantId={selectedParticipant} 
          />
        }
        {activeTab === 'benchmark' && 
          <BenchmarkingView 
            benchmarkData={benchmarking[selectedParticipant]}
            participantId={selectedParticipant} 
          />
        }
        {activeTab === 'desarrollo' && 
          <DevelopmentPath 
            rutaData={rutasDesarrollo[selectedParticipant]}
            participantId={selectedParticipant} 
          />
        }
      </div>
      
      <footer className="dashboard-footer">
        Dashboard de Evaluación de Competencias en BI &copy; 2025
      </footer>
    </div>
  );
}

export default App;