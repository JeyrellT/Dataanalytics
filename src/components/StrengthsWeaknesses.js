import React from 'react';

const StrengthsWeaknesses = ({ perfilesDetallados, participantId }) => {
  if (!perfilesDetallados) {
    return (
      <div className="dashboard-card">
        <div className="loading-container" style={{height: '200px'}}>
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando datos...</p>
        </div>
      </div>
    );
  }
  
  // Extraer fortalezas y debilidades
  const strengths = perfilesDetallados.fortalezas_especificas || [];
  const weaknesses = perfilesDetallados.debilidades_especificas || [];
  
  // Extraer análisis de preguntas diferenciadas
  const differentiators = perfilesDetallados.analisis_diferenciadores ? 
    Object.keys(perfilesDetallados.analisis_diferenciadores).map(pregunta => ({
      pregunta: pregunta,
      nivel: perfilesDetallados.analisis_diferenciadores[pregunta].nivel,
      interpretacion: perfilesDetallados.analisis_diferenciadores[pregunta].interpretacion,
      correcta: perfilesDetallados.analisis_diferenciadores[pregunta].correcta
    })) : [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="dashboard-card">
        <h3 style={{color: 'var(--success-color)'}}>Fortalezas</h3>
        {strengths.length > 0 ? (
          <ul className="space-y-3">
            {strengths.map((strength, index) => (
              <li key={index} className="strength-item">
                {strength}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No se identificaron fortalezas específicas</p>
        )}
        
        {weaknesses.length > 0 && (
          <div className="mt-6">
            <h3 style={{color: 'var(--danger-color)'}}>Debilidades</h3>
            <ul className="space-y-3">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="weakness-item">
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="dashboard-card">
        <h3>Análisis de Preguntas Clave</h3>
        {differentiators.length > 0 ? (
          <div className="space-y-3" style={{maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem'}}>
            {differentiators.map((item, index) => (
              <div 
                key={index} 
                className={`question-item ${item.correcta ? 'correct' : 'incorrect'}`}
              >
                <div className="question-header">
                  <span className="question-name">{item.pregunta}</span>
                  <span className={`question-level ${
                    item.nivel === 'Alto' || item.nivel === 'Destacado' || item.nivel === 'Esperado' ? 'level-high' : 
                    item.nivel === 'Estándar' ? 'level-standard' :
                    'level-low'
                  }`}>
                    {item.nivel}
                  </span>
                </div>
                <p className="question-interpretation">{item.interpretacion}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No hay análisis de preguntas clave disponible</p>
        )}
      </div>
    </div>
  );
};

export default StrengthsWeaknesses;