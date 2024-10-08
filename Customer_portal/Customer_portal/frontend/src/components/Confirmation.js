import React from 'react';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const navigate = useNavigate();

  // Function to navigate to Transactions page
  const handleReturn = () => {
    navigate('/transactions');
  };

  return (
    <div className="bg-purple-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="custom-loader mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold text-purple-900 mb-2">Transaction Pending</h1>
          <p className="text-purple-600 mb-6">Please wait while we process your payment</p>
        </div>
        
        <div className="bg-purple-100 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-purple-900 mb-2">Hi Lucian,</h2>
          <p className="text-purple-700">
            We have received your payment and it is currently undergoing verification from our administrators.
          </p>
        </div>

        <div className="text-center text-sm text-purple-500 mb-6">
          <p>This process may take a few minutes.</p>
        </div>

        <button 
          onClick={handleReturn} 
          className="return-button w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Return
        </button>
      </div>

      <style>{`
        .custom-loader {
          border: 5px solid #f3f3f3;
          border-radius: 50%;
          border-top: 5px solid #7c3aed;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .return-button {
          transition: all 0.3s ease;
        }
        .return-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(124, 58, 237, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Confirmation;
