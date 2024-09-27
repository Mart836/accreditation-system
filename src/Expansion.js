import React, { useState } from 'react';
import backIcon from './back-icon.png'; 
import nextIcon from './next-icon.png';
import { Form,  Table, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './ReAccreditationForm.css'; // Create this CSS file for styling
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AccreditationForm = () => {
    const [agreeAll, setAgreeAll] = useState(false);
    const [rows, setRows] = useState([{ id: Date.now(), qualificationNo: '', qualificationTitle: '', nqfLevel: '', attendance: [], franchisePartners: '', sites: '' }]);
    const [currentPage, setCurrentPage] = useState(0);
    const [fileNames, setFileNames] = useState([]);
    const [institutionName, setInstitutionName] = useState("");
    const storage = getStorage();
    const db = getFirestore();

    // State for form fields
    const [formData, setFormData] = useState({
        institutionName: '',
        accreditationNumber: '',
        streetAddress: '',
        mailingAddress: '',
        telephoneNumber: '',
        emailAddress: '',
        contactPerson: '',
        contactTelephone: '',
        contactPosition: '',
        postalAddress: '',
        contactEmail: '',
        qualifications: rows,
        declaration: false,
        legislation: false,
        notifyNQA: false,
        access: false
    });

    const pages = [
        'SECTION A - TRAINING PROVIDER INFORMATION',
        'CONTACT INFORMATION',
        'SECTION B - INFORMATION ON SERVICES TO BE EXPANDED',
        'DECLARATION',
    ];

    const handleAgreeAllChange = (e) => {
        const checked = e.target.checked;
        setAgreeAll(checked);
        setFormData((prevData) => ({
            ...prevData,
            declaration: checked,
            legislation: checked,
            notifyNQA: checked,
            access: checked
        }));
    };

    const addRow = () => {
        setRows([...rows, { id: Date.now(), qualificationNo: '', qualificationTitle: '', nqfLevel: '', attendance: [], franchisePartners: '', sites: '' }]);
        setFormData((prevData) => ({
            ...prevData,
            qualifications: [...rows, { id: Date.now(), qualificationNo: '', qualificationTitle: '', nqfLevel: '', attendance: [], franchisePartners: '', sites: '' }]
        }));
    };

    const removeRow = (id) => {
        const updatedRows = rows.filter(row => row.id !== id);
        setRows(updatedRows);
        setFormData((prevData) => ({
            ...prevData,
            qualifications: updatedRows
        }));
    };
    const handleInputChange2 = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleInputChange = (e, rowId) => {
        const { name, value } = e.target;
        const updatedRows = rows.map(row => 
            row.id === rowId ? { ...row, [name]: value } : row
        );
        setRows(updatedRows);
        setFormData((prevData) => ({
            ...prevData,
            qualifications: updatedRows
        }));
    };

    const handleCheckboxChange = (e, rowId) => {
        const { value, checked } = e.target;
        const updatedRows = rows.map(row => 
            row.id === rowId ? { 
                ...row, 
                attendance: checked 
                    ? [...row.attendance, value] 
                    : row.attendance.filter(att => att !== value) 
            } : row
        );
        setRows(updatedRows);
        setFormData((prevData) => ({
            ...prevData,
            qualifications: updatedRows
        }));
    };

    // Handlers for navigation
    const nextPage = () => {
        if (currentPage < pages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Handler for file input change
    const handleFileChange = async (event) => {
        const files = event.target.files;
        const uploadedFileNames = [];
        const promises = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            uploadedFileNames.push(file.name);

            // Upload the file to Firebase Storage
            const storageRef = ref(storage, `documents/${file.name}`);
            const uploadTask = uploadBytes(storageRef, file).then((snapshot) => {
                // Get the download URL for the uploaded file
                return getDownloadURL(snapshot.ref);
            });

            promises.push(uploadTask);
        }

        // Resolve all uploads and get download URLs
        const downloadURLs = await Promise.all(promises);

        // Store metadata in Firestore
        const docRef = await addDoc(collection(db, "Expansion-Accreditation-Uploaded Sheet's"), {
            institutionName: institutionName,
            fileNames: uploadedFileNames,
            downloadURLs: downloadURLs,
            category: 'Courses to be Expanded',
            uploadedAt: new Date(),
        });

        console.log("Document written with ID: ", docRef.id);

        // Update the state with the file names
        setFileNames(uploadedFileNames);
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Include application status in the form data
            const formDataWithStatus = {
                ...formData,
                applicationStatus: 'Pending',  // Default status
            };
    
            // Save form data to Firestore
            await addDoc(collection(db, 'accreditation_expansion'), formData, formDataWithStatus);
            alert('Form submitted successfully! Check your email for the acknowledgment letter.');
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Error submitting form. Please try again.');
        }
    };
    

    return (
        <div className="Expansionaccreditation-form">
            <header className="form-header">
                <div className="yellow-strip"></div>
                {currentPage === 0 && (
                    <h1 className="applys">APPLICATION FOR EXPANSION OF ACCREDITATION</h1>
                )}
            </header>
            <form onSubmit={handleSubmit}>
            {currentPage === 0 && (
                    <section className="section-a">
                        <h2>SECTION A - TRAINING PROVIDER INFORMATION</h2>
                        <p>Please complete all areas of Section A</p>
                        <Form.Group as={Row} controlId="institutionName">
                            <Form.Label column sm={3}>Operating name of the institution:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="institutionName"
                                    value={formData.institutionName}
                                    onChange={(e) => {
                                        handleInputChange2(e)
                                        setInstitutionName(e.target.value);
                                    }}
                                    required
                                    className="compact-input"
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="accreditationNumber">
                            <Form.Label column sm={3}>Accreditation number:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="accreditationNumber"
                                    value={formData.accreditationNumber}
                                    onChange={handleInputChange2}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="streetAddress">
                            <Form.Label column sm={3}>Street Address:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="streetAddress"
                                    value={formData.streetAddress}
                                    onChange={handleInputChange2}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="mailingAddress">
                            <Form.Label column sm={3}>Mailing Address:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="mailingAddress"
                                    value={formData.mailingAddress}
                                    onChange={handleInputChange2}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="telephoneNumber">
                            <Form.Label column sm={3}>Telephone number:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="tel"
                                    name="telephoneNumber"
                                    value={formData.telephoneNumber}
                                    onChange={handleInputChange2}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="emailAddress">
                            <Form.Label column sm={3}>E-mail Address:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="email"
                                    name="emailAddress"
                                    value={formData.emailAddress}
                                    onChange={handleInputChange2}
                                    required
                                />
                            </Col>
                        </Form.Group>
                    </section>
                )}

{currentPage === 1 && (
                    <section className="contact-information">
                        <h2>CONTACT INFORMATION</h2>
                        <Form.Group as={Row} controlId="contactPerson" >
                            <Form.Label column sm={3}>Name and title of person completing application:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleInputChange2}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="contactTelephone">
                            <Form.Label column sm={3}>Telephone no.:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="tel"
                                    name="contactTelephone"
                                    value={formData.contactTelephone}
                                    onChange={handleInputChange2}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="contactPosition">
                            <Form.Label column sm={3}>Position:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="contactPosition"
                                    value={formData.contactPosition}
                                    onChange={handleInputChange2}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="postalAddress">
                            <Form.Label column sm={3}>Postal Address:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="postalAddress"
                                    value={formData.postalAddress}
                                    onChange={handleInputChange2}
                                    required
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="contactEmail">
                            <Form.Label column sm={3}>Email Address:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="email"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleInputChange2}
                                    required
                                />
                            </Col>
                        </Form.Group>
                    </section>
                )}

                {currentPage === 2 && (
                    <section className="section-b">
                        <h2>SECTION B - INFORMATION ON SERVICES TO BE EXPANDED</h2>
                        <p>Please complete all areas of Section B</p>
                        <p>List all qualifications currently offered by the institution for which expansion is sought: (Additional sheets may be attached if necessary)</p>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>QUALIFICATION TITLE</th>
                                    <th>NQF LEVEL</th>
                                    <th>Full time</th>
                                    <th>Part-time</th>
                                    <th>Distance</th>
                                    <th>FRANCHISE PARTNERS (IF APPLICABLE)</th>
                                    <th>SITE(S)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.id}>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                name="qualificationNo"
                                                value={row.qualificationNo}
                                                onChange={(e) => handleInputChange(e, row.id)}
                                                className="compact-input"
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                name="qualificationTitle"
                                                value={row.qualificationTitle}
                                                onChange={(e) => handleInputChange(e, row.id)}
                                                className="compact-input"
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                name="nqfLevel"
                                                value={row.nqfLevel}
                                                onChange={(e) => handleInputChange(e, row.id)}
                                                className="compact-input"
                                            />
                                        </td>
                                        <td>
                                            
                                                <Form.Check
                                                    type="checkbox"
                                                    name="attendance"
                                                    value="full-time"
                                                    checked={row.attendance.includes('full-time')}
                                                    onChange={(e) => handleCheckboxChange(e, row.id)}
                                                />
                                            
                                        </td>
                                        <td>
                                            
                                                <Form.Check
                                                    type="checkbox"
                                                    name="attendance"
                                                    value="part-time"
                                                    checked={row.attendance.includes('part-time')}
                                                    onChange={(e) => handleCheckboxChange(e, row.id)}
                                                />
                                            
                                        </td>
                                        <td>
                                            
                                                <Form.Check
                                                    type="checkbox"
                                                    name="attendance"
                                                    value="distance"
                                                    checked={row.attendance.includes('distance')}
                                                    onChange={(e) => handleCheckboxChange(e, row.id)}
                                                />
                                            
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                name="franchisePartners"
                                                value={row.franchisePartners}
                                                onChange={(e) => handleInputChange(e, row.id)}
                                                className="compact-input"
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                name="sites"
                                                value={row.sites}
                                                onChange={(e) => handleInputChange(e, row.id)}
                                                className="compact-input"
                                            />
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => removeRow(row.id)}
                                                className="remove-row-button"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <button type="button" onClick={addRow} className="add-row-button">Add Row</button>
                        <input
                            type="file"
                            id="documentUpload"
                            name="documentUpload"
                            style={{ display: 'none' }}
                            multiple
                            onChange={handleFileChange}
                        />
                        <p>Or <button type="button" className="upload-button" onClick={() => document.getElementById('documentUpload').click()}>Upload Sheet</button></p>
                        {fileNames.length > 0 && (
                            <div className="file-names">
                                <p>Uploaded files:</p>
                                <ul>
                                    {fileNames.map((fileName, index) => (
                                        <li key={index}>{fileName}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                )}
                {currentPage === 3 && (
                    <section className="declaration">
                        <h2>DECLARATION</h2>
                        <div className="declaration-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="agreeAll"
                                    checked={agreeAll}
                                    onChange={handleAgreeAllChange}
                                /> Agree to all
                            </label>
                        </div>
                        <div className="declaration-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="declaration"
                                    checked={formData.declaration}
                                    onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                                />
                                I declare that all information in the form and pack is true and correct.
                            </label>
                        </div>
                        <div className="declaration-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="legislation"
                                    checked={formData.legislation}
                                    onChange={(e) => setFormData({ ...formData, legislation: e.target.checked })}
                                />
                                I agree to abide by any applicable legislation of relevance to our operations.
                            </label>
                        </div>
                        <div className="declaration-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="notifyNQA"
                                    checked={formData.notifyNQA}
                                    onChange={(e) => setFormData({ ...formData, notifyNQA: e.target.checked })}
                                />
                                I agree to notify the NQA of any significant changes to our position as an institution.
                            </label>
                        </div>
                        <div className="declaration-item">
                            <label>
                                <input
                                    type="checkbox"
                                    name="access"
                                    checked={formData.access}
                                    onChange={(e) => setFormData({ ...formData, access: e.target.checked })}
                                />
                                I agree to give free and full access to any facilities and documents relevant to this application and its ongoing effect.
                            </label>
                        </div>
                    </section>
                )}
                <div className="navigation-buttons">
                    {currentPage > 0 && (
                        <button type="button" className="back-button" onClick={prevPage}>
                            <img src={backIcon} alt="Back" />
                        </button>
                    )}
                    {currentPage < pages.length - 1 && (
                        <button type="button" className="next-button" onClick={nextPage}>
                            <img src={nextIcon} alt="Next" />
                        </button>
                    )}
                    {currentPage === pages.length - 1 && <button type="submit" className="submit-button">Submit</button>}
                </div>
            </form>
        </div>
    );
};

export default AccreditationForm;
