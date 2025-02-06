import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import './StaffDetails.css'; // External CSS for styling

const StaffDetailsPage = () => {
  const location = useLocation();
  const [staffData, setStaffData] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const staffDataEncoded = queryParams.get("data");
    if (staffDataEncoded) {
      // Directly use atob() to decode Base64 data
      const decodedData = atob(staffDataEncoded);
      const parsedData = JSON.parse(decodedData);
      setStaffData(parsedData);
    }
  }, [location]);

  return staffData ? (
    <div className="staff-details-container">
      <h1>Staff Details</h1>
      <div className="staff-info">
        {staffData.image ? (
          <img src={staffData.image} alt="Staff" className="staff-image" />
        ) : (
          <div className="staff-image-placeholder"></div>
        )}
        <div className="staff-info-text">
          <p><strong>First Name:</strong> {staffData.firstname}</p>
          <p><strong>Last Name:</strong> {staffData.lastname}</p>
          <p><strong>Employee ID:</strong> {staffData.employeeid}</p>
          <p><strong>Nationality:</strong> {staffData.nationality}</p>
          <p><strong>Contact Numbers:</strong> {staffData.contactnumber1}, {staffData.contactnumber2}</p>
          <p><strong>Designation:</strong> {staffData.designation}</p>
          <p><strong>Superior:</strong> {staffData.superior}</p>
          <p><strong>Department:</strong> {staffData.department}</p>
        </div>
      </div>
    </div>
  ) : (
    <p>Loading staff details...</p>
  );
};

export default StaffDetailsPage;
