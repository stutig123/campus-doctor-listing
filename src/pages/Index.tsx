
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Doctor, FilterState } from '../types/doctor';
import { fetchDoctors } from '../services/doctorService';
import { DoctorSearch } from '../components/DoctorSearch';
import { FilterPanel } from '../components/FilterPanel';
import { DoctorCard } from '../components/DoctorCard';

const Index: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    consultationType: null,
    specialties: [],
    sortBy: null,
    searchQuery: ''
  });
  
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    
    const newFilters: FilterState = {
      consultationType: (params.consultationType as 'video_consult' | 'in_clinic' | null) || null,
      specialties: params.specialties ? params.specialties.split(',') : [],
      sortBy: (params.sortBy as 'fees' | 'fees-desc' | 'experience' | null) || null,
      searchQuery: params.search || ''
    };
    
    setFilters(newFilters);
  }, [searchParams]);

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

  useEffect(() => {
    const getDoctors = async () => {
      setLoading(true);
      try {
        const data = await fetchDoctors();
        setDoctors(data);
        setError(null);
      } catch (err) {
        setError("Failed to load doctors data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    getDoctors();
  }, []);

  useEffect(() => {
    if (!doctors.length) return;
    
    let result = [...doctors];
    
    if (filters.searchQuery) {
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }
    
    if (filters.consultationType) {
      result = result.filter(doctor => doctor[filters.consultationType!]);
    }
    
    if (filters.specialties.length > 0) {
      result = result.filter(doctor => {
        const doctorSpecialtiesText = doctor.specialities
          .map(spec => spec.name.toLowerCase())
          .join(' ');
        
        return filters.specialties.some(selectedSpecialty => 
          doctorSpecialtiesText.includes(selectedSpecialty.toLowerCase())
        );
      });
    }
    
    if (filters.sortBy) {
      if (filters.sortBy === 'fees') {
        result.sort((a, b) => {
          const feeA = parseInt(a.fees.replace(/[^\d]/g, ''), 10);
          const feeB = parseInt(b.fees.replace(/[^\d]/g, ''), 10);
          return feeA - feeB;
        });
      } else if (filters.sortBy === 'fees-desc') {
        result.sort((a, b) => {
          const feeA = parseInt(a.fees.replace(/[^\d]/g, ''), 10);
          const feeB = parseInt(b.fees.replace(/[^\d]/g, ''), 10);
          return feeB - feeA;
        });
      } else if (filters.sortBy === 'experience') {
        result.sort((a, b) => {
          const expA = parseInt(a.experience.match(/\d+/)?.[0] || '0', 10);
          const expB = parseInt(b.experience.match(/\d+/)?.[0] || '0', 10);
          return expB - expA;
        });
      }
    }
    
    setFilteredDoctors(result);
  }, [doctors, filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = (query: string) => {
    handleFilterChange({ searchQuery: query });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Find Doctors</h1>
          <DoctorSearch 
            doctors={doctors} 
            onSearch={handleSearch}
            searchQuery={filters.searchQuery}
          />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="text-sm text-muted-foreground mb-4">
          {!loading && !error && (
            <p className="bg-muted/50 inline-block px-3 py-1 rounded-full">
              Found <span className="font-medium">{filteredDoctors.length}</span> {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
              {filters.searchQuery && ` matching "${filters.searchQuery}"`}
              {doctors.length > filteredDoctors.length ? ` (out of ${doctors.length})` : ''}
            </p>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 shrink-0">
            <FilterPanel 
              filters={filters}
              allSpecialties={[]} // This prop is no longer needed but kept for compatibility
              onFilterChange={handleFilterChange} 
            />
          </aside>
          
          <section className="flex-grow">
            {loading ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                {error}
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-lg text-gray-500">No doctors found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1">
                {filteredDoctors.map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
