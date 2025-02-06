import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { Buffer } from 'buffer';

import './Dashboard.css';
import './QRCodeDialog.css';

const frontEndURL = 'https://medianet-staff-frontend.onrender.com';

const Dashboard = () => {
  const [staffList, setStaffList] = useState([]);
  const qrCodeRef = useRef();
  const [showDialog, setShowDialog] = useState(false);

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);
  const [formData, setFormData] = useState({
    staffId: '',
    firstname: '',
    lastname: '',
    employeeid: '',
    nationality: '',
    contactnumber1: '',
    countrycode1: '',
    contactnumber2: '',
    countrycode2: '',
    designation: '',
    superior: '',
    department: '',
  });
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    fetchStaffDetails();
  }, []);

  const fetchStaffDetails = async () => {
    try {
      const response = await axios.get(`${frontEndURL}/api/staffRoutes/staff`);
      setStaffList(response.data);
    } catch (error) {
      console.error('Error fetching staff details:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${frontEndURL}/api/staffRoutes/staff/${formData.staffid}`, formData);
      } else {
        await axios.post(`${frontEndURL}/api/staffRoutes/staff`, formData);
      }
      setFormData({
        staffId: '',
        firstname: '',
        lastname: '',
        employeeid: '',
        nationality: '',
        contactnumber1: '',
        countrycode1: '',
        contactnumber2: '',
        countrycode2: '',
        designation: '',
        superior: '',
        department: '',
      });
      setIsEditing(false);
      fetchStaffDetails();
    } catch (error) {
      console.error('Error saving staff details:', error);
    }
  };

  const handleEdit = (staff) => {
    setFormData(staff);
    setIsEditing(true);
  };

  const handleDelete = async (staffId) => {
    try {
      await axios.delete(`${frontEndURL}/api/staffRoutes/staff/${staffId}`);
      fetchStaffDetails();
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };
  

  return (
    <div className="dashboard-container">
      <div>
        <h1>Staff Details Management</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="staff-form">
          <input name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleInputChange} />
          <input name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleInputChange} />
          <input name="employeeid" placeholder="Employee ID" value={formData.employeeid} onChange={handleInputChange} />
          <input name="nationality" placeholder="Nationality" value={formData.nationality} onChange={handleInputChange} />
          <input name="countrycode1" placeholder="Country Code 1" value={formData.countrycode1} onChange={handleInputChange} />
          <input name="contactnumber1" placeholder="Contact Number 1" value={formData.contactnumber1} onChange={handleInputChange} />
          <input name="countrycode2" placeholder="Country Code 2" value={formData.countrycode2} onChange={handleInputChange} />
          <input name="contactnumber2" placeholder="Contact Number 2" value={formData.contactnumber2} onChange={handleInputChange} />
          <input name="designation" placeholder="Designation" value={formData.designation} onChange={handleInputChange} />
          <input name="superior" placeholder="Superior" value={formData.superior} onChange={handleInputChange} />
          <input name="department" placeholder="Department" value={formData.department} onChange={handleInputChange} />
          <button type="submit">{isEditing ? 'Update' : 'Create'}</button>
        </form>
      </div>

      {/* Table */}
      <div className='staff-secondary'>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Employee ID</th>
              <th>Nationality</th>
              <th>Contact Numbers</th>
              <th>Designation</th>
              <th>Superior</th>
              <th>Department</th>
              <th>QR Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.staffid}>
                <td>{staff.firstname}</td>
                <td>{staff.lastname}</td>
                <td>{staff.employeeid}</td>
                <td>{staff.nationality}</td>
                <td>{staff.contactnumber1}, {staff.contactnumber2}</td>
                <td>{staff.designation}</td>
                <td>{staff.superior}</td>
                <td>{staff.department}</td>

                <td>
                  <Link to={`/staff-details?data=${Buffer.from(JSON.stringify(staff)).toString('base64')}`}>
                    <QRCodeCanvas
                       value={`${frontEndURL}/#/staff-details?data=${Buffer.from(JSON.stringify(staff)).toString('base64')}`}
                     />
                 </Link>



                  <button
                      style={{
                        marginTop: "10px",
                        padding: "5px 10px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={openDialog}
                    >
                      View QR as Image
                    </button>


                    {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box" ref={qrCodeRef}>
            <span className="close-icon" onClick={closeDialog}>
              &times;
            </span>
            <h3>QR Code</h3>
            <QRCodeCanvas
              value={`${frontEndURL}/staff-details?data=${encodeURIComponent(JSON.stringify(staff))}`}
              size={200}
            />
          </div>
        </div>
      )}
                </td>
                <td>
                  <div className='actions'>
                  <button onClick={() => handleEdit(staff)}>Edit</button>
                  <button onClick={() => handleDelete(staff.staffid)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
