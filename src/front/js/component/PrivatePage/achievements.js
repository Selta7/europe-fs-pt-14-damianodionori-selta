import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal, faTrophy, faCrown } from '@fortawesome/free-solid-svg-icons';


const Achievements = () => {

  const [savedItineraries, setSavedItineraries] = useState(0);
  
  const checkAndDisplayBadges = () => {
    const badges = [];

    if (savedItineraries >= 1) {
      badges.push(
        <div key={1}>
          <p>Congratulations! You've earned a badge for saving 1 itinerary.</p>
          <FontAwesomeIcon icon={faMedal} />
        </div>
      );
    }
    if (savedItineraries >= 3) {
      badges.push(
        <div key={3}>
          <p>Congratulations! You've earned an additional badge for saving 3 itineraries.</p>
          <FontAwesomeIcon icon={faTrophy} />
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