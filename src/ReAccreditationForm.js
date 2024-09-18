import React, { useState } from 'react';
import backIcon from './back-icon.png'; 
import nextIcon from './next-icon.png';
import './ReAccreditationForm.css'; // Create this CSS file for styling
import { db } from './firebase'; // Import Firestore instance
import { collection, addDoc } from 'firebase/firestore';


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
        setDeletedRows([...deletedRows, { id: Date.now(), qualificationNo: '', qualificationTitle: '', nqfLevel: '', fullTime: false, partTime: false, distance: false, franchisePartners: '', sites: ''  }]);
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

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const fileNames = files.map(file => file.name);
        setFileNames(fileNames); // Use setFileNames to update the fileNames state
    };
    const handleFileChangeForDeleted = (e) => {
        const files = Array.from(e.target.files);
        const fileNames = files.map(file => file.name);
        setDeletedFileNames(fileNames);
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
     // Handle form submission
     const handleSubmit = async (e) => {
        e.preventDefault();

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
                <h1>Re-Accreditation Application Form</h1>
            </>
        )}
            </header>
            <form onSubmit={handleSubmit}>
            {currentPage === 0 && (
                    <section className="section-a">
                        <h2>SECTION A - TRAINING PROVIDER INFORMATION</h2>
                        <p>Please complete all areas of Section A</p>
                        <label>
                            Operating name of the institution:
                            <input 
                                type="text" 
                                name="institutionName" 
                                className="compact-input" 
                                value={formData.institutionName} 
                                onChange={handleInputChange}
                                required 
                            />
                        </label>
                        <label>
                            Accreditation number:
                            <input 
                                type="text" 
                                name="accreditationNumber" 
                                className="compact-input" 
                                value={formData.accreditationNumber} 
                                onChange={handleInputChange}
                                required 
                            />
                        </label>
                        <label>
                            Street Address:
                            <input 
                                type="text" 
                                name="streetAddress" 
                                className="compact-input" 
                                value={formData.streetAddress} 
                                onChange={handleInputChange}
                                required 
                            />
                        </label>
                        <label>
                            Mailing Address:
                            <input 
                                type="text" 
                                name="mailingAddress" 
                                className="compact-input" 
                                value={formData.mailingAddress} 
                                onChange={handleInputChange}
                                required 
                            />
                        </label>
                        <label>
                            Telephone number:
                            <input 
                                type="tel" 
                                name="telephoneNumber" 
                                className="compact-input" 
                                value={formData.telephoneNumber} 
                                onChange={handleInputChange}
                                required 
                            />
                        </label>
                        <label>
                            E-mail Address:
                            <input 
                                type="email" 
                                name="emailAddress" 
                                className="compact-input" 
                                value={formData.emailAddress} 
                                onChange={handleInputChange}
                                required 
                            />
                        </label>
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
                                    />
                                    Private
                                </div>
                            </label>
                            <label>
                                <div className="declaration-item">
                                    <input 
                                        type="radio" 
                                        name="ownership" 
                                        value="public" 
                                        checked={formData.ownership === 'public'} 
                                        onChange={handleInputChange}
                                        required 
                                    />
                                    Public
                                </div>
                            </label>
                        </fieldset>
                        <label>
                            Name of owner(s) or controlling body:
                            <input 
                                type="text" 
                                name="ownerName" 
                                className="compact-input" 
                                value={formData.ownerName} 
                                onChange={handleInputChange}
                                required 
                            />
                        </label>
                        <label>
                            Identity / Passport number:
                            <input 
                                type="text" 
                                name="identityNumber" 
                                className="compact-input" 
                                value={formData.identityNumber} 
                                onChange={handleInputChange}
                                required 
                            />
                        </label>
                        <fieldset>
                            <legend>Since the last accreditation, has the organization:</legend>
                            <label>
                                <div className="declaration-item">
                                    <input 
                                        type="checkbox" 
                                        name="audited" 
                                        checked={formData.audited} 
                                        onChange={handleCheckboxChange} 
                                    />
                                    Been audited or investigated by the NQA or other body
                                </div>
                            </label>
                            <label>
                                <div className="declaration-item">
                                    <input 
                                        type="checkbox" 
                                        name="offence" 
                                        checked={formData.offence} 
                                        onChange={handleCheckboxChange} 
                                    />
                                    Committed an offence under section 13 of the Act
                                </div>
                            </label>
                            <label>
                                <div className="declaration-item">
                                    <input 
                                        type="checkbox" 
                                        name="changes" 
                                        checked={formData.changes} 
                                        onChange={handleCheckboxChange} 
                                    />
                                    Made any changes to existing qualifications
                                </div>
                            </label>
                            <label>
                                <div className="declaration-item">
                                    <input 
                                        type="checkbox" 
                                        name="selfEvaluation" 
                                        checked={formData.selfEvaluation} 
                                        onChange={handleCheckboxChange} 
                                    />
                                    Undertaken any formal self-evaluation or internal audit
                                </div>
                            </label>
                            {/* Add file input for document upload */}
                    <div className="upload-section">
                        <label htmlFor="documentUpload" className="upload-label">Attach Documentation:</label>
                        <input
                            type="file"
                            id="documentUpload"
                            name="documentUpload"
                            multiple
                            onChange={handleFileChange} // Capture file changes
                        />
                    </div>

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
                        </fieldset>
                    </section>
                )}

                {currentPage === 1 && (
    <section className="contact-information">
        <h2>CONTACT INFORMATION</h2>
        <label>
            Name and title of person completing application (Contact Person):
            <input
                type="text"
                name="contactPerson"
                className="compact-input"
                value={formData.contactPerson}
                onChange={handleInputChange}
                required
            />
        </label>
        <label>
            Telephone no.:
            <input
                type="tel"
                name="contactTelephone"
                className="compact-input"
                value={formData.contactTelephone}
                onChange={handleInputChange}
                required
            />
        </label>
        <label>
            Position:
            <input
                type="text"
                name="contactPosition"
                className="compact-input"
                value={formData.contactPosition}
                onChange={handleInputChange}
                required
            />
        </label>
        <label>
            Postal Address:
            <input
                type="text"
                name="postalAddress"
                className="compact-input"
                value={formData.postalAddress}
                onChange={handleInputChange}
                required
            />
        </label>
        <label>
            Email Address:
            <input
                type="email"
                name="contactEmail"
                className="compact-input"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
            />
        </label>
    </section>
)}

                
{currentPage === 2 && (
    <section className="section-b">
        <h2>SECTION B - INFORMATION FOR RE-ACCREDITATION</h2>
        <p>Please complete all areas of Section B</p>
        <h3>SCOPE OF SERVICES</h3>
        <p>List all qualifications currently offered by the institution for which re-accreditation is sought:</p>
        <table>
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
                        <td><input
                            type="text"
                            name="qualificationNo"
                            className="compact-input"
                            value={row.qualificationNo}
                            onChange={(e) => handleRowChange(e, index)}
                        /></td>
                        <td><input
                            type="text"
                            name="qualificationTitle"
                            className="compact-input"
                            value={row.qualificationTitle}
                            onChange={(e) => handleRowChange(e, index)}
                        /></td>
                        <td><input
                            type="text"
                            name="nqfLevel"
                            className="compact-input"
                            value={row.nqfLevel}
                            onChange={(e) => handleRowChange(e, index)}
                        /></td>
                        <td>
                            <label>
                                <input
                                    type="checkbox"
                                    name="fullTime"
                                    checked={row.fullTime}
                                    onChange={(e) => handleCheckboxChange(e, index, 'fullTime')}
                                />
                            </label>
                        </td>
                        <td>
                            <label>
                                <input
                                    type="checkbox"
                                    name="partTime"
                                    checked={row.partTime}
                                    onChange={(e) => handleCheckboxChange(e, index, 'partTime')}
                                />
                            </label>
                        </td>
                        <td>
                            <label>
                                <input
                                    type="checkbox"
                                    name="distance"
                                    checked={row.distance}
                                    onChange={(e) => handleCheckboxChange(e, index, 'distance')}
                                />
                            </label>
                        </td>
                        <td><input
                            type="text"
                            name="franchisePartners"
                            className="compact-input"
                            value={row.franchisePartners}
                            onChange={(e) => handleRowChange(e, index)}
                        /></td>
                        <td><input
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
        </table>
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
        <table>
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
                        <td><input
                            type="text"
                            name="qualificationNoDeleted"
                            className="compact-input2"
                            value={row.qualificationNo}
                            onChange={(e) => handleDeletedRowChange(e, index)}
                        /></td>
                        <td><input
                            type="text"
                            name="qualificationTitleDeleted"
                            className="compact-input2"
                            value={row.qualificationTitle}
                            onChange={(e) => handleDeletedRowChange(e, index)}
                        /></td>
                        <td><input
                            type="text"
                            name="nqfLevelDeleted"
                            className="compact-input2"
                            value={row.nqfLevel}
                            onChange={(e) => handleDeletedRowChange(e, index)}
                        /></td>
                        <td>
                            <label>
                                <input
                                    type="checkbox"
                                    name="fullTimeDeleted"
                                    checked={row.fullTime}
                                    onChange={(e) => handleDeletedCheckboxChange(e, index, 'fullTime')}
                                />
                            </label>
                        </td>
                        <td>
                            <label>
                                <input
                                    type="checkbox"
                                    name="partTimeDeleted"
                                    checked={row.partTime}
                                    onChange={(e) => handleDeletedCheckboxChange(e, index, 'partTime')}
                                />
                            </label>
                        </td>
                        <td>
                            <label>
                                <input
                                    type="checkbox"
                                    name="distanceDeleted"
                                    checked={row.distance}
                                    onChange={(e) => handleDeletedCheckboxChange(e, index, 'distance')}
                                />
                            </label>
                        </td>
                        <td><input
                            type="text"
                            name="franchisePartnersDeleted"
                            className="compact-input2"
                            value={row.franchisePartners}
                            onChange={(e) => handleDeletedRowChange(e, index)}
                        /></td>
                        <td><input
                            type="text"
                            name="sitesDeleted"
                            className="compact-input2"
                            value={row.sites}
                            onChange={(e) => handleDeletedRowChange(e, index)}
                        /></td>
                        <td>
                            <button type="button" onClick={() => removeDeletedRow(row.id)} className="remove-row-button">Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
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
