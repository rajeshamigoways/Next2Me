'use client'; // Mark this component as a client component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Homepage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin-login'); // Redirect to the admin login page
  }, [router]);

  return null; // No need to render anything since it will redirect
};

export default Homepage;
