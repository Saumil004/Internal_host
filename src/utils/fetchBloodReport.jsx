import React from "react";

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


export {fetchBloodReport}