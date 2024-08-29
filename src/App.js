import React, { useEffect, useState } from 'react';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className='bg-gray-300 flex flex-col items-center justify-center h-screen'>
        <div className="loader" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-gray-300 flex flex-col items-center justify-center h-screen'>
        <div className="bg-red-200 p-6 rounded-lg shadow-md">
          <p className='text-red-600 font-bold text-lg'>{`Error: ${error}`}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gray-300 flex flex-col items-center justify-center'>
      <p className='font-bold text-5xl text-black mb-10'>Fetched Users List</p>
      <div className="flex gap-8 flex-wrap justify-center">
        {users.map(user => (
          <div
            key={user.id}
            className="transform rounded-xl h-64 w-64 sm:h-80 sm:w-80 bg-white shadow-xl transition duration-300 hover:scale-105 p-4"
          >
            <div className="flex flex-col h-full justify-center items-center">
              <span className="font-bold text-gray-800 text-lg">{user.name}</span>
              <span className="text-gray-600 text-sm">{user.email}</span>
              <span className="text-gray-600 text-sm">{user.phone}</span>
              <span className="text-gray-600 text-sm">{user.website}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add a CSS loader style for the loading state
const loaderStyle = `
.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject the loader style into the document
const style = document.createElement('style');
style.appendChild(document.createTextNode(loaderStyle));
document.head.appendChild(style);

export default App;
