import { jwtDecode } from "jwt-decode";

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

			checkEmail: async (email, name) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/users/" + email);
					const data = await response.json();
					
					if (data.message == 'true') {
						// Email exists, call the login function here
						await getActions().handleGoogleLogin(email);
						console.log("Email exists:", data);
						
					} else {
						// Email does not exist, call the signup function here
						console.log("Email does not exist:", data);
						// Call the signup function here
						// Then call the login function with just the email to create the token.
						 await signup({
							first_name: name,
							email: email,
						});
						await handleGoogleLogin(email);
					
						return data;}
				} catch (error) {
					console.error('Error checking if email exists:', error);
				}
			},
			 //put in flux
			 handleCallbackResponse: async (response) => {
				console.log("Encoded JWT ID token: " + response.credential);
				var userObject = jwtDecode(response.credential);
				console.log(userObject);
				//here we use the object returned to sign up or login the user.
				getActions().checkEmail(userObject.email, userObject.name);
			},

			handleGoogleLogin: async (email) => {
				try {
				
				  const response = await fetch(process.env.BACKEND_URL + "/api/GoogleLogin" , {
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
			  
				  getActions().setAccessToken(data.access_token);
				  getActions().setIsLoggedIn(true);
					
			  
				} catch (error) {
				  console.error('Error during login:', error);
				  alert(error.message); // Display alert for error message
				}
			  },
			
				
	
			 
				


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
