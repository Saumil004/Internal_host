import React, { useEffect, useState } from 'react';
import { db } from '../utils/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';
import TopSection from '../components/TopSection';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    avgAge: 0,
    avgWeight: 0,
    avgHeight: 0,
    genderDistribution: { male: 0, female: 0 },
    allergyCount: {},
    lifestyleDistribution: {},
    dischargedCount: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = querySnapshot.docs.map(doc => doc.data());

        const totalUsers = users.length;
        let totalAge = 0, totalWeight = 0, totalHeight = 0;
        const genderDist = { male: 0, female: 0 };
        const allergyCount = {};
        const lifestyleDist = {};
        let dischargedCount = 0;

        users.forEach(user => {
          totalAge += user.Age || 0;
          totalWeight += user.Weight || 0;
          totalHeight += user.Height || 0;
          if (user.Gender) genderDist[user.Gender.toLowerCase()] = (genderDist[user.Gender.toLowerCase()] || 0) + 1;
          if (user.Allergy) allergyCount[user.Allergy] = (allergyCount[user.Allergy] || 0) + 1;
          if (user.Lifestyle) lifestyleDist[user.Lifestyle] = (lifestyleDist[user.Lifestyle] || 0) + 1;
          if (user.discharged) dischargedCount += 1;
        });

        setAnalytics({
          totalUsers,
          avgAge: totalAge / totalUsers || 0,
          avgWeight: totalWeight / totalUsers || 0,
          avgHeight: totalHeight / totalUsers || 0,
          genderDistribution: genderDist,
          allergyCount,
          lifestyleDistribution: lifestyleDist,
          dischargedCount
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalytics();
  }, []);

  const genderData = Object.entries(analytics.genderDistribution).map(([gender, count]) => ({
    name: gender.charAt(0).toUpperCase() + gender.slice(1),
    value: count
  }));

  const allergyData = Object.entries(analytics.allergyCount).map(([allergy, count]) => ({
    name: allergy,
    value: count
  }));

  const lifestyleData = Object.entries(analytics.lifestyleDistribution).map(([lifestyle, count]) => ({
    name: lifestyle,
    value: count
  }));

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
          </div>

          <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
            <h1 className="text-4xl font-bold text-center mb-8">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">General Statistics</h2>
                <p className="text-lg mb-2">Total Users: <span className="font-medium">{analytics.totalUsers}</span></p>
                <p className="text-lg mb-2">Average Age: <span className="font-medium">{analytics.avgAge.toFixed(2)}</span></p>
                <p className="text-lg mb-2">Average Weight: <span className="font-medium">{analytics.avgWeight.toFixed(2)}</span></p>
                <p className="text-lg mb-2">Average Height: <span className="font-medium">{analytics.avgHeight.toFixed(2)}</span></p>
              </div>

              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Gender Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Allergy Count</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={allergyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Lifestyle Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={lifestyleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white shadow-md rounded-lg p-6 md:col-span-2 lg:col-span-3">
                <h2 className="text-2xl font-semibold mb-4">Discharged Users</h2>
                <p className="text-lg">Number of Discharged Users: <span className="font-medium">{analytics.dischargedCount}</span></p>
              </div>
            </div>
          </div>
          
          <footer className="bg-gray-200 p-4 border-t border-gray-400 mt-auto">
            <Footer />
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
