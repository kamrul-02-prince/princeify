import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';
import GalleryPage from './pages/GalleryPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;