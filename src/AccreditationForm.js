import React, { useState } from 'react';
import backIcon from './back-icon.png'; 
import nextIcon from './next-icon.png';
import './AccreditationForm.css'; // Create this CSS file for styling
import { db } from './firebase'; // Import Firestore instance
import { collection, addDoc } from 'firebase/firestore';

const AccreditationForm = () => {
    const [formData, setFormData] = useState({
        institutionName: '',
        streetAddress: '',
        mailingAddress: '',
        telephoneNumber: '',
        emailAddress: '',
        ownership: '',
        ownerName: '',
        identityNumber: '',
        legalStatus: '',
        contactPerson: '',
        contactTelephone: '',
        contactPosition: '',
        postalAddress: '',
        contactEmail: '',
        rows: [],
        seniorManagement: [{ id: Date.now(), seniorName: '', seniorPosition: '', seniorIdentityNumber: '' }],
        deliveryLocations: [{ id: Date.now(), locationNumber: '', town: '', region: '', physicalAddress: '' }],
        qualifications: [{ id: Date.now(), qualificationTitle: '', nqfLevel: '', modes: {} }],
    });
    const [agreeAll,setAgreeAll] = useState(false);
    const [declarations, setDeclarations] = useState({
        declaration1: false,
        declaration2: false,
        declaration3: false,
        declaration4: false,
    });
    const [currentPage, setCurrentPage] = useState(0); // Track the current page
    const [fileNames, setFileNames] = useState([]);


    const pages = [
        'SECTION A - TRAINING PROVIDER INFORMATION',
        'CONTACT INFORMATION',
        'SENIOR MANAGEMENT DETAILS',
        'SECTION B - OVERVIEW OF OPERATIONS',
        'PROPOSED SCOPE OF SERVICES',
        'DECLARATION',
    ];

    // Handlers for updating formData state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleRowChange = (id, field, value) => {
        setFormData((prevState) => ({
            ...prevState,
            rows: prevState.rows.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            ),
        }));
    };

    const handleSeniorManagementChange = (id, field, value) => {
        setFormData((prevState) => ({
            ...prevState,
            seniorManagement: prevState.seniorManagement.map((man) =>
                man.id === id ? { ...man, [field]: value } : man
            ),
        }));
    };
    
    

    const handleDeliveryLocationChange = (id, field, value) => {
        setFormData((prevState) => ({
            ...prevState,
            deliveryLocations: prevState.deliveryLocations.map((loc) =>
                loc.id === id ? { ...loc, [field]: value } : loc
            ),
        }));
    };
    const addRow = () => {
        const newRow = {
            id: Date.now(),
            qualificationNo: '',
            qualificationTitle: '',
            nqfLevel: '',
            fullTime: false,
            partTime: false,
            distance: false,
            franchisePartner: '',
            site: ''
        };
        setFormData((prevState) => ({
            ...prevState,
            rows: [...prevState.rows, newRow]
        }));
    };
    const removeRow = (id) => {
        setFormData((prevState) => ({
            ...prevState,
            rows: prevState.rows.filter((row) => row.id !== id)
        }));
    };
    // Handlers for adding and removing rows dynamically
    const addSeniorManagement = () => {
        setFormData((prevState) => ({
            ...prevState,
            seniorManagement: [...prevState.seniorManagement, { id: Date.now(), seniorName: '', seniorPosition: '', seniorIdentityNumber: '' }],
        }));
    };

    const removeSeniorManagement = (id) => {
        setFormData((prevState) => ({
            ...prevState,
            seniorManagement: prevState.seniorManagement.filter((man) => man.id !== id),
        }));
    };

    const addDeliveryLocation = () => {
        setFormData((prevState) => ({
            ...prevState,
            deliveryLocations: [...prevState.deliveryLocations, { id: Date.now(), locationNumber: '', town: '', region: '', physicalAddress: '' }],
        }));
    };

    const removeDeliveryLocation = (id) => {
        setFormData((prevState) => ({
            ...prevState,
            deliveryLocations: prevState.deliveryLocations.filter((loc) => loc.id !== id),
        }));
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
        // Handler for file input change
        const handleFileChange = (e, setFiles) => {
            const files = Array.from(e.target.files);
            const fileNames = files.map(file => file.name);
            setFiles(fileNames);
        };
        const handleAgreeAllChange = (e) => {
            const checked = e.target.checked;
            setAgreeAll(checked);
            setDeclarations({
                declaration1: checked,
                declaration2: checked,
                declaration3: checked,
                declaration4: checked,
            });
        };
        const handleIndividualChange = (e) => {
            const { name, checked } = e.target;
            setDeclarations((prevState) => ({
                ...prevState,
                [name]: checked,
            }));
        };
     // Handle form submission
     const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Save form data to Firestore
            await addDoc(collection(db, 'Accreditation'), formData);
            alert('Form submitted successfully!');
            // Optionally, reset form or redirect user
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Error submitting form. Please try again.');
        }
    };

    return (
        <div className="accreditation-form">
            <header className="form-header">
                <div className="yellow-strip"></div>
                {currentPage === 0 && (
            <>
                <h1>Application for Accreditation</h1>
                <p>NB: This application form must be completed by persons, institutions, and organisations seeking accreditation and not for re-accreditation and expansion of accreditation.</p>
            </>
        )}
            </header>

            <form onSubmit={handleSubmit}>
                {/* Render the current page based on currentPage state */}
                {currentPage === 0 && (
                    <section className="section-a">
                        <h2>SECTION “A” – TRAINING PROVIDER INFORMATION</h2>
                        <p>Please complete all areas of Section “A”</p>
                        <label>
                            Operating name of the institution:
                            <input type="text" name="institutionName" value={formData.institutionName} onChange={handleInputChange} className="compact-input" required />
                        </label>
                        <label>
                            Street Address:
                            <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} className="compact-input" required />
                        </label>
                        <label>
                            Mailing Address:
                            <input type="text" name="mailingAddress" value={formData.mailingAddress} onChange={handleInputChange} className="compact-input" required />
                        </label>
                        <label>
                            Telephone number:
                            <input type="tel" name="telephoneNumber" value={formData.telephoneNumber} onChange={handleInputChange} className="compact-input" required />
                        </label>
                        <label>
                            E-mail Address:
                            <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange} className="compact-input" required />
                        </label>
                        <fieldset>
                            <legend>Is the institution privately or publicly owned?</legend>
                            <div className="declaration-item">
                            <label>
                                <input type="radio" name="ownership" value="private" checked={formData.ownership === 'private'} onChange={handleInputChange} required /> Private
                            </label>
                            </div>
                            <div className="declaration-item">
                            <label>
                                <input type="radio" name="ownership" value="public" checked={formData.ownership === 'public'} onChange={handleInputChange} required /> Public
                            </label>
                            </div>
                        </fieldset>
                        <label>
                            Name of owner(s) or controlling body:
                            <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} className="compact-input" required />
                        </label>
                        <label>
                            Identity / Passport number:
                            <input type="text" name="identityNumber" value={formData.identityNumber} onChange={handleInputChange} className="compact-input" required />
                        </label>
                        <label>
                            Legal status of the institution (e.g., CC/trust):
                            <input type="text" name="legalStatus" value={formData.legalStatus} onChange={handleInputChange} className="compact-input" required />
                        </label>
                    </section>
                )}
                {currentPage === 1 && (
                    <section className="contact-information">
                        <h2>CONTACT INFORMATION</h2>
                        <label>
                            Name and title of person completing application:
                            <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="compact-input" required />
                        </label>
                        <label>
                            Telephone no.:
                            <input type="tel" name="contactTelephone" value={formData.contactTelephone} onChange={handleInputChange} className="compact-input" required />
                        </label>
                        <label>
                            Position:
                            <input type="text" name="contactPosition" value={formData.contactPosition} onChange={handleInputChange} className="compact-input" required />
                        </label>
                        <label>
                            Postal Address:
                            <input type="text" name="postalAddress" value={formData.postalAddress} onChange={handleInputChange} className="compact-input" required />
                        </label>
                        <label>
                            Email Address:
                            <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className="compact-input" required />
                        </label>
                    </section>
                )}

                {currentPage === 2 && (
    <section className="senior-management">
        <h2>DETAILS OF SENIOR MANAGEMENT</h2>
        <p>e.g., Heads of Department, Rectors, and Senior Administrators</p>
        
        {/* Iterate over each senior management entry */}
        {formData.seniorManagement.map((man, index) => (
            <div key={man.id} className="senior-management-entry">
                <label>
                    Name and Surname:
                    <input
                        type="text"
                        name="seniorName"
                        value={man.seniorName} // Bind to state
                        onChange={(e) => handleSeniorManagementChange(man.id, 'seniorName', e.target.value)} // Handle change
                        className="compact-input"
                        required
                    />
                </label>
                <label>
                    Position:
                    <input
                        type="text"
                        name="seniorPosition"
                        value={man.seniorPosition} // Bind to state
                        onChange={(e) => handleSeniorManagementChange(man.id, 'seniorPosition', e.target.value)} // Handle change
                        className="compact-input"
                        required
                    />
                </label>
                <label>
                    Identity / Passport Number:
                    <input
                        type="text"
                        name="seniorIdentityNumber"
                        value={man.seniorIdentityNumber} // Bind to state
                        onChange={(e) => handleSeniorManagementChange(man.id, 'seniorIdentityNumber', e.target.value)} // Handle change
                        className="compact-input"
                        required
                    />
                </label>

                {/* Button to remove this senior management entry */}
                <button type="button" onClick={() => removeSeniorManagement(man.id)} className="remove-button">
                    Remove
                </button>
            </div>
        ))}

        {/* Button to add a new senior management entry */}
        <button type="button" onClick={addSeniorManagement} className="add-button">
            Add Senior Management
        </button>
    </section>
)}

