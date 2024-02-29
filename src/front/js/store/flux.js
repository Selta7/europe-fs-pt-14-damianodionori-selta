const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			accessToken: null,
			isLoggedIn: false,
		},
		actions: {
			signup: async (User) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(User),
					});
			
					if (!response.ok) {
						const errorData = await response.json().catch(() => ({}));
						console.error('Signup failed:', errorData);
						console.log(response)
						setStore({ message: errorData.error || 'Signup failed. Please try again.' });
					} else {
						const data = await response.json().catch(() => ({}));
						const successMessage = data.success || 'Signup successful';
						setStore({ message: successMessage });
						//always return something
						return successMessage
		
					}
				} catch (error) {
					console.error('Error during signup:', error);
					setStore({ message: 'Signup failed and caught. Please try again.' });
				}
			},
			

			 // New action to handle Google login
			 /* googleLogin: async () => {
                try {
                    await gapi.auth2.init({
                        client_id: "533568438503-75kgn3gkshmbrlnhsg2ithfchvc10ebi.apps.googleusercontent.com",
                        scope: 'email profile openid',
                    });
                    const authInstance = gapi.auth2.getAuthInstance();
                    const googleUser = await authInstance.signIn();

                    // Extract user data from the authentication response
                	googleUser.getBasicProfile();
                   	googleUser.getAuthResponse().id_token;

                    // Optionally, perform additional actions after successful login

                } catch (error) {
                    console.error('Error during Google login:', error);
                    // Handle error
                }
            }, */


			setIsLoggedIn: (isLoggedIn) => {
				const store = getStore();
				setStore({...store, isLoggedIn})
			},

			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			setAccessToken: (token) => {
				setStore({ accessToken: token });
			},

			getAccessToken: () => {
				const store = getStore();
				return store.accessToken;
			},

			getMessage: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello", {
						headers: {
						  'Authorization': `Bearer ${getActions().getAccessToken()}`,
						},
					  });
					  const data = await resp.json();
					  setStore({ message: data.message });
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
