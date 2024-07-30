import React from "react";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend

);
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'long' }; // Format as "day month"
  return date.toLocaleDateString('en-US', options);
};


export const AttendenceCharts = ({chartData}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 4
 };
const data={};



const formattedDates = [...new Set(chartData.map(item => formatDate(item.date)))];

 // Count "Present" status per date
 const dateCounts = chartData.reduce((acc, item) => {
  const formattedDate = formatDate(item.date);
  if (!acc[formattedDate]) {
    acc[formattedDate] = 0;
  }
  if (item.status === "Present") {
    acc[formattedDate]++;
  }
  return acc;
}, {});

// Prepare data for the chart
const dates = Object.keys(dateCounts);
const presentCounts = Object.values(dateCounts);

const lineChartData ={
    labels:formattedDates,
    datasets :[
        {
            label:"Attendence",
            data:presentCounts,
            borderColor:"rgb(75,192,230)",
            backgroundColor: 
              'rgb(59, 113, 202'
        },
    ],
};

  return <Line  options={{options}}     data={lineChartData}></Line>
};
