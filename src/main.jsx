import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import { store } from "./redux/store.js";
import { ToolProvider } from "./context/ToolContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
<React.StrictMode> <Provider store={store}> <ToolProvider> <App /> </ToolProvider> </Provider>
</React.StrictMode>
);