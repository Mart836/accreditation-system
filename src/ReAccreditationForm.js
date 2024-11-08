import React, { useState } from 'react';
import backIcon from './back-icon.png'; 
import nextIcon from './next-icon.png';
import { Form,  Table, Row, Col } from 'react-bootstrap';
import './ReAccreditationForm.css'; // Create this CSS file for styling
import { getFirestore, collection, query, where, getDocs,addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AccreditationForm = () => {
    const [formData, setFormData] = useState({
        institutionName: '',
        accreditationNumber: '',
        streetAddress: '',
        mailingAddress: '',
        telephoneNumber: '',
        emailAddress: '',
        ownership: '',
        ownerName: '',
        identityNumber: '',
        audited: false,
        offence: false,
        changes: false,
        selfEvaluation: false,
        contactPerson: '',
        contactTelephone: '',
        contactPosition: '',
        postalAddress: '',
        contactEmail: ''
    });
    
    const [agreeAll, setAgreeAll] = useState(false);
    const [declarations, setDeclarations] = useState({
        declaration: false,
        legislation: false,
        notifyNQA: false,
        access: false,
    });
    const [rows, setRows] = useState([{ id:1, qualificationNo: '', qualificationTitle: '', nqfLevel: '', fullTime: false, partTime: false, distance: false, franchisePartners: '', sites: ''  }]);
    const [deletedRows, setDeletedRows] = useState([{ id:1,qualificationNo: '', qualificationTitle: '', nqfLevel: '', fullTime: false, partTime: false, distance: false, franchisePartners: '', sites: '' }]);
    const [currentPage, setCurrentPage] = useState(0);
    const [fileNames, setFileNames] = useState([]);
    const [deletedFileNames, setDeletedFileNames] = useState([]);
    const [declaredFiles, setdeclaredFileNames] = useState([]);
    const [institutionName, setInstitutionName] = useState("");
    const [accreditationError, setAccreditationError] = useState('');
    const storage = getStorage();
    const db = getFirestore();
    
    

    const pages = [
        'SECTION A - TRAINING PROVIDER INFORMATION',
        'CONTACT INFORMATION',
        'SECTION B - INFORMATION FOR RE-ACCREDITATION',
        'DECLARATION',
    ];

    const handleRowChange = (e, index) => {
        const { name, value } = e.target;
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], [name]: value };
        setRows(updatedRows);
    };
    
    // Handle individual checkbox changes
    
    const handleDeletedRowChange = (e, index) => {
        const { name, value } = e.target;
        const updatedRows = [...deletedRows];
        updatedRows[index] = { ...updatedRows[index], [name]: value };
        setDeletedRows(updatedRows);
    };
    
    
    
    const handleDeletedCheckboxChange = (e, index, field) => {
        const { checked } = e.target;
        const updatedRows = [...deletedRows];
        updatedRows[index] = { ...updatedRows[index], [field]: checked }; // Update the specific row
        setDeletedRows(updatedRows);
    };
    

    const addRow = () => {
        setRows([...rows, { id: Date.now(),qualificationNo: '', qualificationTitle: '', nqfLevel: '', fullTime: false, partTime: false, distance: false, franchisePartners: '', sites: '' }]);
    };

    const addDeletedRow = () => {
        setDeletedRows([...deletedRows, { id2: Date.now(), qualificationNo: '', qualificationTitle: '', nqfLevel: '', fullTime: false, partTime: false, distance: false, franchisePartners: '', sites: ''  }]);
    };

    const removeRow = (id) => {
        setRows(rows.filter(row => row.id !== id));
    };

    const removeDeletedRow = (id) => {
        setDeletedRows(deletedRows.filter(row => row.id !== id));
    };

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

    // Handler for uploading files (regular files)
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

    // Store metadata in Firestore for uploaded files
    const docRef = await addDoc(collection(db, "Re-Accreditation-Uploaded Sheet's"), {
        institutionName: institutionName,
        fileNames: uploadedFileNames,
        downloadURLs: downloadURLs,
        uploadedAt: new Date(),
    });

    console.log("Document written with ID: ", docRef.id);

    // Update state with uploaded file names
    setFileNames(uploadedFileNames);
};
const handleFileChangeforDeclared = async (event) => {
    const files = event.target.files;
    const declaredFiles = [];
    const promises = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        declaredFiles.push(file.name);

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

    // Store metadata in Firestore for uploaded files
    const docRef = await addDoc(collection(db, "declaredRe-Accreditation-Uploaded Sheet's"), {
        institutionName: institutionName,
        fileNames: declaredFiles,
        downloadURLs: downloadURLs,
        uploadedAt: new Date(),
    });

    console.log("Document written with ID: ", docRef.id);

    // Update state with uploaded file names
    setdeclaredFileNames(declaredFiles);
};

