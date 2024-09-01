import React, { useState, useEffect } from 'react';
import { db } from '../utils/Firebase';
import { collection, query, getDocs, where, doc, getDoc, deleteDoc } from 'firebase/firestore';
import Modal from '../utils/Modal';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';
import TopSection from '../components/TopSection';
import { ExclamationCircleIcon, TrashIcon } from '@heroicons/react/24/outline'; // Import TrashIcon

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Function to fetch user details
  const fetchUserDetails = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error("User not found");
    }
  };

  // Function to fetch alerts from Firestore
  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'alerts'), where('type', '==', "emergency")); // Example query to get active alerts
      const querySnapshot = await getDocs(q);
      let alertData = [];

      // Fetch each alert and user details
      for (const doc of querySnapshot.docs) {
        const alert = doc.data();
        const userDetails = await fetchUserDetails(doc.id); // Fetch user details using alert ID
        alertData.push({ id: doc.id, ...alert, ...userDetails });
      }

      setAlerts(alertData);
    } catch (err) {
      console.error("Error fetching alerts:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Short polling setup
  useEffect(() => {
    fetchAlerts(); // Initial fetch
    const intervalId = setInterval(fetchAlerts, 1000); // Poll every 30 seconds

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to delete an alert
  const deleteAlert = async (id) => {
    try {
      await deleteDoc(doc(db, 'alerts', id));
      setAlerts(alerts.filter(alert => alert.id !== id)); // Update the state
    } catch (err) {
      console.error("Error deleting alert:", err.message);
      setError("Error deleting alert. Please try again.");
    }
  };

  // Modal open and close functions
  const handleAlertClick = (alertData) => {
    setSelectedAlert(alertData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  return (
    <div className='flex flex-col h-screen'>
      <div className="flex">
        <div className="w-1/6 h-screen">
          <div className='fixed h-full'>
            <SideBar />
          </div>
        </div>

        <div className="w-5/6 ml-auto flex flex-col flex-1">
          <div className="mb-4">
            <TopSection />
          </div >
          <div className="p-4 mx-auto">
            {/* {loading && <p className="text-lg text-gray-500">Loading alerts...</p>} */}
            {error && <p className="text-lg text-red-500 mb-4">Error: {error}</p>}
            {alerts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => handleAlertClick(alert)} // Trigger modal on click
                  >
                    <div className="flex items-center justify-between mb-4 min-w-[300px]">
                      <div className="flex items-center flex-1">
                        <ExclamationCircleIcon className="h-6 w-6 text-red-500" /> {/* Emergency icon */}
                        <div className="text-lg font-semibold truncate ml-2">
                          {alert.title} {/* Assuming there's a title field in your alerts */}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-500">
                          Date: {alert.date ? new Date(alert.date.seconds * 1000).toLocaleDateString() : 'ND'}
                        </div>
                        {/* Fancy delete button */}
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); // Prevent triggering the modal on delete button click
                            deleteAlert(alert.id); 
                          }} 
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <TrashIcon className="h-6 w-6" /> {/* Trash icon */}
                        </button>
                      </div>
                    </div>
                    <hr className="my-2" />
                    <div className="flex flex-col gap-2">
                      <div className="text-sm text-gray-500">{alert.message}</div>
                      <div className="text-sm text-gray-500">
                        {alert.FirstName} {alert.LastName} {/* Now correctly sourced from the combined data */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-gray-500">No alerts found.</p>
            )}

            {/* Render the modal */}
            {selectedAlert && (
              <Modal isOpen={isModalOpen} onClose={closeModal} alertData={selectedAlert} />
            )}
          </div>
          <footer className="bg-gray-200 p-4 border-t border-gray-400 mt-auto">
            <Footer />
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Alerts;
