// Preparar datos para gráfico de radar de dominios
export const prepareRadarData = (participant) => {
    if (!participant) return [];
    
    return [
      { name: 'Fundamentos', value: participant.dominios.fundamentos },
      { name: 'Excel', value: participant.dominios.habilidades },
      { name: 'BD', value: participant.dominios.conceptos },
      { name: 'Visualización', value: participant.dominios.visualización },
      { name: 'Power BI', value: participant.dominios.conocimientos }
    ];
  };
  
  // Preparar datos para gráfico de radar de habilidades blandas
  export const prepareSoftSkillsData = (participant) => {
    if (!participant || !participant.habilidades_blandas) return [];
    
    return [
      { name: 'Pensamiento Analítico', value: participant.habilidades_blandas.pensamiento_analítico },
      { name: 'Orientación Visual', value: participant.habilidades_blandas.orientación_visual },
      { name: 'Pens. Sistemático', value: participant.habilidades_blandas.pensamiento_sistemático },
      { name: 'Perspectiva Usuario', value: participant.habilidades_blandas.perspectiva_de_usuario },
      { name: 'Optimización', value: participant.habilidades_blandas.mentalidad_de_optimización }
    ];
  };
  
  // Preparar datos para benchmarking de perfiles profesionales
  export const prepareBenchmarkingData = (benchmarkData) => {
    if (!benchmarkData) return [];
    
    return Object.keys(benchmarkData).map(role => ({
      name: role.replace('_', ' ').toUpperCase(),
      match: benchmarkData[role].match_promedio,
      calificacion: benchmarkData[role].calificacion
    }));
  };
  
  // Preparar datos por dominio para un perfil profesional específico
  export const prepareDomainMatchData = (benchmarkData, profileType) => {
    if (!benchmarkData || !benchmarkData[profileType]) return [];
    
    const matchesData = benchmarkData[profileType].matches_por_dominio;
    
    return Object.keys(matchesData).map(domain => ({
      name: domain.split(' ').pop(),
      match: matchesData[domain].match,
      valor_participante: matchesData[domain].valor_participante,
      valor_referencia: matchesData[domain].valor_referencia
    }));
  };
  
  // Preparar datos para el desarrollo por fases
  export const prepareFaseData = (fases) => {
    if (!fases) return [];
    
    return Object.keys(fases).map(fase => ({
      name: fase,
      tiempo: parseInt(fases[fase].tiempo_estimado.split('-')[1]),
      actividades: fases[fase].actividades,
      prioridad: fase.includes('Alta') ? 'Alta' : fase.includes('Media') ? 'Media' : 'Baja',
      dominios: fases[fase].dominios
    }));
  };
  
  // Preparar datos para visualizar brechas de desarrollo
  export const prepareGapData = (brechas) => {
    if (!brechas) return [];
    
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
  
  // Preparar datos de posición relativa en el grupo
  export const prepareRelativePositionData = (posiciones) => {
    if (!posiciones) return [];
    
    return Object.keys(posiciones).map(dominio => ({
      dominio: dominio,
      valor: posiciones[dominio].valor,
      promedio: posiciones[dominio].promedio_grupo,
      z_score: posiciones[dominio].z_score,
      posicion: posiciones[dominio].posicion,
      percentil: posiciones[dominio].percentil
    }));
  };