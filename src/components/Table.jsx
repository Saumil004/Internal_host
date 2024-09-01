import React, { useState, useEffect } from 'react';
import { db } from '../utils/Firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const PatientTable = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const patientList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPatients(patientList);
      } catch (error) {
        console.error("Error fetching patients: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const getCurrentDate = () => new Date().toLocaleDateString();

  const admitPatient = async (id) => {
    try {
      const patientRef = doc(db, 'users', id);
      await updateDoc(patientRef, {
        admitted: true,
        admitDate: Timestamp.now()  // Store current date as admission date
      });
      setPatients(prevPatients =>
        prevPatients.map(patient =>
          patient.id === id ? { ...patient, admitted: true, admitDate: Timestamp.now() } : patient
        )
      );
    } catch (error) {
      console.error("Error admitting patient: ", error);
    }
  };

  const toggleDischarge = async (id, isDischarged) => {
    try {
      const patientRef = doc(db, 'users', id);
      await updateDoc(patientRef, {
        discharged: !isDischarged,
        dischargeDate: !isDischarged ? Timestamp.now() : null  // Set discharge date if discharging
      });
      setPatients(prevPatients =>
        prevPatients.map(patient =>
          patient.id === id ? { ...patient, discharged: !isDischarged, dischargeDate: !isDischarged ? Timestamp.now() : null } : patient
        )
      );
    } catch (error) {
      console.error("Error toggling discharge status: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setPatients(prevPatients => prevPatients.filter(patient => patient.id !== id));
    } catch (error) {
      console.error("Error deleting patient: ", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border-b p-2">Patient Name</th>
            <th className="border-b p-2">Admit Date</th>
            <th className="border-b p-2">Discharge Date</th>
            <th className="border-b p-2">Phone Number</th>
            <th className="border-b p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td className="border-b p-2">{patient.FirstName} {patient.LastName}</td>
              <td className="border-b p-2">
                {patient.admitDate ? new Date(patient.admitDate.seconds * 1000).toLocaleDateString() : 'Not Admitted'}
              </td>
              <td className="border-b p-2">
                {patient.discharged 
                  ? (patient.dischargeDate ? new Date(patient.dischargeDate.seconds * 1000).toLocaleDateString() : 'N/A')
                  : 'Not Discharged'}
              </td>
              <td className="border-b p-2">{patient.ph}</td>
              <td className="border-b p-2">
                {!patient.admitted ? (
                  <button
                    onClick={() => admitPatient(patient.id)}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                  >
                    Admit
                  </button>
                ) : (
                  <button
                    onClick={() => toggleDischarge(patient.id, patient.discharged)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                  >
                    {patient.discharged ? 'Undischarged' : 'Discharge'}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(patient.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
