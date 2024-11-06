import React, { useState } from 'react';
import { db } from './firebase'; // Import Firestore instance
import './ReAccreditationForm.css';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Add necessary imports
import { Button, Form, Alert, Modal } from 'react-bootstrap';

const TrackApplication = () => {
    const [referenceId, setReferenceId] = useState('');
    const [status, setStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch the application status based on the accreditation number
    const handleTrack = async () => {
        try {
            // Array of possible collections to check
            const collections = ['Accreditation', 'accreditation_expansion', 're_accreditation'];
            
            // Flag to check if a result was found
            let found = false;
            
            for (let collectionName of collections) {
                const q = query(
                    collection(db, collectionName),
                    where("accreditationNumber", "==", referenceId.trim())
                );
    
                const querySnapshot = await getDocs(q);
    
                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data(); // Get the first matching document
                    console.log("Document found:", docData); // Log document data for debugging
                    setStatus(docData.applicationStatus || "No status yet");
                    found = true;
                    break; // Exit loop once a matching application is found
                }
            }
    
            if (!found) {
                alert('No application found with that accreditation number.');
                setStatus(null);
            }
        } catch (error) {
            console.error("Error fetching application status: ", error);
            alert("Error tracking application. Please try again.");
            setStatus(null);
        }
    };
    

    // Function to print the acknowledgment letter
    const handlePrintAcknowledgment = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<h1>Acknowledgment Letter</h1>`);
        printWindow.document.write(`<p>Your application (Accreditation Number: ${referenceId}) is under review.</p>`);
        printWindow.document.write(`<p>Current Status: ${status}</p>`);
        printWindow.document.write(`<p>Thank you for choosing our services.</p>`);
        printWindow.document.close();
        printWindow.print();
    };

    // Function to handle modal display for payment options
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <header className="form-header">
                <div className="yellow-strip"></div>
            </header>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="container shadow p-4 border rounded">
                    <div className="row justify-content-center">
                        <div className="col-md-12">
                            <h2 className="text-center mb-4" style={{ whiteSpace: 'nowrap' }}>Track Your Application</h2>

                            <Form className="mb-3">
                                <Form.Group controlId="referenceId" className="d-flex align-items-center">
                                    <Form.Label className="mb-0 mr-2">Enter your accreditation number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={referenceId}
                                        onChange={(e) => setReferenceId(e.target.value)}
                                        placeholder="Accreditation Number" />
                                </Form.Group>
                                <Button variant="primary" onClick={handleTrack} className="mt-3 text-nowrap">
                                    Track Application
                                </Button>
                            </Form>
                        </div>
                    </div>

                    {status && (
                        <>
                            <Alert variant="info" className="text-center">
                                <h4>Status: {status}</h4>
                            </Alert>

                            <div className="d-flex justify-content-center">
                                {status !== "No status yet" ? (
                                    <Button variant="success" onClick={handlePrintAcknowledgment} className="mr-2">
                                        Print Acknowledgment Letter
                                    </Button>
                                ) : (
                                    <p className="text-center text-warning">No status available yet for this application.</p>
                                )}

                                <Button variant="warning" onClick={handleShowModal} className="ml-2">
                                    View Quotation / Payment Options
                                </Button>
                            </div>

                            <Modal show={showModal} onHide={handleCloseModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Quotation / Payment Options</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <p>Please select an option below:</p>
                                    <ul>
                                        <li>Print Quotation for Accreditation</li>
                                        <li>Print Quotation for Expansion of Accreditation</li>
                                        <li>Print Quotation for Re-accreditation</li>
                                        <li>Proceed with Online Payment</li>
                                    </ul>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default TrackApplication;
