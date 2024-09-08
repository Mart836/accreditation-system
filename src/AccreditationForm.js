import React, { useState } from 'react';
import './AccreditationForm.css'; // Create this CSS file for styling

const AccreditationForm = () => {
    const [agreeAll, setAgreeAll] = useState(false);
    const [rows, setRows] = useState([{ id: Date.now() }]); // Initial row with unique ID
    const [deliveryLocations, setDeliveryLocations] = useState([{ id: Date.now() }]); // Initial delivery location
    const [seniorManagement, setSeniorManagement] = useState([{ id: Date.now() }]); // Initial senior management

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

    const addDeliveryLocation = () => {
        setDeliveryLocations([...deliveryLocations, { id: Date.now() }]);
    };

    const removeDeliveryLocation = (id) => {
        setDeliveryLocations(deliveryLocations.filter(loc => loc.id !== id));
    };

    const addSeniorManagement = () => {
        setSeniorManagement([...seniorManagement, { id: Date.now() }]);
    };

    const removeSeniorManagement = (id) => {
        setSeniorManagement(seniorManagement.filter(man => man.id !== id));
    };

    return (
        <div className="accreditation-form">
            <header className="form-header">
            <div className="yellow-strip"></div>
                <h1>Application for Accreditation</h1>
                <p>NB: This application form must be completed by persons, institutions, and organisations seeking accreditation and not for re-accreditation and expansion of accreditation.</p>
            </header>
            <form>
                {/* SECTION A - TRAINING PROVIDER INFORMATION */}
                <section className="section-a">
                    <h2>SECTION “A” – TRAINING PROVIDER INFORMATION</h2>
                    <p>Please complete all areas of Section “A”</p>
                    <label>
                        Operating name of the institution:
                        <input type="text" name="institutionName" className="compact-input" required />
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
                    <label>
                        Legal status of the institution (e.g., CC/trust):
                        <input type="text" name="legalStatus" className="compact-input" required />
                    </label>
                </section>
                
                {/* CONTACT INFORMATION */}
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
                
                {/* SENIOR MANAGEMENT DETAILS */}
                <section className="senior-management">
                    <h2>DETAILS OF SENIOR MANAGEMENT</h2>
                    <p>e.g., Heads of Department, Rectors, and Senior Administrators</p>
                    {seniorManagement.map((man) => (
                        <div key={man.id} className="senior-management-entry">
                            <label>
                                Name and Surname:
                                <input type="text" name="seniorName" className="compact-input" required />
                            </label>
                            <label>
                                Position:
                                <input type="text" name="seniorPosition" className="compact-input" required />
                            </label>
                            <label>
                                Identity / Passport Number:
                                <input type="text" name="seniorIdentityNumber" className="compact-input" required />
                            </label>
                            <button type="button" onClick={() => removeSeniorManagement(man.id)} className="remove-button">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addSeniorManagement} className="add-button">Add Senior Management</button>
                </section>
                
                {/* SECTION B - OVERVIEW OF OPERATIONS */}
                <section className="section-b">
                    <h2>SECTION “B” – OVERVIEW OF OPERATIONS</h2>
                    <p>Please complete all areas of Section B</p>
                    <label>
                        How many delivery locations does the institution operate:
                        <input type="number" name="deliveryCount" className="compact-input" required />
                    </label>
                    <p>Provide full address of all operation locations (attach sheet if necessary)</p>
                    {deliveryLocations.map((loc) => (
                        <div key={loc.id} className="delivery-location">
                            <label>
                                Nr:
                                <input type="text" name="locationNumber" className="compact-input" />
                            </label>
                            <label>
                                Town:
                                <input type="text" name="town" className="compact-input" />
                            </label>
                            <label>
                                Region:
                                <input type="text" name="region" className="compact-input" />
                            </label>
                            <label>
                                Physical Address:
                                <input type="text" name="physicalAddress" className="compact-input" />
                            </label>
                            <button type="button" onClick={() => removeDeliveryLocation(loc.id)} className="remove-button">Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addDeliveryLocation} className="add-button">Add Delivery Location</button>
                </section>
                
                {/* PROPOSED SCOPE OF SERVICES */}
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
                
                {/* DECLARATION */}
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
