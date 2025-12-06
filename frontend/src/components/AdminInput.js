// AdminInput.js
import { useState } from 'react';
import axios from 'axios';

function AdminInput() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/analyze-text',
        { text },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setResults([res.data]);
      setError('');
    } catch (err) {
      console.error('Text analyze error:', err.response?.data || err.message);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Server error while analyzing text'
      );
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(
        'http://localhost:5000/api/upload-csv',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setResults(res.data);
      setError('');
    } catch (err) {
      console.error('CSV upload error:', err.response?.data || err.message);
      setError(
        err.response?.data?.error ||
        'Server error while uploading/processing CSV'
      );
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', marginTop: '30px' }}>
      <h2>Data Upload - Sentiment Analysis</h2>

      <form onSubmit={handleTextSubmit}>
        <textarea
          rows="4"
          placeholder="Enter text here..."
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ width: '100%', padding: '10px' }}
        />
        <button
          type="submit"
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Analyze Text
        </button>
      </form>

      <hr />

      <form onSubmit={handleFileSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button
          type="submit"
          style={{
            marginLeft: '10px',
            padding: '10px',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Upload CSV
        </button>
      </form>

      <hr />

      {error && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          {error}
        </p>
      )}

      {results && (
        <div>
          <h3>Results</h3>
          <table
            border="1"
            width="100%"
            cellPadding="5"
            style={{ borderCollapse: 'collapse' }}
          >
            <thead>
              <tr>
                <th>Text</th>
                <th>Polarity</th>
                <th>Subjectivity</th>
                <th>Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td>{r.text}</td>
                  <td>{r.polarity.toFixed(3)}</td>
                  <td>{r.subjectivity.toFixed(3)}</td>
                  <td>{r.sentiment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminInput;
