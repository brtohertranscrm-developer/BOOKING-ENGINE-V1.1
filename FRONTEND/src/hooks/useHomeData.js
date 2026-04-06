import { useState, useEffect } from 'react';

export const useHomeData = () => {
  const [promotions, setPromotions] = useState([]);
  const [featuredMotors, setFeaturedMotors] = useState([]);
  const [isLoadingMotors, setIsLoadingMotors] = useState(true);

  // Ambil Promo
  useEffect(() => {
    fetch('http://localhost:5001/api/promotions')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setPromotions(data.data);
        }
      })
      .catch(err => console.error('Gagal memuat promo:', err));
  }, []);

  // Ambil Motor Unggulan
  useEffect(() => {
    fetch('http://localhost:5001/api/motors')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeaturedMotors(data.data.slice(0, 3));
        }
        setIsLoadingMotors(false);
      })
      .catch(err => {
        console.error('Gagal memuat motor:', err);
        setIsLoadingMotors(false);
      });
  }, []);

  return { promotions, featuredMotors, isLoadingMotors };
};