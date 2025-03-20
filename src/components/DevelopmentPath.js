import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const DevelopmentPath = ({ rutaData, participantId }) => {
  if (!rutaData) {
    return (
      <div className="dashboard-card">
        <div className="loading-container" style={{height: '200px'}}>
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando datos...</p>
        </div>
      </div>
    );
  }
  
  // Preparar datos para visualizar brechas de desarrollo
  const prepareGapData = () => {
    if (!rutaData.brechas_detalladas) {
      return [];
    }
    
    const brechas = rutaData.brechas_detalladas;
    return Object.keys(brechas).map(dominio => ({
      dominio: dominio,
      actual: brechas[dominio].porcentaje_actual,
      brecha: brechas[dominio].brecha_porcentaje,
      siguiente: brechas[dominio].siguiente_nivel,
      prioridad: brechas[dominio].prioridad,
      tiempo: brechas[dominio].tiempo_estimado,
      z_score: brechas[dominio].z_score
    }));
  };

  // Preparar datos para el desarrollo por fases
  const prepareFaseData = () => {
    if (!rutaData.fases) return [];
    
    const fases = rutaData.fases;
    return Object.keys(fases).map(fase => ({
      name: fase,
      tiempo: parseInt(fases[fase].tiempo_estimado.split('-')[1]),
      actividades: fases[fase].actividades,
      prioridad: fase.includes('Alta') ? 'Alta' : fase.includes('Media') ? 'Media' : 'Baja',
      dominios: fases[fase].dominios || []
    }));
  };
  
  const gapData = prepareGapData();
  const faseData = prepareFaseData();
  
  // Datos para el gráfico de línea de tiempo acumulativo
  const timelineData = [];
  let accumulatedTime = 0;
  
  faseData.forEach(fase => {
    const startWeek = accumulatedTime;
    accumulatedTime += fase.tiempo;
    
    timelineData.push({
      fase: fase.name,
      inicio: startWeek,
      fin: accumulatedTime,
      semanas: fase.tiempo,
      prioridad: fase.prioridad
    });
  });
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dashboard-card">
          <h3>Resumen del Plan</h3>
          <div className="development-summary">
            <div className="info-box info-box-blue">
              <div className="info-label">Perfil Actual</div>
              <div className="info-value">{rutaData.perfil}</div>
            </div>
            <div className="info-box info-box-green">
              <div className="info-label">Nivel Actual</div>
              <div className="info-value">{rutaData.nivel_actual}</div>
            </div>
            <div className="info-box info-box-purple">
              <div className="info-label">Brecha Promedio</div>
              <div className="info-value">{Math.round(rutaData.brecha_promedio)}%</div>
            </div>
            <div className="info-box info-box-yellow">
              <div className="info-label">Tiempo Estimado Total</div>
              <div className="info-value">{rutaData.tiempo_total_estimado}</div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card md:col-span-2">
          <h3>Línea de Tiempo de Desarrollo</h3>
          <div className="chart-container" style={{height: '200px'}}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={timelineData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="inicio" domain={[0, accumulatedTime]} label={{ value: 'Semanas', position: 'insideBottom', offset: -5 }} />
                <YAxis hide={true} />
                <Tooltip 
                  formatter={(value, name, props) => {
                    if (name === 'fin') return [`Semana ${value}`, 'Fin'];
                    return null;
                  }}
                  labelFormatter={(value) => `Semana ${value}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="fin" 
                  name="Tiempo" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
                {timelineData.map((entry, index) => (
                  <Area 
                    key={`area-${index}`}
                    type="monotone" 
                    dataKey="fin" 
                    data={[entry]} 
                    name={entry.fase}
                    stroke={
                      entry.prioridad === 'Alta' ? '#ef4444' : 
                      entry.prioridad === 'Media' ? '#f59e0b' : '#22c55e'
                    } 
                    fill={
                      entry.prioridad === 'Alta' ? '#ef4444' : 
                      entry.prioridad === 'Media' ? '#f59e0b' : '#22c55e'
                    } 
                    fillOpacity={0.6}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3 mt-4">
            {Object.keys(rutaData.fases).map(fase => (
              <div 
                key={fase}
                className={`phase-item ${
                  fase.includes('Alta') ? 'phase-high' : 
                  fase.includes('Media') ? 'phase-medium' : 
                  'phase-low'
                }`}
              >
                <div className="phase-header">
                  <div className="phase-title">{fase}</div>
                  <div className="phase-time">{rutaData.fases[fase].tiempo_estimado}</div>
                </div>
                <p className="phase-description">{rutaData.fases[fase].enfoque}</p>
                <ul className="phase-activities">
                  {rutaData.fases[fase].actividades.map((actividad, index) => (
                    <li key={index}>{actividad}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="dashboard-card">
        <h3>Análisis Detallado de Brechas</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Dominio</th>
                <th className="text-center">Nivel Actual</th>
                <th className="text-center">% Actual</th>
                <th className="text-center">Próximo Nivel</th>
                <th className="text-center">Brecha %</th>
                <th className="text-center">Z-Score</th>
                <th className="text-center">Prioridad</th>
                <th className="text-center">Tiempo Estimado</th>
              </tr>
            </thead>
            <tbody>
              {gapData.map((item, index) => (
                <tr key={index}>
                  <td>{item.dominio}</td>
                  <td className="text-center">
                    <span className={`competency-level ${
                      item.actual >= 85 ? 'level-expert' :
                      item.actual >= 65 ? 'level-advanced' :
                      item.actual >= 40 ? 'level-intermediate' : 'level-basic'
                    }`}>
                      {item.actual >= 85 ? 'Experto' :
                       item.actual >= 65 ? 'Avanzado' :
                       item.actual >= 40 ? 'Intermedio' : 'Básico'}
                    </span>
                  </td>
                  <td className="text-center">{Math.round(item.actual)}%</td>
                  <td className="text-center">{item.siguiente}</td>
                  <td className="text-center">{Math.round(item.brecha)}%</td>
                  <td className="text-center">{item.z_score.toFixed(2)}</td>
                  <td className="text-center">
                    <span className={`priority-badge ${
                      item.prioridad === 'Alta' ? 'priority-high' :
                      item.prioridad === 'Media' ? 'priority-medium' : 'priority-low'
                    }`}>
                      {item.prioridad}
                    </span>
                  </td>
                  <td className="text-center">{item.tiempo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="chart-container mt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={gapData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dominio" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value, name) => [
                `${Math.round(value)}%`, 
                name === 'actual' ? 'Nivel Actual' : 'Brecha'
              ]} />
              <Legend />
              <Bar name="Nivel Actual" dataKey="actual" stackId="a" fill="#0088FE" />
              <Bar name="Brecha" dataKey="brecha" stackId="a" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentPath;