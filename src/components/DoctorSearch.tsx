import React, { useState, useEffect, useRef } from 'react';
import { Doctor } from '../types/doctor';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

interface DoctorSearchProps {
  doctors: Doctor[];
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const DoctorSearch: React.FC<DoctorSearchProps> = ({ 
  doctors = [],
  onSearch, 
  searchQuery 
}) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const commandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (value.trim() === '') {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const doctorsArray = Array.isArray(doctors) ? doctors : [];
    const filtered = doctorsArray
      .filter(doctor => 
        doctor.name.replace(/^Dr\.\s*Dr\./, 'Dr.').toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 3);

    setSuggestions(filtered);
    setIsOpen(filtered.length > 0);
  };

  const handleSelect = (doctorName: string) => {
    setInputValue(doctorName);
    onSearch(doctorName);
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative" ref={commandRef}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          data-testid="autocomplete-input"
          placeholder="Search doctors by name..."
          value={inputValue}
          onValueChange={handleInputChange}
          className="h-12"
        />
        <CommandList className="max-h-[300px] overflow-y-auto p-2">
          {isOpen && (
            suggestions.length > 0 ? (
              <CommandGroup>
                {suggestions.map((doctor) => (
                  <CommandItem
                    key={doctor.id}
                    value={doctor.name}
                    data-testid="suggestion-item"
                    onSelect={() => handleSelect(doctor.name)}
                    className="cursor-pointer p-2 hover:bg-accent rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      {doctor.photo ? (
                        <img
                          src={doctor.photo}
                          alt={doctor.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                          {doctor.name_initials}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {doctor.name.replace(/^Dr\.\s*Dr\./, 'Dr.')}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {doctor.specialities[0]?.name}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>No doctors found.</CommandEmpty>
            )
          )}
        </CommandList>
      </Command>
    </div>
  );
};
