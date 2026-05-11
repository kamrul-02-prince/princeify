import logo from '../assets/logo.png';
import React, { useEffect, useState } from 'react';
import API from '../services/api';

function GalleryPage() {
    const [photos, setPhotos] = useState([]);
    const [commentText, setCommentText] = useState({});
    const [search, setSearch] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [role, setRole] = useState('');

    const getPhotos = async () => {
        try {
            const token = localStorage.getItem('token');

            const res = await API.get('/photos', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setPhotos(res.data.photos);

        } catch (error) {
            alert('Failed to load photos');
        }
    };
const loadUserProfile = () => {
    const token = localStorage.getItem('token');

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.role);
        setRole(payload.role);
    }
};
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };
    const deletePhoto = async (id) => {
    const token = localStorage.getItem('token');

    try {
        await API.delete(`/photos/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        alert('Photo deleted successfully');
        getPhotos();

    } catch (error) {
        alert('Delete failed');
    }
};
const likePhoto = async (id) => {
    const token = localStorage.getItem('token');

    try {
        await API.put(`/photos/like/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        getPhotos();

    } catch (error) {
        alert('Like failed');
    }
};
const addComment = async (id) => {
    const token = localStorage.getItem('token');

    try {
        await API.post(
            `/photos/comment/${id}`,
            {
                comment: commentText[id] || ''
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setCommentText({
            ...commentText,
            [id]: ''
        });

        getPhotos();

    } catch (error) {
        alert('Comment failed');
    }
};

   useEffect(() => {
    getPhotos();
    loadUserProfile();
}, []);

   return (
    <div className={darkMode ? 'page dark' : 'page'}>

 
<h2>Princeify Gallery</h2>
<div className="logo-container">
  <img src={logo} alt="Princeify Logo" className="site-logo" />
</div>
  <button onClick={() => setDarkMode(!darkMode)}>
    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
  </button>

        <div className="profile-box">
            <p>👤 Logged in as: {userEmail}</p>
        </div>

        <input
            type="text"
            placeholder="Search photos here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

            {role === 'creator' && (
    <button onClick={() => window.location.href = '/upload'}>
        Upload New Photo
    </button>
)}

            <button onClick={logout}>
                Logout
            </button>

            <div className="gallery">
                {photos
    .filter((photo) =>
        photo.originalName
            ?.toLowerCase()
            .includes(search.toLowerCase())
    )
    .map((photo) => (
                    <div className="card" key={photo.id}>
                        <p>
    👤 <strong>{photo.uploadedBy || 'Unknown User'}</strong>
</p>
                       <img
    src={photo.imageUrl}
    alt={photo.originalName}
    onClick={() => window.open(photo.imageUrl, '_blank')}
    style={{ cursor: 'pointer' }}
    
/>
<h3>{photo.title || photo.originalName}</h3>
<p>{photo.caption}</p>
<p>📍 {photo.location}</p>
<p>👥 {photo.people}</p>
                        <p>{photo.originalName}</p>
                        <p>❤️ Likes: {photo.likes || 0}</p>

<button onClick={() => likePhoto(photo.id)}>
    Like
</button>
<div>
    <input
        type="text"
        placeholder="Write a comment"
        value={commentText[photo.id] || ''}
        onChange={(e) =>
            setCommentText({
                ...commentText,
                [photo.id]: e.target.value
            })
        }
    />

    <button onClick={() => addComment(photo.id)}>
        Comment
    </button>
</div>

<div>
    {photo.comments &&
        photo.comments.map((c, index) => (
            <p key={index}>
                💬 {c.text}
            </p>
        ))}
</div>
                       {userEmail === 'creator' && (
  <button
    className="delete-btn"
    onClick={() => deletePhoto(photo.id)}
  >
    Delete
  </button>
)}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GalleryPage;