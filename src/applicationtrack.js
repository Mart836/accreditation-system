import React, { useState } from 'react';
import { db } from './firebase'; // Import Firestore instance
import './ReAccreditationForm.css'; 
import { doc, getDoc } from 'firebase/firestore';
import { Button, Form, Alert, Modal } from 'react-bootstrap';

const TrackApplication = () => {
    const [referenceId, setReferenceId] = useState('');
    const [status, setStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch the application status
    const handleTrack = async () => {
        const docRef = doc(db, 'accreditation_expansion', referenceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setStatus(docSnap.data().applicationStatus);
        } else {
            alert('No such application found.');
            setStatus(null);
        }
    };

    // Function to print the acknowledgment letter
    const handlePrintAcknowledgment = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<h1>Acknowledgment Letter</h1>`);
        printWindow.document.write(`<p>Your application (ID: ${referenceId}) is under review.</p>`);
        printWindow.document.write(`<p>Current Status: ${status}</p>`);
        printWindow.document.write(`<p>Thank you for choosing our services.</p>`);
        printWindow.document.close();
        printWindow.print();
    };

    // Function to handle modal display for payment options
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <><header className="form-header">
            <div className="yellow-strip"></div>
        </header>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="container shadow p-4 border rounded">
                    <div className="row justify-content-center">
                        <div className="col-md-12"> {/* Set column size to full width */}
                            {/* Heading with no wrapping */}
                            <h2 className="text-center mb-4" style={{ whiteSpace: 'nowrap' }}>Track Your Application</h2>

                            <Form className="mb-3">
                                <Form.Group controlId="referenceId" className="d-flex align-items-center">
                                    <Form.Label className="mb-0 mr-2">Enter your reference ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={referenceId}
                                        onChange={(e) => setReferenceId(e.target.value)}
                                        placeholder="Reference ID" />
                                </Form.Group>
                                <Button variant="primary" onClick={handleTrack} className="mt-3 text-nowrap">
                                    Track Application
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>

                {status && (
                    <>
                        <Alert variant="info" className="text-center">
                            <h4>Application Status: {status}</h4>
                        </Alert>

                        <div className="d-flex justify-content-center">
                            <Button variant="success" onClick={handlePrintAcknowledgment} className="mr-2">
                                Print Acknowledgment Letter
                            </Button>

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
            </div></>
    );
};

export default TrackApplication;
