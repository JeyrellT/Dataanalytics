import React from 'react';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';
import { prepareRadarData, prepareSoftSkillsData } from '../utils/dataHelpers';

const CompetencySummary = ({ participantData, participant }) => {
  if (!participantData) {
    return (
      <div className="dashboard-card">
        <div className="loading-container" style={{height: '200px'}}>
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando datos...</p>
        </div>
      </div>
    );
  }
  
  const dominiosData = participantData.niveles_por_dominio;
  
  // Función para determinar el color basado en el porcentaje
  const getColorByPercentage = (percentage) => {
    if (percentage >= 85) return 'level-expert';
    if (percentage >= 70) return 'level-advanced';
    if (percentage >= 50) return 'level-intermediate';
    return 'level-basic';
  };
  
  // Función para obtener la clase de nivel
  const getLevelClass = (nivel) => {
    switch(nivel) {
      case 'Experto': return 'level-expert';
      case 'Avanzado': return 'level-advanced';
      case 'Intermedio': return 'level-intermediate';
      default: return 'level-basic';
    }
  };
  
  // Función para generar marcadores de porcentaje
  const renderPercentageMarkers = () => {
    const markers = [];
    for (let i = 20; i <= 80; i += 20) {
      markers.push(
        <div 
          key={i} 
          style={{
            position: 'absolute',
            left: `${i}%`,
            top: '0',
            bottom: '0',
            width: '1px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            zIndex: 1
          }}
        />
      );
    }
    return markers;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="dashboard-card">
        <h3>Competencias por Dominio</h3>
        <div className="space-y-5">
          {Object.keys(dominiosData).map(dominio => (
            <div key={dominio} className="competency-item">
              <div className="competency-header">
                <span className="competency-name">{dominio}</span>
                <div className="competency-stats">
                  <span className="competency-percentage">
                    {Math.round(dominiosData[dominio].porcentaje)}%
                  </span>
                  <span className={`competency-level ${getLevelClass(dominiosData[dominio].nivel)}`}>
                    {dominiosData[dominio].nivel}
                  </span>
                </div>
              </div>
              <div className="progress-bar-container" style={{ position: 'relative' }}>
                {renderPercentageMarkers()}
                <div 
                  className={`progress-bar ${getColorByPercentage(dominiosData[dominio].porcentaje)}`} 
                  style={{ width: `${dominiosData[dominio].porcentaje}%` }}
                />
              </div>
              <div className="progress-points">
                <span>{dominiosData[dominio].puntos} puntos</span>
                <span>Max: {dominiosData[dominio].max_puntos}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Visualización de Competencias</h3>
        <div className="chart-container" style={{ height: '280px', marginBottom: '20px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={prepareRadarData(participant)}>
              <PolarGrid strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar 
                name="Nivel de Competencia" 
                dataKey="value" 
                stroke="#0088FE" 
                fill="#0088FE" 
                fillOpacity={0.6} 
              />
              <Tooltip formatter={(value) => [`${value}%`, 'Nivel']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {participant && participant.habilidades_blandas && (
          <div>
            <h4 className="section-subtitle">Habilidades Blandas</h4>
            <div className="chart-container" style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={70} data={prepareSoftSkillsData(participant)}>
                  <PolarGrid strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="name" fontSize={10} />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar 
                    name="Nivel" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip formatter={(value) => [`${value}%`, 'Nivel']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetencySummary;