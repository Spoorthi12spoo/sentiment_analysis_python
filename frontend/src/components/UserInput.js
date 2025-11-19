// UserInput.js
import { useState } from 'react';
import axios from 'axios';

function UserInput() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;
    const res = await axios.post('http://localhost:5000/api/analyze-text', { text });
    setResults([res.data]);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('http://localhost:5000/api/upload-csv', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setResults(res.data);
  };

  return (
    <div style={{maxWidth: "600px", margin: "auto", marginTop: "30px"}}>
      <h2>User Input - Sentiment Analysis</h2>
      <form onSubmit={handleTextSubmit}>
        <textarea rows="4" placeholder="Enter text here..." value={text} onChange={e => setText(e.target.value)} style={{width: "100%", padding: "10px"}}></textarea>
        <button type="submit" style={{marginTop: "10px", padding: "10px"}}>Analyze Text</button>
      </form>
      <hr />
      <form onSubmit={handleFileSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit" style={{marginLeft: "10px", padding: "10px"}}>Upload CSV</button>
      </form>
      <hr />
      {results && <div>
        <h3>Results</h3>
        <table border="1" width="100%" cellPadding="5" style={{borderCollapse: "collapse"}}>
          <thead><tr><th>Text</th><th>Polarity</th><th>Subjectivity</th><th>Sentiment</th></tr></thead>
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
      </div>}
    </div>
  );
}

export default UserInput;
