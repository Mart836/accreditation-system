import React, { useState } from 'react';
import './ReAccreditationForm.css'; // Create this CSS file for styling


const AccreditationForm = () => {
    const [agreeAll, setAgreeAll] = useState(false);
    const [rows, setRows] = useState([{ id: Date.now() }]); // Initial row with unique ID
   

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

    const removeRow = (id) => {
        setRows(rows.filter(row => row.id !== id));
    };

    return (
        <div className="Expansionaccreditation-form">
            <header className="form-header">
                <div className="yellow-strip"></div>
                <h1>APPLICATION FOR EXPANSION OF ACCREDITATION</h1>
            </header>
            <form>
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

                </section>
                
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
                
                <section className="section-b">
                    <h2>SECTION B - INFORMATION ON SERVICES TO BE EXPANDED</h2>
                    <p>Please complete all areas of Section B</p>
                    <p>List all qualifications currently offered by the institution for which expansion is sought: (Additional sheets may be attached if necessary)</p>
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
                    <p>Or <button type="button" className="upload-button">Upload Sheet</button></p>

                </section>
                
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

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default AccreditationForm;
