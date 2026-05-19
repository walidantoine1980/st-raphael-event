import React, { useState } from 'react';
import './App.css';
import eventsData from './data/events.json';

const EventCard = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Générer une URL Google Maps dynamique
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.location}, ${event.zipCode} ${event.city}`)}`;

  // Formater la date en français
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="event-card">
      <div className="event-header">
        <h3 className="event-title">{event.title}</h3>
        <div className="tags-row">
          <span className="event-classification">{event.classification}</span>
          {event.city === 'Saint-Raphaël' && (
            <span className="priority-tag">⭐ Priorité St-Raphaël</span>
          )}
        </div>
      </div>
      
      {/* Informations de base toujours visibles */}
      <div className="basic-info">
        <div className="info-line">
          <span className="info-icon">📅</span> 
          <span><strong style={{textTransform: 'capitalize'}}>{formattedDate}</strong> à {event.time}</span>
        </div>
        <div className="info-line">
          <span className="info-icon">📍</span> 
          <span>{event.location}, {event.city}</span>
        </div>
      </div>

      <button 
        className="deep-dive-btn no-print" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '▲ Réduire' : '🔍 En savoir plus (Deep Dive)'}
      </button>
      
      {/* Tiroir Deep Dive (Détails) */}
      <div className={`deep-dive-content ${isExpanded ? 'expanded' : ''}`}>
        <p className="event-description">{event.description}</p>
        
        <div className="event-details">
          <div className="detail-item">
            <span className="detail-icon">🎟️</span>
            <span className="detail-text">{event.price}</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">🚗</span>
            <span className="detail-text">
              {event.access.parking} <br/>
              {event.access.transport} <br/>
              {event.access.pmr}
            </span>
          </div>
        </div>

        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="gps-btn no-print">
          🧭 S'y rendre (GPS Google Maps)
        </a>
      </div>
      
      {/* Fallback d'impression (Toujours afficher les détails sur PDF) */}
      <div className="print-only-details">
        <p className="event-description">{event.description}</p>
        <p><strong>Prix :</strong> {event.price}</p>
        <p><strong>Accès :</strong> {event.access.pmr}, {event.access.parking}</p>
      </div>
    </div>
  );
};

function App() {
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [freeOnly, setFreeOnly] = useState(false);

  const handleExportPDF = () => {
    window.print();
  };

  // Liste unique des catégories
  const categories = ['Toutes', ...new Set(eventsData.map(e => e.classification.replace(/^[^\s]+\s/, '')))];

  // Date actuelle normalisée à minuit pour les comparaisons
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fonction pour calculer la différence en jours
  const getDiffDays = (dateString) => {
    const eventDate = new Date(dateString);
    eventDate.setHours(0,0,0,0);
    const diffTime = eventDate - today;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Tri de base et filtrage
  let filteredEvents = eventsData
    .filter(event => {
      const matchCategory = activeCategory === 'Toutes' || event.classification.includes(activeCategory);
      const matchFree = freeOnly ? event.price.toLowerCase().includes('gratuit') || event.price.toLowerCase().includes('libre') : true;
      const daysDiff = getDiffDays(event.date);
      // On exclut les événements passés
      return matchCategory && matchFree && daysDiff >= 0;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Tri chronologique

  // Répartition dynamique sur 4 semaines
  const todayEvents = filteredEvents.filter(e => getDiffDays(e.date) === 0);
  const week1Events = filteredEvents.filter(e => getDiffDays(e.date) >= 1 && getDiffDays(e.date) <= 7);
  const week2Events = filteredEvents.filter(e => getDiffDays(e.date) > 7 && getDiffDays(e.date) <= 14);
  const week3Events = filteredEvents.filter(e => getDiffDays(e.date) > 14 && getDiffDays(e.date) <= 21);
  const week4Events = filteredEvents.filter(e => getDiffDays(e.date) > 21 && getDiffDays(e.date) <= 28);

  const renderSection = (title, events) => {
    if (events.length === 0) return null; // Ne pas afficher la section si vide
    return (
      <section>
        <h2 className="section-title">{title}</h2>
        <div className="events-list">
          {events.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      </section>
    );
  };

  return (
    <div className="app-container" id="agenda-content">
      <header>
        <h1>Agenda Estérel Côte d'Azur</h1>
        <p>Visibilité 4 Semaines - Saint-Raphaël & Agglomération</p>
      </header>

      <div className="filters-container no-print">
        <span className="filters-title">🎯 Affiner votre séjour</span>
        <div className="filter-pills">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <button 
            className={`filter-btn free-btn ${freeOnly ? 'active' : ''}`}
            onClick={() => setFreeOnly(!freeOnly)}
          >
            💸 Gratuit uniquement
          </button>
        </div>
      </div>

      <div className="export-btn-container no-print">
        <button className="export-btn" onClick={handleExportPDF}>
          📥 Enregistrer en PDF
        </button>
      </div>

      {renderSection("✨ AUJOURD'HUI", todayEvents)}
      {renderSection("📅 LES 7 PROCHAINS JOURS", week1Events)}
      {renderSection("🔜 SEMAINE 2", week2Events)}
      {renderSection("🔜 SEMAINE 3", week3Events)}
      {renderSection("🔜 SEMAINE 4", week4Events)}
      
      {filteredEvents.length === 0 && (
        <p className="empty-state">Aucun événement à venir ne correspond à vos filtres.</p>
      )}
    </div>
  );
}

export default App;
