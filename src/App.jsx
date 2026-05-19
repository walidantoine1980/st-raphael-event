import React, { useState } from 'react';
import './App.css';
import eventsData from './data/events.json';

const EventCard = ({ event }) => {
  // Générer une URL Google Maps dynamique
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.location}, ${event.zipCode} ${event.city}`)}`;

  return (
    <div className="event-card">
      <div className="event-header">
        <h3 className="event-title">{event.title}</h3>
        <span className="event-classification">{event.classification}</span>
        {event.city === 'Saint-Raphaël' && (
          <span className="priority-tag">⭐ Priorité St-Raphaël</span>
        )}
      </div>
      
      <p className="event-description">{event.description}</p>
      
      <div className="event-details">
        <div className="detail-item">
          <span className="detail-icon">📍</span>
          <span className="detail-text">{event.location}, {event.zipCode} {event.city}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">🕒</span>
          <span className="detail-text">{event.time}</span>
        </div>
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
        🧭 S'y rendre (GPS)
      </a>
    </div>
  );
};

function App() {
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [freeOnly, setFreeOnly] = useState(false);

  const handleExportPDF = () => {
    window.print();
  };

  // Liste unique des catégories pour générer les boutons
  const categories = ['Toutes', ...new Set(eventsData.map(e => e.classification.replace(/^[^\s]+\s/, '')))];

  // Fonction de filtrage
  const filterEvents = (events) => {
    return events.filter(event => {
      const matchCategory = activeCategory === 'Toutes' || event.classification.includes(activeCategory);
      const matchFree = freeOnly ? event.price.toLowerCase().includes('gratuit') || event.price.toLowerCase().includes('libre') : true;
      return matchCategory && matchFree;
    });
  };

  const todayEvents = filterEvents(eventsData.filter(e => e.dateGroup === 'today'));
  const week1Events = filterEvents(eventsData.filter(e => e.dateGroup === 'week1'));
  const week2Events = filterEvents(eventsData.filter(e => e.dateGroup === 'week2'));

  return (
    <div className="app-container" id="agenda-content">
      <header>
        <h1>Agenda Estérel Côte d'Azur</h1>
        <p>Saint-Raphaël, Fréjus, Agay, Roquebrune</p>
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

      <section>
        <h2 className="section-title">✨ AUJOURD'HUI</h2>
        <div className="events-list">
          {todayEvents.length > 0 ? (
            todayEvents.map(event => <EventCard key={event.id} event={event} />)
          ) : (
            <p className="empty-state">Aucun événement ne correspond à vos filtres aujourd'hui.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="section-title">📅 CETTE SEMAINE</h2>
        <div className="events-list">
          {week1Events.length > 0 ? (
            week1Events.map(event => <EventCard key={event.id} event={event} />)
          ) : (
            <p className="empty-state">Aucun événement ne correspond à vos filtres.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="section-title">🔜 SEMAINE PROCHAINE</h2>
        <div className="events-list">
          {week2Events.length > 0 ? (
            week2Events.map(event => <EventCard key={event.id} event={event} />)
          ) : (
            <p className="empty-state">Aucun événement ne correspond à vos filtres.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
