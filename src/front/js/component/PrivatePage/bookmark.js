import React, { useState } from 'react';
import Mappedays from './Mappedays.js';


function Bookmark({ savedItineraries, activeTab }) {
  const [openAcor, setOpenAcor] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAcor(openAcor === index ? null : index);
  };

  return (
    <div className={`tab-pane fade show ${activeTab === 'bookmarks' ? 'active' : ''}`} id="bookmarks">
      <div id="accordion">
        {savedItineraries && savedItineraries.length > 0 ? (
          savedItineraries.map((itinerary, index) => (
            <div className="card" key={index}>
              <div className="card-header1" id={`head${index}`}>
                <h5 className="mb-0">
                  <button id='it-name' className="btn" onClick={() => toggleAccordion(index)} aria-expanded={openAcor === index} aria-controls={`collapse${index}`}>
                    {itinerary.itinerary_name}
                  </button>
                </h5>
                <button className="btn pri-button" onClick={() => toggleAccordion(index)}>
                  {openAcor === index ? <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-down-square" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                  </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0" />
                  </svg>}
                </button>

              </div>

              <div id="collapse1" className={`collapse ${openAcor === index ? 'show' : ''}`} aria-labelledby={`heading${index}`} data-parent="#accordion">
                <div className="card-body" id='bookmap'>
                   {itinerary.data.map((day, dayIndex) => (
                    <Mappedays 
                    day = {dayIndex + 1} 
                    index= {dayIndex} 
                    itineraryLength = {itinerary.data.length}
                    accommodation = {day.accommodation}
                    activities = {day.activities}
                    lunch = {day.lunch}
                    dinner = {day.dinner}
                    transportation = {day.transportation}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card">
            <div className="card-body">
              No saved itineraries yet
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookmark;
