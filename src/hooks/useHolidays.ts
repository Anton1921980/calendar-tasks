import { useState, useEffect } from 'react';

interface Country {
  countryCode: string;
  name: string;
}

interface Holiday {
  date: string;
  name: string;
  localName: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
}

const CACHE_KEY = 'global_holidays';

export default function useHolidays(year: string) {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHolidays = async () => {
      // Check if we already have holidays in cache
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const cachedHolidays = JSON.parse(cached);
        setHolidays(cachedHolidays);
        return;
      }

      setLoading(true);
      try {
        // 1. Get list of countries
        const countriesResponse = await fetch('https://date.nager.at/api/v3/AvailableCountries');
        if (!countriesResponse.ok) throw new Error('Failed to fetch countries');
        const countries: Country[] = await countriesResponse.json();

        // 2. Fetch holidays for each country (using 2024 as base year)
        const allHolidays: Holiday[] = [];
        const batchSize = 50;
        
        for (let i = 0; i < countries.length; i += batchSize) {
          const batch = countries.slice(i, i + batchSize);
          const batchPromises = batch.map(country => 
            fetch(`https://date.nager.at/api/v3/PublicHolidays/2024/${country.countryCode}`)
              .then(res => res.ok ? res.json() : [])
              .catch(() => [])
          );
          
          const batchResults = await Promise.all(batchPromises);
          batchResults.forEach(holidays => allHolidays.push(...holidays));
          
          if (i + batchSize < countries.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        // 3. Filter unique holidays and convert dates to MM-DD format
        const uniqueHolidays = Array.from(
          new Map(
            allHolidays.map(holiday => {
              // Convert YYYY-MM-DD to MM-DD
              const mmdd = holiday.date.slice(5);
              return [`${mmdd}_${holiday.name}`, {
                ...holiday,
                date: mmdd // Store only MM-DD
              }];
            })
          ).values()
        );

        // 4. Cache the results permanently
        localStorage.setItem(CACHE_KEY, JSON.stringify(uniqueHolidays));
        setHolidays(uniqueHolidays);
      } catch (error) {
        console.error('Failed to fetch holidays:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHolidays();
  }, []); // Run only once when component mounts

  // Filter holidays for current year
  const currentYearHolidays = holidays.map(holiday => ({
    ...holiday,
    date: `${year}-${holiday.date}` // Convert MM-DD back to YYYY-MM-DD
  }));

  return { holidays: currentYearHolidays, loading };
}