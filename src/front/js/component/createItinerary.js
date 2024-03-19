import React, { useState, useEffect, useContext } from 'react';
import '../../styles/createItinerary.css';
import avatar1 from "../../img/avatar1.png";
import { Context } from "../store/appContext";
import { ToastContainer, Toast } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

const CreateItinerary = () => {
  {
    const initialQuestions =
    {
      "Location": 'We have 8 questions for you..Where do you want to go?',
      "Group size": 'How many people are there in your group?',
      "Time at disposal": 'How many days do you plan to stay?',
      "Time of the year": 'What time of the year would you like to go?',
      "Interests": 'What are your interests? Like food, history, nature, arts..',
      "Level of fitness": 'What is your level of fitness?',
      "Dietary requirement": 'Almost there, please indicate your dietary preferences?',
      "Budget": 'And finally.. your daily budget?',
    };

    const [questions, setQuestions] = useState(initialQuestions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({
      "Location": "",
      "Group size": "",
      "Time at disposal": "",
      "Time of the year": "",
      "Interests": "",
      "Level of fitness": "",
      "Dietary requirement": "",
      "Budget": "",
    });

    const [generatedItinerary, setGeneratedItinerary] = useState(null);
    const [quizInProgress, setQuizInProgress] = useState(true);
    const { store, actions } = useContext(Context);
    const [itineraryName, setItineraryName] = useState("");
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const handleAnswerInput = (e) => {
      e.persist();

      const key = getKeyByIndex();
      setUserAnswers((oldValue) => ({
        ...oldValue,
        [key]: e.target.value,
      }));

      if (e.key === 'Enter') {
        askNextQuestion();
      }
    };

    const askNextQuestion = async () => {
      if (!quizInProgress) {
        return;
      }

      if (!userAnswers[getKeyByIndex()].trim()) {
        setToastMessage("Please provide an answer before moving to the next question.");
        setShowToast(true);
        return;
      }

      setUserAnswers((oldValue) => ({
        ...oldValue,
        [getKeyByIndex()]: userAnswers[getKeyByIndex()],
      }));

      if (currentQuestionIndex === 2) {
        const numDays = parseInt(userAnswers["Time at disposal"]);
        if (!store.accessToken && (isNaN(numDays) || numDays > 3)) {
          setToastMessage("In the Demo version, you can only see itineraries of up to 3 days. Please Login to unlock this feature!");
          setShowToast(true);
          return;
        }
      }

      setCurrentQuestionIndex(currentQuestionIndex + 1);

      if (currentQuestionIndex === 7) {
        if (!store.accessToken) {
          const numItineraries = parseInt(sessionStorage.getItem('numItineraries')) || 0;
          if (numItineraries >= 3) {
            setToastMessage("In the Demo version, you can only generate up to 3 itineraries per day.");
            setShowToast(true);
            return;
          }
          // Increment the number of itineraries
          sessionStorage.setItem('numItineraries', numItineraries + 1);
        }
        setLoading(true);

        const response = await fetch(process.env.BACKEND_URL + '/api/createItinerary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userAnswers),
        });

        const result = await response.json();

        if (response.ok) {
          setGeneratedItinerary(result.days);
          setQuizInProgress(false);
          setLoading(false);
        } else {
          console.error('Error generating itinerary:', result.error);
          setLoading(false);
        }
      }
    };

    const goToPreviousQuestion = () => {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    };

    const getKeyByIndex = () => {
      const keys = Object.keys(questions);
      return keys[currentQuestionIndex];
    };

    const handleSaveItinerary = async () => {
      try {
        const accessToken = store.accessToken;

        const response = await fetch(process.env.BACKEND_URL + '/api/saveItinerary', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${store.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itinerary: generatedItinerary,
            itineraryName: itineraryName,
          }),
        });

        console.log(response);

        if (!response.ok) {
          setToastMessage(`Error saving itinerary: ${response.statusText}`);
          setShowToast(true);
        } else {
          setToastMessage("Itinerary successfully saved!");
          setShowToast(true);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    const handleStartAgain = () => {
      if (!store.accessToken) {
        const numItineraries = parseInt(sessionStorage.getItem('numItineraries')) || 0;
        if (numItineraries >= 3) {
          setToastMessage("In the Demo version, you can only generate up to 3 itineraries per day.");
          setShowToast(true);
          return;
        }
      }
      setQuestions(initialQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setGeneratedItinerary(null);
      setQuizInProgress(true);
    };

    useEffect(() => {
      const handleKeyPress = (e) => {
        if (e.key === 'Enter' && currentQuestionIndex === 8) {
          handleStartAgain();
        }
      };

      if (currentQuestionIndex === 8) {
        document.addEventListener('keypress', handleKeyPress);
      }

      return () => {
        document.removeEventListener('keypress', handleKeyPress);
      };
    }, [currentQuestionIndex]);

    let house = (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className='iconsmall'>
          <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>);
    let foot = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className='iconsmall'>
          <path d="M416 0C352.3 0 256 32 256 32V160c48 0 76 16 104 32s56 32 104 32c56.4 0 176-16 176-96S512 0 416 0zM128 96c0 35.3 28.7 64 64 64h32V32H192c-35.3 0-64 28.7-64 64zM288 512c96 0 224-48 224-128s-119.6-96-176-96c-48 0-76 16-104 32s-56 32-104 32V480s96.3 32 160 32zM0 416c0 35.3 28.7 64 64 64H96V352H64c-35.3 0-64 28.7-64 64z"/></svg>)
    let utensils = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className='iconsmall'>
          <path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"/></svg>)
    let glass = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className='iconsmall'>
          <path d="M155.6 17.3C163 3 179.9-3.6 195 1.9L320 47.5l125-45.6c15.1-5.5 32 1.1 39.4 15.4l78.8 152.9c28.8 55.8 10.3 122.3-38.5 156.6L556.1 413l41-15c16.6-6 35 2.5 41 19.1s-2.5 35-19.1 41l-71.1 25.9L476.8 510c-16.6 6.1-35-2.5-41-19.1s2.5-35 19.1-41l41-15-31.3-86.2c-59.4 5.2-116.2-34-130-95.2L320 188.8l-14.6 64.7c-13.8 61.3-70.6 100.4-130 95.2l-31.3 86.2 41 15c16.6 6 25.2 24.4 19.1 41s-24.4 25.2-41 19.1L92.2 484.1 21.1 458.2c-16.6-6.1-25.2-24.4-19.1-41s24.4-25.2 41-19.1l41 15 31.3-86.2C66.5 292.5 48.1 226 76.9 170.2L155.6 17.3zm44 54.4l-27.2 52.8L261.6 157l13.1-57.9L199.6 71.7zm240.9 0L365.4 99.1 378.5 157l89.2-32.5L440.5 71.7z"/></svg>
    let train = (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className='iconsmall'>
          <path d="M96 0C43 0 0 43 0 96V352c0 48 35.2 87.7 81.1 94.9l-46 46C28.1 499.9 33.1 512 43 512H82.7c8.5 0 16.6-3.4 22.6-9.4L160 448H288l54.6 54.6c6 6 14.1 9.4 22.6 9.4H405c10 0 15-12.1 7.9-19.1l-46-46c46-7.1 81.1-46.9 81.1-94.9V96c0-53-43-96-96-96H96zM64 128c0-17.7 14.3-32 32-32h80c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM272 96h80c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32H272c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32zM64 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm288-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>)
    

    return (
      <>
          <div className="avatar-container col-12" id='avatarcontainer'>
            <div className="card1 col-6">
              <div className='avatar-box '>
                <div className='avatar ' id='avatar-placeholder'><img src={avatar1} alt="avatar" id='avatar' />
                  <p className="card-text" id='Dio'>DioDio AI Assistant</p> 
                </div>
                <div className='box n1' id='question'>
                  {currentQuestionIndex === 8
                    ? 'Here is your itinerary, enjoy your holiday!'
                    : questions[getKeyByIndex()]}
                </div>
              </div>
              <div className="card-body">
                
                {currentQuestionIndex !== 8 && (
                  <div className='input-buttons'>
                    <input
                      type='text'
                      id='answerInput'
                      placeholder='Your answer'
                      value={userAnswers[getKeyByIndex()] || ''}
                      onChange={handleAnswerInput}
                      onKeyPress={handleAnswerInput}
                      required
                    />
                    <div className='nbutton'>
                      {currentQuestionIndex !== 0 && (
                      <button id='nextbutton' className='me-4' onClick={goToPreviousQuestion}>Previous Question</button>
                      )}
                      <button id='nextbutton' onClick={askNextQuestion}>{currentQuestionIndex === 7 ? 'Generate Itinerary' : 'Next Question'}</button>
                    </div>
                  </div>
                )}
                <div className='start-again'>
                  {currentQuestionIndex === 8 && (
                    <button id='nextbutton' onClick={handleStartAgain}>Start Again</button>
                  )}
                </div>
              </div>
            </div>
            <div className='answer-card'>
              <div className='answer-box'>
                <div className='answer-item'>
                  {loading ? (
                    <FontAwesomeIcon className='cog' icon={faSync} spin />
                  ) : (
                    <>
                      {generatedItinerary !== null ? (
                        <div className='generated-itinerary' id='generated-itinerary'>
                          {generatedItinerary.map((day, index) => (
                            <div className="mapped" id='itimap' key={index}>
                              <div className='days' id='dayprop'> Day {index + 1} </div>
                              <div className='itinerary'>
                                <div className='object' id='objprop'>
                                  <span> {house} < strong>Accommodation</strong></span> {day.accommodation}</div> <br />
                                <div className='object' id='objprop'>
                                  <span> {foot} <strong>Activities</strong></span>
                                  <ul>
                                    {day.activities.map((activity, i) => (
                                      <li key={i}>{activity}</li>
                                    ))}
                                  </ul></div>
                                <div className='object' id='objprop'> 
                                  <span> {utensils} <strong>Lunch</strong></span> {day.lunch}
                                </div> <br />
                                <div className='object' id='objprop'> 
                                  <span> {glass} <strong>Dinner</strong></span> {day.dinner}
                                </div> <br />
                                <div className='object' id='objprop'> 
                                  <span> {train} <strong>Transportation</strong></span> {day.transportation}
                                </div>
                              </div>
                              {index < generatedItinerary.length - 1 && <hr className='day-divider' />}
                            </div>
                          ))}
                          {store.accessToken && (
                            <div>
                              <input type="text" name="Itinerary Name" placeholder="Please give a name to your itinerary..." onChange={e => setItineraryName(e.target.value)} required></input>
                              <button className="save-button" onClick={handleSaveItinerary}>Save Itinerary</button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p>Your itinerary will be shown here</p>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="toaster">
                <ToastContainer position="top-center">
                  <Toast show={showToast} onClose={() => setShowToast(false)} delay={5000} autohide
                    className="bg-dark text-white border border-light">
                    <Toast.Header>
                      <strong className="me-auto text-black">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                  </Toast>
                </ToastContainer>
              </div>
            </div>
          </div>
        
      </>
    );

  }
}
export default CreateItinerary;