import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./style/style.scss";
import "@ant-design/v5-patch-for-react-19";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
