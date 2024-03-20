import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal, faTrophy, faCrown } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/achievements.css';


const Achievements = ({ savedItineraries }) => {

  
  
  const checkAndDisplayBadges = () => {
    const badges = [];

    if (savedItineraries >= 1) {
      badges.push(
        <div key={1}>
          <p>Congratulations! You've earned a badge for saving 1 itinerary.</p>
          <div id="boulder-badge">
          <div class="badge">
            <div class="part part-1"></div>
            <div class="part part-2"></div>
            <div class="part part-3"></div>
            <div class="part part-4"></div>
            <div class="part part-shade"></div>
          </div>
          <h1>Boulder badge</h1>
        </div>
        </div>
      );
    }
    if (savedItineraries >= 3) {
      badges.push(
        <div key={3}>
          <p>Congratulations! You've earned an additional badge for saving 3 itineraries.</p>
          <div id="cascade-badge">
          <div class="badge">
            <div class="part part-1"></div>
            <div class="part part-2"></div>
            <div class="part part-3"></div>
            <div class="part part-4"></div>
            <div class="part part-5"></div>
            <div class="part part-6"></div>
            <div class="part part-7"></div>
            <div class="part part-8"></div>
          </div>
          <h1>Cascade badge</h1>
        </div>
        </div>
      );
    }
    if (savedItineraries >= 5) {
      badges.push(
        <div key={5}>
          <p>Congratulations! You've earned an additional badge for saving 5 itineraries.</p>
          <FontAwesomeIcon icon={faCrown} />
        </div>
      );
    }

    return badges.length > 0 ? badges : <p>No achievements yet.</p>;
  };

  return (
    <div>
      <p>Total Saved Itineraries: {savedItineraries}</p>
      {checkAndDisplayBadges()}
    </div>
  );
};


export default Achievements;