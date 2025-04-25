
import React, { useState } from 'react';
import { Doctor } from '../types/doctor';
import { cn } from '@/lib/utils';
import { Calendar, IdCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppointmentDialog } from './AppointmentDialog';
import { Card, CardContent } from '@/components/ui/card';

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

  const doctorName = doctor.name.replace(/^Dr\.\s*Dr\./, 'Dr.');

  return (
    <>
      <Card className="w-full hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/10">
              {doctor.photo ? (
                <img 
                  src={doctor.photo} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xl font-bold">
                  {doctor.name_initials}
                </div>
              )}
            </div>
            
            <div className="flex-grow space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xl font-semibold text-primary">
                    {doctorName}
                  </h3>
                  <div className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    <IdCard className="h-3 w-3 mr-1" />
                    <span>ID: {doctor.id}</span>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  {doctor.specialities.map(specialty => specialty.name).join(', ')}
                </div>
                
                <div className="text-sm font-medium">
                  {doctor.experience}
                </div>

                <div className="text-sm text-muted-foreground mt-1">
                  Languages: {doctor.languages.join(', ')}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {doctor.in_clinic && (
                  <span className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                    In Clinic
                  </span>
                )}
                {doctor.video_consult && (
                  <span className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full font-medium">
                    Video Consult
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <div className="text-sm text-muted-foreground flex items-center">
                  {doctor.clinic.name}, {doctor.clinic.address.locality}
                  {doctor.clinic.address.logo_url && (
                    <img 
                      src={doctor.clinic.address.logo_url} 
                      alt="clinic logo" 
                      className="h-4 ml-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div className="text-primary font-semibold">
                  {doctor.fees}
                </div>
              </div>

              <Button
                variant="default"
                size="sm"
                className="w-full flex items-center gap-2 mt-2"
                onClick={() => setIsAppointmentDialogOpen(true)}
              >
                <Calendar className="h-4 w-4" />
                Book Appointment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <AppointmentDialog
        isOpen={isAppointmentDialogOpen}
        onClose={() => setIsAppointmentDialogOpen(false)}
        doctor={doctor}
      />
    </>
  );
};
