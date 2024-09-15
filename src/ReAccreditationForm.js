import React, { useState } from 'react';
import backIcon from './back-icon.png'; 
import nextIcon from './next-icon.png';
import './ReAccreditationForm.css'; // Create this CSS file for styling


const AccreditationForm = () => {
    const [agreeAll, setAgreeAll] = useState(false);
    const [rows, setRows] = useState([{ id: Date.now() }]); // Initial row with unique ID
    const [deletedRows, setDeletedRows] = useState([{ id: Date.now() + 1 }]); // Initial deleted row with unique ID
    const [currentPage, setCurrentPage] = useState(0);
    const [fileNames, setFileNames] = useState([]);
    const [deletedFileNames, setDeletedFileNames] = useState([]);

    const pages = [
        'SECTION A - TRAINING PROVIDER INFORMATION',
        'CONTACT INFORMATION',
        'SECTION B - INFORMATION FOR RE-ACCREDITATIO',
        'DECLARATION',
    ];

    const handleAgreeAllChange = (e) => {
        const checked = e.target.checked;
        setAgreeAll(checked);
        document.querySelectorAll('.declaration input[type="checkbox"]').forEach((checkbox) => {
            checkbox.checked = checked;
        });
    };

    const addRow = () => {
        setRows([...rows, { id: Date.now() }]);
    };

    const addDeletedRow = () => {
        setDeletedRows([...deletedRows, { id: Date.now() }]);
    };

    const removeRow = (id) => {
        setRows(rows.filter(row => row.id !== id));
    };

    const removeDeletedRow = (id) => {
        setDeletedRows(deletedRows.filter(row => row.id !== id));
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
      const handleFileChange = (e, setFiles) => {
        const files = Array.from(e.target.files);
        const fileNames = files.map(file => file.name);
        setFiles(fileNames);
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
            <form>
            {currentPage === 0 && (
                <section className="section-a">
                    <h2>SECTION A - TRAINING PROVIDER INFORMATION</h2>
                    <p>Please complete all areas of Section A</p>
                    <label>
                        Operating name of the institution:
                        <input type="text" name="institutionName" className="compact-input" required />
                    </label>
                    <label>
                        Accreditation number:
                        <input type="text" name="accreditationNumber" className="compact-input" required />
                    </label>
                    <label>
                        Street Address:
                        <input type="text" name="streetAddress" className="compact-input" required />
                    </label>
                    <label>
                        Mailing Address:
                        <input type="text" name="mailingAddress" className="compact-input" required />
                    </label>
                    <label>
                        Telephone number:
                        <input type="tel" name="telephoneNumber" className="compact-input" required />
                    </label>
                    <label>
                        E-mail Address:
                        <input type="email" name="emailAddress" className="compact-input" required />
                    </label>
                    <fieldset>
                        <legend>Is the institution privately or publicly owned?</legend>
                        <label>
                        <div className="declaration-item">
                            <input type="radio" name="ownership" value="private" required />
                            Private
                        </div>
                        </label>
                        <label>
                        <div className="declaration-item">
                            <input type="radio" name="ownership" value="public" required />
                            Public
                        </div>
                        </label>
                    </fieldset>
                    <label>
                        Name of owner(s) or controlling body:
                        <input type="text" name="ownerName" className="compact-input" required />
                    </label>
                    <label>
                        Identity / Passport number:
                        <input type="text" name="identityNumber" className="compact-input" required />
                    </label>
                    <fieldset>
                        <legend>Since the last accreditation, has the organization:</legend>
                        <label>
                        <div className="declaration-item">
                            <input type="checkbox" name="audited" />
                            Been audited or investigated by the NQA or other body
                        </div>
                        </label>
                        <label>
                        <div className="declaration-item">
                            <input type="checkbox" name="offence" />
                            Committed an offence under section 13 of the Act
                        </div>
                        </label>
                        <label>
                        <div className="declaration-item">
                            <input type="checkbox" name="changes" />
                            Made any changes to existing qualifications
                        </div>
                        </label>
                        <label>
                        <div className="declaration-item">
                            <input type="checkbox" name="selfEvaluation" />
                            Undertaken any formal self-evaluation or internal audit
                        </div>
                        </label>
                        <div className="declaration-item">
                        <p>If yes to any, please attach relevant information or documentation.</p>
                        </div>
                          {/* Add file input for document upload */}
                        <div className="upload-section">
                        <label htmlFor="documentUpload" className="upload-label">Attach Documentation:</label>
                        <input type="file" id="documentUpload" name="documentUpload" multiple />
                        </div>
                    </fieldset>
                </section>
            )}
                {currentPage === 1 && (
                <section className="contact-information">
                    <h2>CONTACT INFORMATION</h2>
                    <label>
                        Name and title of person completing application (Contact Person):
                        <input type="text" name="contactPerson" className="compact-input" required />
                    </label>
                    <label>
                        Telephone no.:
                        <input type="tel" name="contactTelephone" className="compact-input" required />
                    </label>
                    <label>
                        Position:
                        <input type="text" name="contactPosition" className="compact-input" required />
                    </label>
                    <label>
                        Postal Address:
                        <input type="text" name="postalAddress" className="compact-input" required />
                    </label>
                    <label>
                        Email Address:
                        <input type="email" name="contactEmail" className="compact-input" required />
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
                            {rows.map((row) => (
                                <tr key={row.id}>
                                    <td><input type="text" name="qualificationNo" className="compact-input" /></td>
                                    <td><input type="text" name="qualificationTitle" className="compact-input" /></td>
                                    <td><input type="text" name="nqfLevel" className="compact-input" /></td>
                                    <td>
                                        <label>
                                            <input type="checkbox" name={`attendance_${row.id}`} value="full-time" /> 
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" name={`attendance_${row.id}`} value="part-time" /> 
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" name={`attendance_${row.id}`} value="distance" /> 
                                        </label>
                                    </td>
                                    <td><input type="text" name="franchisePartners" className="compact-input" /></td>
                                    <td><input type="text" name="sites" className="compact-input" /></td>
                                    <td>
                                        <button type="button" onClick={() => removeRow(row.id)} className="remove-row-button">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="button" onClick={addRow} className="add-row-button">Add Row</button>
                      {/* Hidden file input */}
                      <input
                            type="file"
                            id="documentUpload"
                            name="documentUpload"
                            style={{ display: 'none' }}
                            multiple
                            onChange={(e) => handleFileChange(e, setFileNames)}
                        />
                        <input
                            type="file"
                            id="documentUpload2"
                            name="documentUpload2"
                            style={{ display: 'none' }}
                            multiple
                            onChange={(e) => handleFileChange(e, setDeletedFileNames)}
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
                            {deletedRows.map((row) => (
                                <tr key={row.id}>
                                    <td><input type="text" name="qualificationNoDeleted" className="compact-input" /></td>
                                    <td><input type="text" name="qualificationTitleDeleted" className="compact-input" /></td>
                                    <td><input type="text" name="nqfLevelDeleted" className="compact-input" /></td>
                                    <td>
                                        <label>
                                            <input type="checkbox" name={`attendanceDeleted_${row.id}`} value="full-time" /> 
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" name={`attendanceDeleted_${row.id}`} value="part-time" /> 
                                        </label>
                                    </td>
                                    <td>
                                        <label>
                                            <input type="checkbox" name={`attendanceDeleted_${row.id}`} value="distance" /> 
                                        </label>
                                    </td>
                                    <td><input type="text" name="franchisePartnersDeleted" className="compact-input" /></td>
                                    <td><input type="text" name="sitesDeleted" className="compact-input" /></td>
                                    <td>
                                        <button type="button" onClick={() => removeDeletedRow(row.id)} className="remove-row-button">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="button" onClick={addDeletedRow} className="add-row-button">Add Row</button>
                    <p>
                            Or
                            <button type="button" className="upload-button" onClick={() => document.getElementById('documentUpload2').click()}>
                                Upload Deleted Qualifications Sheet
                            </button>
                        </p>
                        
                        {/* Display uploaded file names */}
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
                         <input type="checkbox" name="agreeAll" checked={agreeAll} onChange={handleAgreeAllChange} /> Agree to all
                        </label>
                     </div>
                     <div className="declaration-item">
                        <label>
                        <input type="checkbox" name="declaration" />
                         I declare that all information in the form and pack is true and correct.
                       </label>
                     </div>
                     <div className="declaration-item">
                       <label>
                       <input type="checkbox" name="legislation" />
                       I agree to abide by any applicable legislation of relevance to our operations.
                       </label>
                     </div>
                     <div className="declaration-item">
                       <label>
                       <input type="checkbox" name="notifyNQA" />
                       I agree to notify the NQA of any significant changes to our position as an institution.
                       </label>
                     </div>
                       <div className="declaration-item">
                       <label>
                       <input type="checkbox" name="access" />
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
