
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterState } from '../types/doctor';

export const useQueryParams = (
  filters: FilterState,
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Update the URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.consultationType) {
      params.set('consultationType', filters.consultationType);
    }
    
    if (filters.specialties.length > 0) {
      params.set('specialties', filters.specialties.join(','));
    }
    
    if (filters.sortBy) {
      params.set('sortBy', filters.sortBy);
    }
    
    if (filters.searchQuery) {
      params.set('search', filters.searchQuery);
    }
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Initialize filters from URL params when the page loads
  useEffect(() => {
    const consultationType = searchParams.get('consultationType') as 'video_consult' | 'in_clinic' | null;
    const specialtiesParam = searchParams.get('specialties');
    const sortBy = searchParams.get('sortBy') as 'fees' | 'experience' | null;
    const searchQuery = searchParams.get('search') || '';

    const specialties = specialtiesParam ? specialtiesParam.split(',') : [];

    setFilters({
      consultationType: consultationType || null,
      specialties,
      sortBy: sortBy || null,
      searchQuery
    });
  }, [searchParams, setFilters]);
};
