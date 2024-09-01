import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../utils/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Paper,
  Avatar,
} from '@mui/material';
const SideBar = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Assuming you have an admin document with a specific ID
        const docRef = doc(db, 'admins', auth.currentUser.email); // Replace 'adminDocId' with the actual document ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAdminData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        setError('Error fetching data');
        console.error("Error fetching admin data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-gray-800 text-white overflow-hidden">
  <div className="profile-header mb-8">
    <h2 className="text-2xl font-bold">Admin Profile</h2>
  </div>

  {adminData ? (
    <div className="profile-info">
      <div className="flex flex-col mb-4">
        <span className="font-semibold text-lg">Name:</span> 
        <span className="text-lg">{adminData.Name}</span>
      </div>
      <div className="flex flex-col mb-4">
        <span className="font-semibold text-lg">Department:</span> 
        <span className="text-lg">{adminData.Department}</span>
      </div>
      <div className="flex flex-col mb-4">
        <span className="font-semibold text-lg">Email:</span> 
        <span className="text-lg">{adminData.Email}</span>
      </div>
    </div>
  ) : (
    <div className="text-lg text-gray-400">No data available</div>
  )}

  <div className="mt-auto">
    <button
      onClick={handleLogout}
      className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  </div>
</div>
  );
};

export default SideBar;
