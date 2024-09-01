import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

function CalendarCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

function ClipboardCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}

function PhoneIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function FirestoreQueryComponent() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseText, setResponseText] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'patients'));
        const patientList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setResults(patientList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Firestore  Component</h1>

      {loading && <p className="text-lg text-gray-500">Loading...</p>}

      {error && <p className="text-lg text-red-500 mb-4">Error: {error}</p>}

      {responseText && (
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4"> Query:</h2>
          <p className="text-gray-700 break-words">{responseText}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid gap-4  sm:grid-cols-2 lg:grid-cols-3">
          {results.map(patient => (
            <div key={patient.id} className="w-full max-w-xl p-8 grid gap-8 rounded-sm bg-white border border-gray-200  shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="grid gap-2">
                    <div className="text-xl font-semibold">{`${patient.FirstName} ${patient.LastName}`}</div>
                    <div className="text-base text-gray-500">Patient</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarCheckIcon className="w-6 h-6 text-gray-500" />
                  <div className="text-base text-gray-500">
                    Admitted: <time dateTime={patient.admitDate ? new Date(patient.admitDate.seconds * 1000).toISOString().split('T')[0] : ''}>
                      {patient.admitDate ? new Date(patient.admitDate.seconds * 1000).toLocaleDateString() : 'Not Admitted'}
                    </time>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ClipboardCheckIcon className="w-6 h-6 text-gray-500" />
                    <div className="text-base font-medium">Discharged</div>
                  </div>
                  <div className="text-base text-gray-500">
                    <time dateTime={patient.discharged ? new Date(patient.discharged.seconds * 1000).toISOString().split('T')[0] : ''}>
                      {patient.discharged ? new Date(patient.discharged.seconds * 1000).toLocaleDateString() : 'Not Discharged'}
                    </time>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-6 h-6 text-gray-500" />
                  <div className="text-base text-gray-500">{patient.phoneNumber || 'No Phone Number'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
