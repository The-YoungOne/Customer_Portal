import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if the user is logged in and fetch user details
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    // Set the user as logged in if the token exists
    if (token) {
      setIsLoggedIn(true);
      // Fetch user data from the server
      axios.get('https://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setIsLoggedIn(false); // Log the user out on error
      })
      .finally(() => {
        setLoading(false); // End loading state
      });
    } else {
      setLoading(false); // No token means not logged in
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-indigo-600 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-4 animate-fade-in">
          International Payment System
        </h1>
        <p className="text-xl text-center text-white animate-slide-up">
          Secure Transactions. Simplified Payments.
        </p>
      </header>

      {/* Overview Section */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Our Payment Portal Features</h2>
            <p className="text-lg text-gray-600">
              Streamline your international payments with our secure SWIFT-based payment system. 
              Our platform ensures that your transactions are safe, efficient, and globally compliant.
            </p>
          </section>

          {/* Team Section (Unchanged Design) */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Mpho */}
              <div className="bg-white p-4 rounded-lg shadow-md text-center transition-transform duration-300 ease-in-out transform hover:scale-105 animate-fade-in">
                <img
                  src="https://media.licdn.com/dms/image/v2/D4D03AQHYSGtq8VOslQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1710094803991?e=1733356800&v=beta&t=yc0I178cFsZxg7PGS-fNzg1L8vYOyGdFfDq7lzbM7MQ"
                  alt="Mpho Ndlela"
                  className="w-32 h-32 rounded-full mx-auto"
                />
                <h2 className="text-lg font-bold mt-4">Mpho Ndlela</h2>
                <p className="text-gray-500">Team Lead</p>
                <p className="mt-2 text-gray-600">Experienced in leading development teams for secure financial applications.</p>
              </div>

              {/* Alec */}
              <div className="bg-white p-4 rounded-lg shadow-md text-center transition-transform duration-300 ease-in-out transform hover:scale-105 animate-fade-in">
                <img
                  src="https://media.licdn.com/dms/image/v2/D4E03AQGxJrhjkjg1JA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1720016768535?e=1733356800&v=beta&t=dusoMygXRnIFJBpUX6iC_BhtfEZwthberv1iuZy4e34"
                  alt="Alec Cowan"
                  className="w-32 h-32 rounded-full mx-auto"
                />
                <h2 className="text-lg font-bold mt-4">Alec Cowan</h2>
                <p className="text-gray-500">Developer</p>
                <p className="mt-2 text-gray-600">Specialist in building scalable, secure full-stack systems for financial institutions.</p>
              </div>

              {/* Lucian */}
              <div className="bg-white p-4 rounded-lg shadow-md text-center transition-transform duration-300 ease-in-out transform hover:scale-105 animate-fade-in">
                <img
                  src="https://media.licdn.com/dms/image/v2/D5603AQHhjtgvN6VKHQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1713450059841?e=1733356800&v=beta&t=XdFc0nLfIDHv3YQ1OxnaxSyg4ww9I6iUdAaJ077a4J4"
                  alt="Lucian Young"
                  className="w-32 h-32 rounded-full mx-auto"
                />
                <h2 className="text-lg font-bold mt-4">Lucian Young</h2>
                <p className="text-gray-500">UI Designer</p>
                <p className="mt-2 text-gray-600">Expert in designing intuitive and user-friendly financial interfaces.</p>
              </div>

              {/* Anele */}
              <div className="bg-white p-4 rounded-lg shadow-md text-center transition-transform duration-300 ease-in-out transform hover:scale-105 animate-fade-in">
                <img
                  src="https://media.licdn.com/dms/image/v2/D4D03AQHI_NoiU-VqJw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1705055843973?e=1733356800&v=beta&t=o0T9_Kt5R_gdkZLCkhL2X9ZbU1CyJaCY9nWqssZymWE"
                  alt="Anele Siwela"
                  className="w-32 h-32 rounded-full mx-auto"
                />
                <h2 className="text-lg font-bold mt-4">Anele Siwela</h2>
                <p className="text-gray-500">Back-End Developer</p>
                <p className="mt-2 text-gray-600">Focused on optimizing backend systems and ensuring secure database transactions.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white p-4 text-center mt-auto">
        <p>Done by the Risk Rangers: Mpho Ndlela, Alec Cowan, Lucian Young, Anele Siwela</p>
      </footer>
    </div>
  );
}

export default HomePage;
