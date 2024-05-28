import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import UserStore from "./store/UserStore";
import CoursesStore from './store/CoursesStore';


export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Context.Provider
			value={{
				user: new UserStore(),
				course: new CoursesStore(),
			}}
		>
			<App />
		</Context.Provider>
	</React.StrictMode>
);