{currentPage === 3 && (
    <section className="section-b">
        <h2>SECTION “B” – OVERVIEW OF OPERATIONS</h2>

        <label>
            How many delivery locations does the institution operate:
            <input
                type="number"
                name="deliveryCount"
                value={formData.deliveryCount} // Bind to state
                onChange={(e) => setFormData({ ...formData, deliveryCount: e.target.value })} // Handle change
                className="compact-input"
                required
            />
        </label>

        <p>Provide full address of all operation locations (attach sheet if necessary)</p>

        {/* Iterate over each delivery location */}
        {formData.deliveryLocations.map((loc, index) => (
            <div key={loc.id} className="delivery-location">
                <label>
                    Nr:
                    <input
                        type="text"
                        name="locationNumber"
                        value={loc.locationNumber} // Bind to state
                        onChange={(e) => handleDeliveryLocationChange(loc.id, 'locationNumber', e.target.value)} // Handle change
                        className="compact-input"
                    />
                </label>
                <label>
                    Town:
                    <input
                        type="text"
                        name="town"
                        value={loc.town} // Bind to state
                        onChange={(e) => handleDeliveryLocationChange(loc.id, 'town', e.target.value)} // Handle change
                        className="compact-input"
                    />
                </label>
                <label>
                    Region:
                    <input
                        type="text"
                        name="region"
                        value={loc.region} // Bind to state
                        onChange={(e) => handleDeliveryLocationChange(loc.id, 'region', e.target.value)} // Handle change
                        className="compact-input"
                    />
                </label>
                <label>
                    Physical Address:
                    <input
                        type="text"
                        name="physicalAddress"
                        value={loc.physicalAddress} // Bind to state
                        onChange={(e) => handleDeliveryLocationChange(loc.id, 'physicalAddress', e.target.value)} // Handle change
                        className="compact-input"
                    />
                </label>

                {/* Button to remove this delivery location */}
                <button type="button" onClick={() => removeDeliveryLocation(loc.id)} className="remove-button">
                    Remove
                </button>
            </div>
        ))}

        {/* Button to add a new delivery location */}
        <button type="button" onClick={addDeliveryLocation} className="add-button">
            Add Delivery Location
        </button>
    </section>
)}