// Handler for uploading deleted files
const handleFileChangeForDeleted = async (event) => {
    const files = event.target.files;
    const deletedUploadedFileNames = [];
    const promises = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        deletedUploadedFileNames.push(file.name);

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

    // Store metadata in Firestore for deleted files
    const docRef = await addDoc(collection(db, "DeletedRe-Accreditation-Uploaded Sheet's"), {
        institutionName: institutionName,
        fileNames: deletedUploadedFileNames,
        downloadURLs: downloadURLs,
        uploadedAt: new Date(),
    });

    console.log("Document written with ID: ", docRef.id);

    // Update state with deleted uploaded file names
    setDeletedFileNames(deletedUploadedFileNames);
};
    const handleDeclarationChange = (e) => {
        const { name, checked } = e.target;
        setDeclarations((prev) => ({
            ...prev,
            [name]: checked,
        }));
        
        // If any checkbox is unchecked, uncheck 'Agree to all'
        if (!checked) {
            setAgreeAll(false);
        } else {
            // Check if all checkboxes are now checked, then check 'Agree to all'
            const allChecked = Object.values({ ...declarations, [name]: checked }).every(Boolean);
            if (allChecked) setAgreeAll(true);
        }
    };
    // Handle "Agree to all" checkbox
const handleAgreeAllChange = (e) => {
    const checked = e.target.checked;
    setAgreeAll(checked);

    // Update all individual checkboxes based on 'Agree to all'
    setDeclarations({
        declaration: checked,
        legislation: checked,
        notifyNQA: checked,
        access: checked,
    });
};

    // General input change handler for text inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleCheckboxChange = (e, index, field) => {
        const { checked } = e.target;
        const updatedRows = [...rows];
        updatedRows[index] = { ...updatedRows[index], [field]: checked }; // Update the specific row
        setRows(updatedRows);
    };
    const handleCheckboxChange2 = (event) => {
        const { name, checked } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    };
     // Handle form submission
     const handleSubmit = async (e) => {
        e.preventDefault();

        // Step 1: Check if accreditation number exists in the Firestore collection
        const accreditationNumber = formData.accreditationNumber;
        if (!accreditationNumber) {
            alert('Please enter an accreditation number');
            return;
        }

        const q = query(collection(db, 'Accreditation'), where('accreditationNumber', '==', accreditationNumber));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // Accreditation number not found
            setAccreditationError('Wrong accreditation number. Please enter a valid one.');
             // Alert the user that the accreditation number is incorrect
        alert('Wrong accreditation number. Please enter a valid one.');
            return; // Prevent form submission
        } else {
            // Reset error if accreditation number is valid
            setAccreditationError('');
        }

        // Step 2: Proceed with form submission if accreditation number is valid
        try {
            // Save form data to Firestore
            await addDoc(collection(db, 'Re-accreditation'), formData);
            alert('Form submitted successfully!');
            // Optionally, reset form or redirect user
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Error submitting form. Please try again.');
        }
    };
    

    return (
        <div className="reaccreditation-form">
            <header className="form-header">
                <div className="yellow-strip"></div>
                {currentPage === 0 && (
            <>
                <h1 className="applys">Re-Accreditation Application Form</h1>
            </>
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
                                        handleInputChange(e)
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
                                    onChange={handleInputChange}
                                    isInvalid={accreditationError !== ''} 
                                    required
                                />
                            </Col>
                            <Form.Control.Feedback type="invalid">
                               {accreditationError}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Row} controlId="streetAddress">
                            <Form.Label column sm={3}>Street Address:</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="streetAddress"
                                    value={formData.streetAddress}
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <fieldset>
                            <legend>Is the institution privately or publicly owned?</legend>
                            <label>
                                <div className="declaration-item">
                                    <input 
                                        type="radio" 
                                        name="ownership" 
                                        value="private" 
                                        checked={formData.ownership === 'private'} 
                                        onChange={handleInputChange}
                                        required 
                                    /> Private
                                </div>
                            </label>
                            <div className="declaration-item">
                            <label>
                                    <input 
                                        type="radio" 
                                        name="ownership" 
                                        value="public" 
                                        checked={formData.ownership === 'public'} 
                                        onChange={handleInputChange}
                                        required 
                                    /> Public
                            </label>
                            </div>
                        </fieldset>
                        <Form.Group as={Row} controlId="ownerName">
                        <Form.Label column sm={3}> Name of owner(s) or controlling body: </Form.Label>
                        <Col sm={9}>
                            <Form.Control
                            type="text" name="ownerName" 
                            value={formData.ownerName} 
                            onChange={handleInputChange} 
                            className="compact-input" 
                            required 
                            />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="identityNumber">
                        <Form.Label column sm={3}>Identity / Passport number:</Form.Label>
                        <Col sm={9}>
                            <Form.Control
                            type="text" 
                            name="identityNumber" 
                            value={formData.identityNumber} 
                            onChange={handleInputChange} 
                            className="compact-input" 
                            required />
                        </Col>
                        </Form.Group>
                        <fieldset>
                            <legend>Since the last accreditation, has the organization:</legend>
                            <div className="declaration-item">
                            <label>
                                    <input 
                                        type="checkbox" 
                                        name="audited" 
                                        checked={formData.audited} 
                                        onChange={handleCheckboxChange2} 
                                    />
                                    Been audited or investigated by the NQA or other body
                            </label>
                            </div>
                            <div className="declaration-item">
                            <label>
                                    <input 
                                        type="checkbox" 
                                        name="offence" 
                                        checked={formData.offence} 
                                        onChange={handleCheckboxChange2} 
                                    />
                                    Committed an offence under section 13 of the Act
                            </label>
                            </div>
                            <div className="declaration-item">
                            <label>
                                    <input 
                                        type="checkbox" 
                                        name="changes" 
                                        checked={formData.changes} 
                                        onChange={handleCheckboxChange2} 
                                    />
                                    Made any changes to existing qualifications
                            </label>
                            </div>
                            <div className="declaration-item">
                            <label>
                                    <input 
                                        type="checkbox" 
                                        name="selfEvaluation" 
                                        checked={formData.selfEvaluation} 
                                        onChange={handleCheckboxChange2} 
                                    />
                                    Undertaken any formal self-evaluation or internal audit
                            </label>
                            </div>
                            {/* Add file input for document upload */}
                    <div className="upload-section">
                        <label htmlFor="documentUpload" className="upload-label">Attach Documentation:</label>
                        <input
                            type="file"
                            id="documentUpload"
                            name="documentUpload"
                            multiple
                            onChange={handleFileChangeforDeclared} // Capture file changes
                        />
                    </div>

                    {/* Display uploaded file names */}
                    {declaredFiles.length > 0 && (
                            <div className="file-names">
                                <p>Uploaded files:</p>
                                <ul>
                                    {declaredFiles.map((fileName, index) => (
                                        <li key={index}>{fileName}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        </fieldset>
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
                     onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                        onChange={handleInputChange}
                        required
                    />
                </Col>
         </Form.Group>
    </section>
)}

                
{currentPage === 2 && (
    <section className="section-b">
        <h2>SECTION B - INFORMATION FOR RE-ACCREDITATION</h2>
        <p>Please complete all areas of Section B</p>
        <h3>SCOPE OF SERVICES</h3>
        <p>List all qualifications currently offered by the institution for which re-accreditation is sought:</p>
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
                {rows.map((row, index) => (
                    <tr key={row.id}>
                        <td><Form.Control
                            type="text"
                            name="qualificationNo"
                            className="compact-input"
                            value={row.qualificationNo}
                            onChange={(e) => handleRowChange(e, index)}
                        /></td>
                        <td><Form.Control
                            type="text"
                            name="qualificationTitle"
                            className="compact-input"
                            value={row.qualificationTitle}
                            onChange={(e) => handleRowChange(e, index)}
                        /></td>
                        <td><Form.Control
                            type="text"
                            name="nqfLevel"
                            className="compact-input"
                            value={row.nqfLevel}
                            onChange={(e) => handleRowChange(e, index)}
                        /></td>
                        <td>
                            <label>
                                <Form.Check
                                    type="checkbox"
                                    name="fullTime"
                                    checked={row.fullTime}
                                    onChange={(e) => handleCheckboxChange(e, index, 'fullTime')}
                                />
                            </label>
                        </td>
                        <td>
                            <label>
                                <Form.Check
                                    type="checkbox"
                                    name="partTime"
                                    checked={row.partTime}
                                    onChange={(e) => handleCheckboxChange(e, index, 'partTime')}
                                />
                            </label>
                        </td>
                        <td>
                            <label>
                                <Form.Check
                                    type="checkbox"
                                    name="distance"
                                    checked={row.distance}
                                    onChange={(e) => handleCheckboxChange(e, index, 'distance')}
                                />
                            </label>
                        </td>
                        <td><Form.Control
                            type="text"
                            name="franchisePartners"
                            className="compact-input"
                            value={row.franchisePartners}
                            onChange={(e) => handleRowChange(e, index)}
                        /></td>
                        <td><Form.Control
                            type="text"
                            name="sites"
                            className="compact-input"
                            value={row.sites}
                            onChange={(e) => handleRowChange(e, index)}
                        /></td>
                        <td>
                            <button type="button" onClick={() => removeRow(row.id)} className="remove-row-button">Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        <button type="button" onClick={addRow} className="add-row-button">Add Row</button>

        {/* Hidden file input for current qualifications */}
        <input
            type="file"
            id="documentUpload"
            name="documentUpload"
            style={{ display: 'none' }}
            multiple
            onChange={(e) => handleFileChange(e, setFileNames)}
        />
        <p>Or <button type="button" className="upload-button" onClick={() => document.getElementById('documentUpload').click()}>Upload Current Qualifications Sheet</button></p>

        {/* Display uploaded file names */}
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

        <h3>List qualifications no longer offered / Qualifications that must be deleted from the Register:</h3>
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
                {deletedRows.map((row, index) => (
                    <tr key={row.id}>
                        <td><Form.Control
                            type="text"
                            name="qualificationNo"
                            className="compact-input"
                            value={row.qualificationNo}
                            onChange={(e) => handleDeletedRowChange(e, index)}
                        /></td>
                        <td><Form.Control
                            type="text"
                            name="qualificationTitle"
                            className="compact-input"
                            value={row.qualificationTitle}
                            onChange={(e) => handleDeletedRowChange(e, index)}
                        /></td>
                        <td><Form.Control
                            type="text"
                            name="nqfLevel"
                            className="compact-input"
                            value={row.nqfLevel}
                            onChange={(e) => handleDeletedRowChange(e, index)}
                        /></td>
                        <td>
                            <label>
                                <Form.Check
                                    type="checkbox"
                                    name="fullTime"
                                    checked={row.fullTime}
                                    onChange={(e) => handleDeletedCheckboxChange(e, index, 'fullTime')}
                                />
                            </label>
                        </td>
                        <td>
                            <label>
                                <Form.Check
                                    type="checkbox"
                                    name="partTime"
                                    checked={row.partTime}
                                    onChange={(e) => handleDeletedCheckboxChange(e, index, 'partTime')}
                                />
                            </label>
                        </td>
                        <td>
                            <label>
                                <Form.Check
                                    type="checkbox"
                                    name="distance"
                                    checked={row.distance}
                                    onChange={(e) => handleDeletedCheckboxChange(e, index, 'distance')}
                                />
                            </label>
                        </td>
                        <td><Form.Control
                            type="text"
                            name="franchisePartners"
                            className="compact-input"
                            value={row.franchisePartners}
                            onChange={(e) => handleDeletedRowChange(e, index)}
                        /></td>
                        <td><Form.Control
                            type="text"
                            name="sites"
                            className="compact-input"
                            value={row.sites}
                            onChange={(e) => handleDeletedRowChange(e, index)}
                        /></td>
                        <td>
                            <button type="button" onClick={() => removeDeletedRow(row.id)} className="remove-row-button">Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        <button type="button" onClick={addDeletedRow} className="add-row-button">Add Row</button>

        {/* Hidden file input for deleted qualifications */}
        <input
            type="file"
            id="documentUpload2"
            name="documentUpload2"
            style={{ display: 'none' }}
            multiple
            onChange={(e) => handleFileChangeForDeleted(e, setDeletedFileNames)}
        />
        <p>Or <button type="button" className="upload-button" onClick={() => document.getElementById('documentUpload2').click()}>Upload Deleted Qualifications Sheet</button></p>

        {/* Display uploaded deleted file names */}
        {deletedFileNames.length > 0 && (
            <div className="file-names">
                <p>Uploaded files for Deleted Qualifications:</p>
                <ul>
                    {deletedFileNames.map((fileName, index) => (
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
                /> 
                Agree to all
            </label>
        </div>
        <div className="declaration-item">
            <label>
                <input
                    type="checkbox"
                    name="declaration"
                    checked={declarations.declaration}
                    onChange={handleDeclarationChange}
                /> 
                I declare that all information in the form and pack is true and correct.
            </label>
        </div>
        <div className="declaration-item">
            <label>
                <input
                    type="checkbox"
                    name="legislation"
                    checked={declarations.legislation}
                    onChange={handleDeclarationChange}
                /> 
                I agree to abide by any applicable legislation of relevance to our operations.
            </label>
        </div>
        <div className="declaration-item">
            <label>
                <input
                    type="checkbox"
                    name="notifyNQA"
                    checked={declarations.notifyNQA}
                    onChange={handleDeclarationChange}
                /> 
                I agree to notify the NQA of any significant changes to our position as an institution.
            </label>
        </div>
        <div className="declaration-item">
            <label>
                <input
                    type="checkbox"
                    name="access"
                    checked={declarations.access}
                    onChange={handleDeclarationChange}
                /> 
                I agree to give free and full access to any facilities and documents relevant to this application and its ongoing effect.
            </label>
        </div>
    </section>
)}

                {/* Navigation buttons */}
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
