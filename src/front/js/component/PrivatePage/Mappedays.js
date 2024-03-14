import React from 'react';

function Mappedays(props) {
    
    return (
           
        <div className="mapped" id='mapday'>
        <div className='days'> <h3>Day {props.day}</h3> </div>
        <div className='itinerary'>
          <div className='object'><strong>Accommodation</strong> {props.accommodation}</div> <br />
          <div className='object'><strong>Activities</strong></div>
          <ul>
            {props.activities.map((activity, i) => (
              <li key={i}>{activity}</li>
            ))}
          </ul>
          <div className='object'> <strong>Lunch</strong> {props.lunch}</div> <br />
          <div className='object'> <strong>Dinner</strong> {props.dinner}</div> <br />
          <div className='object'> <strong>Transportation</strong> {props.transportation}</div>
        </div>
        {props.index < props.itineraryLength - 1 && <hr className='day-divider' />}
      </div>
            
    )
}

export default Mappedays;

