import React from 'react';

const Home = () => {
  // Internal CSS
  const styles = {
    mainContainer: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxSizing: "border-box"
    },
    card: {
      background: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      maxWidth: "600px",
      padding: "40px",
      textAlign: "center"
    },
    icon: {
      fontSize: "60px",
      marginBottom: "20px",
      color: "#4a6fa5"
    },
    title: {
      fontSize: "28px",
      color: "#333",
      marginBottom: "20px",
      fontWeight: "600"
    },
    message: {
      fontSize: "16px",
      lineHeight: "1.6",
      color: "#666",
      marginBottom: "30px"
    },
    statusIndicator: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "30px"
    },
    dot: {
      width: "12px",
      height: "12px",
      backgroundColor: "#4CAF50",
      borderRadius: "50%",
      marginRight: "10px"
    },
    status: {
      fontSize: "14px",
      color: "#4a6fa5",
      fontWeight: "500"
    },
    footer: {
      marginTop: "40px",
      borderTop: "1px solid #eee",
      paddingTop: "20px",
      color: "#999",
      fontSize: "14px"
    },
    contact: {
      marginTop: "10px",
      fontSize: "14px",
      color: "#777"
    },
    link: {
      color: "#4a6fa5",
      textDecoration: "none"
    }
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.card}>
        <div style={styles.icon}>🛠️</div>
        
        <h1 style={styles.title}>Site Under Maintenance</h1>
        
        <div style={styles.statusIndicator}>
          <div style={styles.dot}></div>
          <div style={styles.status}>Maintenance in Progress</div>
        </div>
        
        <p style={styles.message}>
          We're currently performing scheduled maintenance on our website to improve your experience.
          We apologize for any inconvenience this may cause.
        </p>
        
        <p style={styles.message}>
          Our team is working hard to bring the site back online as quickly as possible.
          Thank you for your patience and understanding.
        </p>
        
        <div style={styles.footer}>
          <p>© {new Date().getFullYear()} Your Company Name</p>
          <p style={styles.contact}>
            Need help? Contact us at <a href="mailto:support@example.com" style={styles.link}>support@example.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