{currentPage === 4 && (
    <section className="proposed-scope">
        <h2>PROPOSED SCOPE OF SERVICES</h2>
        <p>List all qualifications currently offered by the institution for which accreditation is sought:</p>

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
                {formData.rows.map((row, index) => (
                    <tr key={row.id}>
                        <td>
                            <input
                                type="text"
                                name="qualificationNo"
                                value={row.qualificationNo} // Bind to state
                                onChange={(e) => handleRowChange(row.id, 'qualificationNo', e.target.value)} // Handle change
                                className="compact-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="qualificationTitle"
                                value={row.qualificationTitle} // Bind to state
                                onChange={(e) => handleRowChange(row.id, 'qualificationTitle', e.target.value)} // Handle change
                                className="compact-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="nqfLevel"
                                value={row.nqfLevel} // Bind to state
                                onChange={(e) => handleRowChange(row.id, 'nqfLevel', e.target.value)} // Handle change
                                className="compact-input"
                            />
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                name={`mode_${row.id}`}
                                checked={row.fullTime}
                                onChange={(e) => handleRowChange(row.id, 'fullTime', e.target.checked)} // Handle change
                            />
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                name={`mode_${row.id}`}
                                checked={row.partTime}
                                onChange={(e) => handleRowChange(row.id, 'partTime', e.target.checked)} // Handle change
                            />
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                name={`mode_${row.id}`}
                                checked={row.distance}
                                onChange={(e) => handleRowChange(row.id, 'distance', e.target.checked)} // Handle change
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="franchisePartner"
                                value={row.franchisePartner} // Bind to state
                                onChange={(e) => handleRowChange(row.id, 'franchisePartner', e.target.value)} // Handle change
                                className="compact-input"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="site"
                                value={row.site} // Bind to state
                                onChange={(e) => handleRowChange(row.id, 'site', e.target.value)} // Handle change
                                className="compact-input"
                            />
                        </td>
                        <td>
                            <button type="button" onClick={() => removeRow(row.id)} className="remove-button">
                                Remove
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <button type="button" onClick={addRow} className="add-button">
            Add Row
        </button>

        {/* Hidden file input for document upload */}
        <input
            type="file"
            id="documentUpload"
            name="documentUpload"
            style={{ display: 'none' }}
            multiple
            onChange={(e) => handleFileChange(e, setFileNames)}
        />
        <p>
            Or{' '}
            <button
                type="button"
                className="upload-button"
                onClick={() => document.getElementById('documentUpload').click()}
            >
                Upload Sheet
            </button>
        </p>

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
    </section>
)}

                {currentPage === 5 && (
                    <section className="declaration">
                        <h2 className="decler">DECLARATION</h2>
                        <div className="declaration-page">
            <div className="declaration-item">
                <label>
                    <input
                        type="checkbox"
                        name="agreeAll"
                        checked={agreeAll}
                        onChange={handleAgreeAllChange}
                    />{' '}
                    Agree to all
                </label>
            </div>
            <div className="declaration-item">
                <label>
                    <input
                        type="checkbox"
                        name="declaration1"
                        checked={declarations.declaration1}
                        onChange={handleIndividualChange}
                        required
                    />{' '}
                    I declare that the information provided is true and correct.
                </label>
            </div>
            <div className="declaration-item">
                <label>
                    <input
                        type="checkbox"
                        name="declaration2"
                        checked={declarations.declaration2}
                        onChange={handleIndividualChange}
                        required
                    />{' '}
                    I agree to abide by any applicable legislation of relevance to our operations.
                </label>
            </div>
            <div className="declaration-item">
                <label>
                    <input
                        type="checkbox"
                        name="declaration3"
                        checked={declarations.declaration3}
                        onChange={handleIndividualChange}
                        required
                    />{' '}
                    I agree to notify the NQA of any significant changes to our position as an institution.
                </label>
            </div>
            <div className="declaration-item">
                <label>
                    <input
                        type="checkbox"
                        name="declaration4"
                        checked={declarations.declaration4}
                        onChange={handleIndividualChange}
                        required
                    />{' '}
                    I agree to give free and full access to any facilities and documents relevant to this application and its ongoing effect.
                </label>
            </div>
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
