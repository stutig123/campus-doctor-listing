
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Doctor } from '../types/doctor';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface AppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
}

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '02:00 PM', '03:00 PM', '04:00 PM'
];

export function AppointmentDialog({ isOpen, onClose, doctor }: AppointmentDialogProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  const [selectedTime, setSelectedTime] = React.useState<string>();

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      console.log('Appointment booked:', {
        doctor: doctor.name,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime
      });
      
      toast.success('Appointment Booking Confirmed', {
        description: `Your appointment with Dr. ${doctor.name} on ${format(selectedDate, 'MMMM d, yyyy')} at ${selectedTime} has been confirmed.`,
        duration: 5000,
      });
      
      onClose();
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-semibold">
            Book Appointment with Dr. {doctor.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select your preferred date and time for the appointment
          </p>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Select Date</label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border shadow-sm"
            />
          </div>
          
          {selectedDate && (
            <div className="space-y-3">
              <label className="text-sm font-semibold">Available Time Slots</label>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => setSelectedTime(time)}
                    className="w-full"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTime}
            className="flex-1"
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
