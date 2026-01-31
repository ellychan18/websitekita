import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async' // Impor ini
import AppRoutes from './routes'
import './index.css'

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-black text-white">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  )
}