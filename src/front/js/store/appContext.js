import React, { useState, useEffect } from "react";
import getState from "./flux.js";
import { jwtDecode } from "jwt-decode";

// Don't change, here is where we initialize our context, by default it's just going to be null.
export const Context = React.createContext(null);

// This function injects the global store to any view/component where you want to use it, we will inject the context to layout.js, you can see it here:
// https://github.com/4GeeksAcademy/react-hello-webapp/blob/master/src/js/layout.js#L35
const injectContext = PassedComponent => {
	

	const StoreWrapper = props => {
		//this will be passed as the contenxt value
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: updatedStore =>
					setState({
						store: Object.assign(state.store, updatedStore),
						actions: { ...state.actions }
					})
			})
		);
		const [ user, setUser ] = useState({});
		
		
		const checkEmail = async (email) => {
			try {
				const response = await fetch(process.env.BACKEND_URL + "/api/users/" + email);
				const data = await response.json();
				
				if (data.message == 'true') {
					// Email exists, call the login function here
					console.log("Email exists:", data);
					// await handleGoogleLogin(userObject.email);
				} else {
					// Email does not exist, call the signup function here
					console.log("Email does not exist:", data);
					// Call the signup function here
					// Then call the login function with just the email to create the token.
				}
				
				return data;
			} catch (error) {
				console.error('Error checking if email exists:', error);
			}
		}
		
		const handleGoogleLogin = async () => {
			try {
			console.log("test")
			  const response = await fetch(process.env.BACKEND_URL + "/api/login", {
				method: "POST",
				headers: {
				  "Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			  });
			  
			  if (!response.ok) {
				throw new Error('Login failed. Please check your email and password.');
			  }
			  
			  const data = await response.json();
				  
			  localStorage.setItem("accessToken", data.access_token)
		  
			  setAccessToken(data.access_token);
			  setIsLoggedIn(true);
			  
			  navigate(`/privatePage`);
			  
			
		  
			} catch (error) {
			  console.error('Error during login:', error);
			  alert(error.message); // Display alert for error message
			}
		  }

        async function handleCallbackResponse(response) {
            console.log("Encoded JWT ID token: " + response.credential);
            var userObject = jwtDecode(response.credential);
            console.log(userObject);
            //here we use the object returned to sign up or login the user.
            checkEmail(userObject.email);
        }
		

		useEffect(() => {
			 google.accounts.id.initialize ({
				client_id: "533568438503-75kgn3gkshmbrlnhsg2ithfchvc10ebi.apps.googleusercontent.com",
				callback: handleCallbackResponse
			});
		
			google.accounts.id.renderButton (
				document.getElementById("signInDiv"),
				{ theme:"outline", size: "large"}
			) 
			

			//create function to check if user is still logged in
			/**
			 * EDIT THIS!
			 * This function is the equivalent to "window.onLoad", it only runs once on the entire application lifetime
			 * you should do your ajax requests or fetch api requests here. Do not use setState() to save data in the
			 * store, instead use actions, like this:
			 **/
			state.actions.getMessage(); // <---- calling this function from the flux.js actions
		}, []);

		// The initial value for the context is not null anymore, but the current state of this component,
		// the context will now have a getStore, getActions and setStore functions available, because they were declared
		// on the state of this component
		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;
