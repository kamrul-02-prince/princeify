import React, { useState } from 'react';
import API from '../services/api';

function UploadPage() {
    const [photo, setPhoto] = useState(null);
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [people, setPeople] = useState('');

    const uploadPhoto = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const userName = localStorage.getItem('userName');

        const formData = new FormData();

        formData.append('photo', photo);
        formData.append('uploadedBy', userName || 'Unknown User');
        formData.append('title', title);
        formData.append('caption', caption);
        formData.append('location', location);
        formData.append('people', people);

        try {
            await API.post('/photos/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Photo uploaded successfully');
            window.location.href = '/gallery';

        } catch (error) {
            alert('Photo upload failed');
        }
    };

    return (
        <div className="page">
            <h2>Upload Photo</h2>

            <form onSubmit={uploadPhoto}>
                <input
                    type="text"
                    placeholder="Photo Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="People Present"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    required
                />

                <button type="submit">Upload</button>
            </form>

            <p><a href="/gallery">Go to Gallery</a></p>
        </div>
    );
}

export default UploadPage;