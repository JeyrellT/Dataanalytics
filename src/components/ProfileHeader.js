import React from 'react';

const ProfileHeader = ({ participantData, detalles }) => {
  if (!participantData || !detalles) {
    return (
      <div className="dashboard-card">
        <div className="flex justify-center items-center h-32">
          <div className="loading-spinner"></div>
          <p className="ml-4">Cargando datos del perfil...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-header">
      <div className="profile-header-content">
        <div className="profile-info">
          <div className="profile-header-title">
            <h2>{participantData.Perfil}</h2>
            <span className="profile-match-badge">
              Match: {detalles.match_exactitud}%
            </span>
          </div>
          <p className="profile-description">{detalles.descripcion}</p>
          
          <div className="profile-details-grid">
            <div className="profile-detail-box">
              <div className="profile-detail-label">ID Participante</div>
              <div className="profile-detail-value">{participantData.ID}</div>
            </div>
            <div className="profile-detail-box">
              <div className="profile-detail-label">Rol / Cargo</div>
              <div className="profile-detail-value">{participantData.Rol_Cargo}</div>
            </div>
            <div className="profile-detail-box">
              <div className="profile-detail-label">Sector / Industria</div>
              <div className="profile-detail-value">{participantData.Sector_Industria}</div>
            </div>
            <div className="profile-detail-box">
              <div className="profile-detail-label">Nivel Formación</div>
              <div className="profile-detail-value">{participantData.Nivel_Formacion}</div>
            </div>
          </div>
          
          <div className="profile-approach">
            <div className="profile-approach-label">Enfoque Recomendado:</div>
            <div className="profile-approach-content">{detalles.enfoque_recomendado}</div>
          </div>
        </div>
        
        <div className="profile-score">
          <div className="score-badge">
            {participantData.Total_Puntos}
          </div>
          <div className="score-label">Puntuación Total</div>
          <div className="evaluation-date">
            Evaluado: {new Date(participantData.Fecha_Evaluacion).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;