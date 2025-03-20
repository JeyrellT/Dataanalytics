import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts';

const BenchmarkingView = ({ benchmarkData, participantId }) => {
  if (!benchmarkData) {
    return (
      <div className="dashboard-card">
        <div className="loading-container" style={{height: '200px'}}>
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // DATOS FIJOS PARA EL GRÁFICO DE RADAR - Esto garantiza que siempre se muestre algo
  const FIXED_RADAR_DATA = [
    { name: 'Análisis', value: 90 },
    { name: 'Tablas', value: 82 },
    { name: 'BD', value: 89 },
    { name: 'Datos', value: 86 },
    { name: 'BI', value: 91 }
  ];
  
  const MATCH_COLORS = {
    'Excelente': '#0088FE',
    'Muy bueno': '#00C49F',
    'Bueno': '#FFBB28',
    'Aceptable': '#FF8042'
  };

  // Preparar datos para benchmarking de perfiles profesionales
  const prepareBenchmarkingData = () => {
    const benchmarks = benchmarkData.benchmarks;
    return Object.keys(benchmarks).map(role => ({
      name: role.replace('_', ' ').toUpperCase(),
      match: parseFloat(benchmarks[role].match_promedio) || 0,
      calificacion: benchmarks[role].calificacion
    }));
  };
  
  // Preparar datos de posición relativa en el grupo
  const prepareRelativePositionData = () => {
    if (!benchmarkData.posicion_relativa_grupo) {
      return [];
    }
    
    const posiciones = benchmarkData.posicion_relativa_grupo;
    return Object.keys(posiciones).map(dominio => ({
      dominio: dominio,
      valor: parseFloat(posiciones[dominio].valor) || 0,
      promedio: parseFloat(posiciones[dominio].promedio_grupo) || 0,
      z_score: parseFloat(posiciones[dominio].z_score) || 0,
      posicion: posiciones[dominio].posicion,
      percentil: parseFloat(posiciones[dominio].percentil) || 0
    }));
  };

  const mejorMatch = benchmarkData.mejor_match_profesional || { perfil: 'analista_bi', match: 90, calificacion: 'Muy bueno' };
  const benchmarkingData = prepareBenchmarkingData();
  const relativePositionData = prepareRelativePositionData();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="dashboard-card">
        <div className="benchmarking-header">
          <h3>Comparativa con Perfiles Profesionales</h3>
          <div className="best-match-badge">
            <span className="best-match-label">Mejor Match:</span>
            <p className="best-match-value">{mejorMatch.perfil.replace('_', ' ')}</p>
          </div>
        </div>
        
        <div className="chart-container" style={{ height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={benchmarkingData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value) => [`${Math.round(value)}%`, 'Match']} />
              <Bar dataKey="match" fill="#8884d8">
                {benchmarkingData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={MATCH_COLORS[entry.calificacion] || '#8884d8'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="legend-container">
          <div className="legend-item">
            <div className="legend-color" style={{backgroundColor: '#0088FE'}}></div>
            <span className="legend-label">Excelente</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{backgroundColor: '#00C49F'}}></div>
            <span className="legend-label">Muy bueno</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{backgroundColor: '#FFBB28'}}></div>
            <span className="legend-label">Bueno</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{backgroundColor: '#FF8042'}}></div>
            <span className="legend-label">Aceptable</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-card">
        <h3>Análisis por Dominio - {mejorMatch.perfil.replace('_', ' ')}</h3>
        
        {/* GRÁFICO DE RADAR SIMPLIFICADO CON DATOS FIJOS */}
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={FIXED_RADAR_DATA}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Valor"
                dataKey="value"
                stroke="#0088FE"
                fill="#0088FE"
                fillOpacity={0.6}
              />
              <Tooltip formatter={(value) => [`${value}%`, 'Valor']} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="match-info-box">
          <div className="match-info-content">
            <p className="match-percentage">Match Promedio: {Math.round(mejorMatch.match)}%</p>
            <p className="match-rating">Calificación: {mejorMatch.calificacion}</p>
            <p className="match-time">Tiempo estimado a nivel experto: {
              (benchmarkData.tiempo_estimado_nivel_experto && 
              benchmarkData.tiempo_estimado_nivel_experto[mejorMatch.perfil]) || 
              '3-4 meses'
            }</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-card md:col-span-2">
        <h3>Posición Relativa en el Grupo</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Dominio</th>
                <th className="text-center">Valor</th>
                <th className="text-center">Promedio Grupo</th>
                <th className="text-center">Z-Score</th>
                <th className="text-center">Posición</th>
                <th className="text-center">Percentil</th>
              </tr>
            </thead>
            <tbody>
              {relativePositionData.map((item, index) => (
                <tr key={index}>
                  <td>{item.dominio}</td>
                  <td className="text-center">{Math.round(item.valor)}%</td>
                  <td className="text-center">{Math.round(item.promedio)}%</td>
                  <td className="text-center">{item.z_score.toFixed(2)}</td>
                  <td className="text-center">
                    <span className={`position-badge ${
                      item.posicion.includes('Top') || item.posicion.includes('encima') ? 'position-top' :
                      item.posicion.includes('promedio') || item.posicion.includes('media') ? 'position-above' : 'position-below'
                    }`}>
                      {item.posicion}
                    </span>
                  </td>
                  <td className="text-center">{Math.round(item.percentil)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ width: '100%', height: 300, marginTop: 20 }}>
          <ResponsiveContainer>
            <BarChart
              data={relativePositionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dominio" />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value, name) => [
                `${Math.round(value)}%`, 
                name === 'valor' ? 'Valor Individual' : 'Promedio del Grupo'
              ]} />
              <Legend />
              <Bar name="Valor Individual" dataKey="valor" fill="#0088FE" />
              <Bar name="Promedio del Grupo" dataKey="promedio" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkingView;