import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal, faTrophy, faCrown } from '@fortawesome/free-solid-svg-icons';

const Achievements = () => {

  const [savedItineraries, setSavedItineraries] = useState(0);

  useEffect(() => {
    const fetchSavedItinerariesCount = async () => {
      try {
        const response = await fetch('/api/getSavedItinerariesCount');
        if (response.ok) {
          const data = await response.json();
          return data.savedItinerariesCount;
        } else {
          throw new Error('Failed to fetch saved itineraries count');
        }
      } catch (error) {
        console.error('Error fetching saved itineraries count:', error.message);
        return 0;
      }
    };

    // Call the function to fetch saved itineraries count and update the state
    fetchSavedItinerariesCount()
      .then(count => setSavedItineraries(count))
      .catch(error => console.error('Error setting saved itineraries count:', error));
  }, []);

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