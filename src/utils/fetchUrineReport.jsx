 import React from "react";
 
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

export {fetchUrineReport}