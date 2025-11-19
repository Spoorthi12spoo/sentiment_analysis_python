// AnalysisPage.js
import { Chart, LinearScale, PointElement, Tooltip, Legend, CategoryScale, Title, LineElement } from 'chart.js';
Chart.register(LinearScale, PointElement, Tooltip, Legend, CategoryScale, Title, LineElement);

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

function AnalysisPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get('http://localhost:5000/api/analysis-data');
      setData(res.data);
    }
    fetchData();
  }, []);

  // Labels for X axis: index of sample
  const labels = data.map((_, i) => `Sample ${i + 1}`);

  // Data for Polarity graph
  const polarityChartData = {
    labels,
    datasets: [
      {
        label: 'Polarity',
        data: data.map(d => d.polarity),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        fill: false,
        tension: 0.1,
        borderWidth: 1  // Reduced line thickness here
      }
    ]
  };

  // Data for Subjectivity graph
  const subjectivityChartData = {
    labels,
    datasets: [
      {
        label: 'Subjectivity',
        data: data.map(d => d.subjectivity),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
        fill: false,
        tension: 0.1,
        borderWidth: 1  // Reduced line thickness here
      }
    ]
  };

  const polarityOptions = {
    scales: {
      y: {
        min: -1,
        max: 1,
        title: {
          display: true,
          text: 'Polarity Score (-1 to 1)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Sample Index'
        }
      }
    }
  };

  const subjectivityOptions = {
    scales: {
      y: {
        min: 0,
        max: 1,
        title: {
          display: true,
          text: 'Subjectivity Score (0 to 1)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Sample Index'
        }
      }
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto", marginTop: "30px" }}>
      <h2>Polarity Score Graph</h2>
      <Line data={polarityChartData} options={polarityOptions} />

      <h2 style={{marginTop: "50px"}}>Subjectivity Score Graph</h2>
      <Line data={subjectivityChartData} options={subjectivityOptions} />
    </div>
  );
}

export default AnalysisPage;
