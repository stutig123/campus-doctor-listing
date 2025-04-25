
import React from 'react';
import { FilterState } from '../types/doctor';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

// Define specialties array at the top level
const ALL_SPECIALTIES = [
  'General Physician',
  'Dentist',
  'Dermatologist',
  'Paediatrician',
  'Gynaecologist',
  'ENT',
  'Diabetologist',
  'Cardiologist',
  'Physiotherapist',
  'Endocrinologist',
  'Orthopaedic',
  'Ophthalmologist',
  'Gastroenterologist',
  'Pulmonologist',
  'Psychiatrist',
  'Urologist',
  'Dietitian/Nutritionist',
  'Psychologist',
  'Sexologist',
  'Nephrologist',
  'Neurologist',
  'Oncologist',
  'Ayurveda',
  'Homeopath'
];

interface FilterPanelProps {
  filters: FilterState;
  allSpecialties: string[];
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFilterChange
}) => {
  const handleConsultationChange = (type: 'video_consult' | 'in_clinic' | null) => {
    onFilterChange({ consultationType: type === filters.consultationType ? null : type });
  };

  const handleSpecialtyChange = (specialty: string) => {
    const specialties = filters.specialties.includes(specialty)
      ? filters.specialties.filter(s => s !== specialty)
      : [...filters.specialties, specialty];
    
    onFilterChange({ specialties });
  };

  const handleSortChange = (sortBy: 'fees' | 'fees-desc' | 'experience' | null) => {
    onFilterChange({ sortBy: sortBy === filters.sortBy ? null : sortBy });
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 space-y-6">
      {/* Consultation Type Filter */}
      <div>
        <h3 className="font-semibold mb-3" data-testid="filter-header-moc">
          Consultation Mode
        </h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="video-consult"
              data-testid="filter-video-consult"
              checked={filters.consultationType === 'video_consult'}
              onChange={() => handleConsultationChange('video_consult')}
              className="h-4 w-4 text-primary"
            />
            <label htmlFor="video-consult" className="text-sm">
              Video Consult
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="in-clinic"
              data-testid="filter-in-clinic"
              checked={filters.consultationType === 'in_clinic'}
              onChange={() => handleConsultationChange('in_clinic')}
              className="h-4 w-4 text-primary"
            />
            <label htmlFor="in-clinic" className="text-sm">
              In Clinic
            </label>
          </div>
        </div>
      </div>

      {/* Specialty Filter */}
      <div>
        <h3 className="font-semibold mb-3" data-testid="filter-header-speciality">
          Speciality
        </h3>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {ALL_SPECIALTIES.map((specialty) => (
              <div key={specialty} className="flex items-center space-x-2">
                <Checkbox
                  id={`specialty-${specialty}`}
                  data-testid={`filter-specialty-${specialty}`}
                  checked={filters.specialties.includes(specialty)}
                  onCheckedChange={() => handleSpecialtyChange(specialty)}
                />
                <Label htmlFor={`specialty-${specialty}`} className="text-sm">
                  {specialty}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Sort Filter */}
      <div>
        <h3 className="font-semibold mb-3" data-testid="filter-header-sort">
          Sort By
        </h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="sort-fees"
              data-testid="sort-fees"
              checked={filters.sortBy === 'fees'}
              onChange={() => handleSortChange('fees')}
              className="h-4 w-4 text-primary"
            />
            <label htmlFor="sort-fees" className="text-sm">
              Fees (Low to High)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="sort-fees-desc"
              data-testid="sort-fees-desc"
              checked={filters.sortBy === 'fees-desc'}
              onChange={() => handleSortChange('fees-desc')}
              className="h-4 w-4 text-primary"
            />
            <label htmlFor="sort-fees-desc" className="text-sm">
              Fees (High to Low)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="sort-experience"
              data-testid="sort-experience"
              checked={filters.sortBy === 'experience'}
              onChange={() => handleSortChange('experience')}
              className="h-4 w-4 text-primary"
            />
            <label htmlFor="sort-experience" className="text-sm">
              Experience (High to Low)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
