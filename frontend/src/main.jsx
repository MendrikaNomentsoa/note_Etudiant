import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Fonction pour gérer l'état de la sidebar sur le body
const handleSidebarState = () => {
  const checkSidebar = () => {
    const sidebar = document.querySelector('.sidebar')
    if (sidebar && sidebar.classList.contains('sidebar-open')) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }
  }
  
  // Observer les changements de classe sur la sidebar
  const observer = new MutationObserver(checkSidebar)
  const sidebar = document.querySelector('.sidebar')
  if (sidebar) {
    observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] })
  }
  
  checkSidebar()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Exécuter après le montage
setTimeout(handleSidebarState, 100)