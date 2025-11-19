function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Sentiment Analysis Web Application</h1>
      <img src="/sentiment.png" alt="Sentiment Analysis" style={{ width: "700px", maxWidth: "100%" }} />
      <p style={{ fontSize: "18px", marginTop: "20px" }}>
        Analyze text sentiments as Positive, Negative, or Neutral with polarity and subjectivity scores.
      </p>
    </div>
  );
}

export default Home;
