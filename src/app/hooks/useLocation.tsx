// import { useEffect, useState } from "react";

// const useLocation = () => {
//   const [countries, setCountries] = useState<{ name: string; code: string }[]>([]);
//   const [states, setStates] = useState<{ name: string; code: string }[]>([]);

//   // Fetch countries from your API
//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/countries"); // Your Express API
//         const data = await response.json();
//         setCountries(data.map((country: any) => ({ name: country.name, code: country.code2 })));
//       } catch (error) {
//         console.error("Error fetching countries:", error);
//       }
//     };

//     fetchCountries();
//   }, []);

//   // Fetch states based on selected country
//   const fetchStates = async (countryCode: string) => {
//     if (!countryCode) return;
//     try {
//       const response = await fetch(`http://localhost:5000/countries/states/${countryCode}`); // Your Express API
//       const data = await response.json();
//       setStates(data.map((state: any) => ({ name: state.name, code: state.code })));
//     } catch (error) {
//       console.error("Error fetching states:", error);
//     }
//   };

//   return { countries, states, fetchStates };
// };

// export default useLocation;
