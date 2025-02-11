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
    staffImage: null, // New image field
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert image to a Blob and store it in formData
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        const blob = new Blob([arrayBuffer], { type: file.type });
        setFormData({ ...formData, staffImage: blob });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleEdit = (staff) => {
    setIsEditing(true); // Enable edit mode
    setFormData({
      staffId: staff.staffid || '', // Populate the staffId for the update operation
      firstname: staff.firstname || '',
      lastname: staff.lastname || '',
      employeeid: staff.employeeid || '',
      nationality: staff.nationality || '',
      contactnumber1: staff.contactnumber1 || '',
      countrycode1: staff.countrycode1 || '',
      contactnumber2: staff.contactnumber2 || '',
      countrycode2: staff.countrycode2 || '',
      designation: staff.designation || '',
      superior: staff.superior || '',
      department: staff.department || '',
      staffImage: staff.staffImage || null,
    });
  };
  

    const handleDelete = async (staffId) => {
    try {
      await axios.delete(`${frontEndURL}/api/staffRoutes/staff/${staffId}`);
      fetchStaffDetails();
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataPayload = new FormData();
      for (let key in formData) {
        formDataPayload.append(key, formData[key]);
      }

      if (isEditing) {
        await axios.put(`${frontEndURL}/api/staffRoutes/staff/${formData.staffId}`, formDataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(`${frontEndURL}/api/staffRoutes/staff`, formDataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
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
        staffImage: null,
      });
      setIsEditing(false);
      fetchStaffDetails();
    } catch (error) {
      console.error('Error saving staff details:', error);
    }
  };

  return (
    <div className="dashboard-container">
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
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">{isEditing ? 'Update' : 'Create'}</button>
      </form>

      {/* Table */}
      <div className="staff-secondary">
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
                      value={`http://profile.medianet.mv/#/staff-details?data=${Buffer.from(
                        JSON.stringify({ staffid: staff.staffid })
                      ).toString('base64')}`}
                    />
                  </Link>
                </td>
                <td>
                  <button onClick={() => handleEdit(staff)}>Edit</button>
                  <button onClick={() => handleDelete(staff.staffid)}>Delete</button>
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

