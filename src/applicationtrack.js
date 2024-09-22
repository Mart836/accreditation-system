import React, { useState } from 'react';
import { db } from './firebase';  // Import Firestore instance
import { doc, getDoc } from 'firebase/firestore';

const TrackApplication = () => {
    const [referenceId, setReferenceId] = useState('');
    const [status, setStatus] = useState(null);

    const handleTrack = async () => {
        const docRef = doc(db, 'accreditation_expansion', referenceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setStatus(docSnap.data().applicationStatus);
        } else {
            alert('No such application found.');
        }
    };

    return (
        <div>
            <h1>Track Your Application</h1>
            <input
                type="text"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                placeholder="Enter your reference ID"
            />
            <button onClick={handleTrack}>Track Application</button>

            {status && (
                <div>
                    <h2>Application Status: {status}</h2>
                </div>
            )}
        </div>
    );
};

export default TrackApplication;
