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
		
		

		useEffect(() => {
			
			function handleCallbackResponse (response) {
				console.log ("Encoded JWT ID token: " + response.credential);
				var userObject = jwtDecode (response.credential);
				console.log (userObject);
				setUser (userObject);
			}
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
