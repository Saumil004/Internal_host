import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { db, auth } from './Firebase'; // Adjust the path if necessary
import { collection, query, orderBy, getDocs, where, doc, getDoc } from 'firebase/firestore';
import { confirmPasswordReset, onAuthStateChanged } from 'firebase/auth';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const icons = {
  name: (
    <svg
      className="w-5 h-5 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5.121 17.804A4.5 4.5 0 015 13.5V9a7 7 0 0114 0v4.5a4.5 4.5 0 01-.121 4.304M9 17.5v4m6-4v4m-3-4v4"
      />
    </svg>
  ),
  weight: (
    <svg
      className="w-5 h-5 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 4.75V4a2 2 0 00-2-2h-2a2 2 0 00-2 2v.75m6 0V4a2 2 0 012-2h2a2 2 0 012 2v.75M9.5 10.5h.01M14.5 10.5h.01M8 18.5a6 6 0 108 0"
      />
    </svg>
  ),
  age: (
    <svg
      className="w-5 h-5 text-purple-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 11.25V4a4 4 0 118 0v7.25M5 20h14a1 1 0 001-1v-5a1 1 0 00-1-1H5a1 1 0 00-1 1v5a1 1 0 001 1z"
      />
    </svg>
  ),
  gender: (
    <svg
      className="w-5 h-5 text-pink-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zM12 14c-4.418 0-8 1.791-8 4v2h16v-2c0-2.209-3.582-4-8-4z"
      />
    </svg>
  ),
  allergy: (
    <svg
      className="w-5 h-5 text-red-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 14.5c-3.866 0-7-1.343-7-3V8.5c0-1.657 3.134-3 7-3s7 1.343 7 3v3c0 1.657-3.134 3-7 3zm0 2c4.418 0 8 1.343 8 3v3H4v-3c0-1.657-3.582-3-8-3z"
      />
    </svg>
  ),
  lifestyle: (
    <svg
      className="w-5 h-5 text-yellow-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 12h-4v8H8v-8H4m6-8l4-4 4 4M4 12h16M4 22h16"
      />
    </svg>
  ),
  height: (
    <svg
      className="w-5 h-5 text-indigo-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18V6h12v12M9 9h6M9 15h6"
      />
    </svg>
  ),
  discharged: (
    <svg
      className="w-5 h-5 text-teal-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
};

const Modal = ({ isOpen, onClose, userData }) => {
  const [bpData, setBpData] = useState([]);
  const [bloodReport, setbloodReport] = useState([])
  const [Urine, setUrine] = useState([])
  const [Extra, setExtra] = useState([])
  const [bloodPressure, setbloodPressure] = useState([])



  useEffect(() => {
    const fetchBPData = async () => {
      try {
         
          const email = userData.Email;
          const recordsSnapshot = db
          .collection('bloodPressure')
          .doc(email)
          .collection('records')
          .get();
        
          const records = [];
          recordsSnapshot.forEach(doc => {
            records.push({ id: doc.id, data: doc.data() });
          });

          console.log(records)
          
          setBpData(records);
        
      } catch (error) {
        console.error('Failed to fetch BP data', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, fetchBPData);
    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  const chartData = {
    labels: bpData.map(record => new Date(record.timestamp.toDate()).toLocaleDateString()),
    datasets: [
      {
        label: 'Systolic',
        data: bpData.map(record => record.systolic),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
      {
        label: 'Diastolic',
        data: bpData.map(record => record.diastolic),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Blood Pressure (mmHg)',
        },
      },
    },
  };

 const fetchBloodReport = async (email) => {
  try {
    // Create a reference to the specific document using the email as the document ID
    const bloodReportDocRef = doc(db, 'bloodReports', email);
    
    // Fetch the document data
    const x = await getDoc(bloodReportDocRef);

    if (x.exists()) {
      const bloodReportData = x.data();
      setbloodReport(bloodReportData);
      // console.log(bloodReportData)
    } 
  } catch (error) {
    console.error('Failed to fetch blood report', error);
  }
};


 const fetchUrineReport = async (email) => {
  try {
    const bloodReportDocRef = doc(db, 'UrineReport', email);
    
    const x = await getDoc(bloodReportDocRef);

    if (x.exists()) {
      const bloodReportData = x.data();
      setUrine(bloodReportData);
    } 
  } catch (error) {
    console.error('Failed to fetch urine report', error);
  }
};


const fetchExtra = async (email) => {
  try {
    const bloodReportDocRef = doc(db, 'Additional', email);
    
    const x = await getDoc(bloodReportDocRef);

    if (x.exists()) {
      const bloodReportData = x.data();
      setExtra(bloodReportData);
    } 
  } catch (error) {
    console.error('Failed to fetch urine report', error);
  }
};

const fetchBP = async (email) => {
  try {
    const bloodReportDocRef = doc(db, 'bloodPressure', email);
    
    const x = await getDoc(bloodReportDocRef);

    if (x.exists()) {
      const bloodReportData = x.data();
      setbloodPressure(bloodReportData);
    } 
  } catch (error) {
    console.error('Failed to fetch urine report', error);
  }
}

function flattenJson(nestedJson, parentKey = '', sep = '_') {
    const flattenedDict = {};

    for (const [key, value] of Object.entries(nestedJson)) {
        const newKey = parentKey ? `${parentKey}${sep}${key}` : key;

        if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    Object.assign(flattenedDict, flattenJson(item, `${newKey}${sep}${index}`, sep));
                });
            } else {
                Object.assign(flattenedDict, flattenJson(value, newKey, sep));
            }
        } else {
            flattenedDict[newKey] = value;
        }
    }

    return flattenedDict;
}







  const fetchAndSendReport = async () => {
    try {
      if (userData.Email) {
        const email = userData.Email;

       
        const userSnapshot = await getDocs(
          query(collection(db, 'users'), where('Email', '==', email))
        );
        const users = userSnapshot.docs.map(doc => doc.data());

       
        
        fetchBloodReport(email)
        fetchBP(email)
        fetchUrineReport(email)

        fetchExtra(email)

        const reportData = {
          users,
          bloodReport,
          bloodPressure,
          Urine,
          Extra,
        };


       
        const flattenedUsers = reportData.users.map(item => flattenJson(item));
        const flattenedBloodReport = flattenJson(reportData.bloodReport);
        const flattenedBloodPressure = flattenJson(reportData.bloodPressure);
        const flattenedUrine = flattenJson(reportData.Urine);
        const flattenedExtra = flattenJson(reportData.Extra);


       const mergedFlattenedData = Object.assign(
            {},
            ...flattenedUsers,
            flattenedBloodReport,
            flattenedBloodPressure,
            flattenedUrine,
            flattenedExtra
        );

        // console.log(mergedFlattenedData)



        const serverUrl = ' http://127.0.0.1:5000'; 

        const response = await fetch(serverUrl + '/diabetes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mergedFlattenedData),
        });

        const data = await response.json();    

        console.log(data.response)    

       
      } else {
        console.error('User data is not available or missing email.');
      }
    } catch (error) {
      console.error('Failed to fetch and send report', error);
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gradient-to-r from-blue-100 to-white p-8 rounded-2xl shadow-lg w-11/12 max-w-lg relative">
        <button
          className="absolute top-3 right-3 p-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">Patient Details</h2>
        <div className="text-gray-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Displaying user data */}
            <div className="flex items-center space-x-3">
              {icons.name}
              <div>
                <p className="font-semibold">First Name:</p>
                <p className="text-sm text-gray-700">{userData.FirstName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {icons.name}
              <div>
                <p className="font-semibold">Last Name:</p>
                <p className="text-sm text-gray-700">{userData.LastName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {icons.weight}
              <div>
                <p className="font-semibold">Weight:</p>
                <p className="text-sm text-gray-700">{userData.Weight} kg</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {icons.age}
              <div>
                <p className="font-semibold">Age:</p>
                <p className="text-sm text-gray-700">{userData.Age} years</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {icons.gender}
              <div>
                <p className="font-semibold">Gender:</p>
                <p className="text-sm text-gray-700">{userData.Gender}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {icons.allergy}
              <div>
                <p className="font-semibold">Allergy:</p>
                <p className="text-sm text-gray-700">{userData.Allergy}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {icons.lifestyle}
              <div>
                <p className="font-semibold">Lifestyle:</p>
                <p className="text-sm text-gray-700">{userData.Lifestyle}</p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="flex justify-start mt-6">
          <button
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-full shadow-md hover:from-purple-600 hover:to-purple-800 transition duration-300"
            onClick={() => {

              console.log("Personalised Diagnostic button clicked");
            }}
          >
            Personalised Diagnostic
          </button>
          <div className=' px-10'></div>
          <button
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-full shadow-md hover:from-purple-600 hover:to-purple-800 transition duration-300"
            onClick={fetchAndSendReport}
          >
            Send Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;