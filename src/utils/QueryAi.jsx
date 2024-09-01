import React, { useState, useEffect } from 'react';
import { db } from './Firebase';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';


async function fetchGeminiData(prompt) {
  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBiDsKVSUEs0uogymyuIEmRiqfD9r6l7Ng',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "contents": [
            {
              "parts": [
                {
                  "text": prompt + "Generate a Firestore query to retrieve documents from one of the following collections based on the prompt: users (fields: FirstName (string), LastName (string), Weight (number), Age (number), Gender (string), Allergy (string), Lifestyle (string), Height (number), Ph (number), BloodGroup (string), DateOfBirth (string), Email (string), admitted (boolean), discharged (boolean)), bloodPressure (fields: systolic (number), diastolic (number), timestamp (date)), bloodReport (fields: anaemia (string), albumin (string), appetite (string), bacteria (string), blood_glucose_random (number), class (string), coronary_artery_disease (string), diabetes_mellitus (string), haemoglobin (number), hypertension (string), packed_cell_volume (number), peda_edema (string), potassium (number), pus_cell (string), pus_cell_clumps (string), red_blood_cell_count (number), red_blood_cells (string), sodium (number), specific_gravity (number), sugar (number), white_blood_cell_count (number)), or UrineReport (fields: blood_urea (number), createdAt (timestamp), serum_creatinine (string), userEmail (string)). If the prompt includes specific conditions, use where clauses. If ordering is specified, use orderBy. If limiting is included, use limit. For general queries without specific conditions, ordering, or limiting, generate a query to retrieve all documents from the collection. General Query: query(collection(db, '<collectionName>')), Specific Query with Conditions, Ordering, and Limiting: query(collection(db, '<collectionName>'), where('<Field>', '<Operator>', '<Value>'), orderBy('<Field>', '<Direction>'), limit(<Number>)). Provide the response in a single line without enclosing in quotes or specifying the programming language."
                }
              ]
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Network response was not ok: ${errorText}`);
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const responseData = await response.json();
    const contentObject = responseData.candidates[0]?.content;

    if (contentObject && contentObject.parts && contentObject.parts.length > 0) {
      return contentObject.parts[0].text;
    } else {
      throw new Error("Unexpected content structure in Gemini response");
    }
  } catch (error) {
    console.error("Error fetching from Gemini:", error.message);
    throw error;
  }
}

async function fetchFirestoreData(generatedQuery) {
  try {
    // Convert the generated query into Firestore query
    const querySnapshot = await getDocs(eval(generatedQuery));
    let results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, data: doc.data() });
    });
    return results;
  } catch (error) {
    console.error("Error fetching documents from Firestore:", error.message);
    throw error;
  }
}
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

// Import the Modal component
import Modal from './Modal';
const QueryAi = ({ prompt }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseText, setResponseText] = useState('');

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (userData) => {
    setSelectedUser(userData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    if (prompt) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const generatedQuery = await fetchGeminiData(prompt);
          if (generatedQuery) {
            setResponseText(generatedQuery);
            const fetchedData = await fetchFirestoreData(generatedQuery);
            setResults(fetchedData);
          } else {
            console.log("Generated query is empty or undefined.");
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [prompt]); // Automatically trigger search on prompt change

  return (
    <div>
      <div className="p-4 mx-auto transition-transform translate-y-[-100px]">
        {loading && <p className="text-lg text-gray-500">Loading...</p>}
        {error && <p className="text-lg text-red-500 mb-4">Error: {error}</p>}
        {responseText && (
          <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Generated Query:</h2>
            <p className="text-gray-700 break-words">{responseText}</p>
          </div>
        )}
        {results.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => {
              const { data } = result;
              return (
                <div
                  key={index}
                  className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => handleUserClick(data)} // Trigger modal on click
                >
                  <div className="flex items-center justify-between mb-4 min-w-[300px]">
                    <div className="flex items-center h-10 w-5 flex-wrap gap-4 flex-1">
                      <div className="text-lg font-semibold truncate">
                        {data.FirstName} {data.LastName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarCheckIcon className="w-5 h-5 text-gray-500" />
                      <div className="text-sm text-gray-500">
                        Admitted: {data.admitDate ? new Date(data.admitDate.seconds * 1000).toLocaleDateString() : 'ND'}
                      </div>
                    </div>
                  </div>
                  <hr className="my-2" />
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ClipboardCheckIcon className="w-5 h-5 text-gray-500" />
                        <div className="text-sm font-medium">Discharged Status:</div>
                      </div>
                      <div className="text-sm">
                        <span className={`${data.discharged ? 'text-green-500' : 'text-red-500'}`}>
                          {data.discharged ? 'Discharged' : 'Not Discharged'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-5 h-5 text-gray-500" />
                      <div className="text-sm text-gray-500">{data.ph}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Render the modal */}

      </div>
      {console.log(selectedUser)}

      <Modal isOpen={isModalOpen} onClose={closeModal} userData={selectedUser} />
    </div>
  );
};

export default QueryAi;