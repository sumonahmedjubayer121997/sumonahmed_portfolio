
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import App from './App.tsx'
import Preloader from './components/Preloader.tsx'
import './index.css'

const AppWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} minDuration={2000} />}
      {!isLoading && <App />}
    </>
  );
};

createRoot(document.getElementById("root")!).render(<AppWrapper />);
