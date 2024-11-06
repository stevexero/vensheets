import { create } from 'zustand';
import * as XLSX from 'xlsx';
import { supaClient } from '../supabase/supaClient';

export interface AppointmentData {
  id?: string;
  user_id?: string;
  date?: string;
  supplier?: string;
  appt_time?: string;
  discrepancy?: string;
  dockbay?: number;
  start_time?: string;
  end_time?: string;
  driver?: string;
  num_pos?: number;
}

interface AppointmentStoreState {
  appointments: AppointmentData[];

  setAppointments: (appointments: AppointmentData[]) => void;
  exportToExcel: () => void;
  subscribeToRealtimeUpdates: () => void;

  addAppointment: (appointment: AppointmentData) => Promise<void>;
  updateAppointment: (
    appointmentId: string,
    updatedData: Partial<AppointmentData>
  ) => Promise<void>;
  deleteAppointment: (appointmentId: string) => Promise<void>;
  fetchAppointments: (date: string) => Promise<void>;
}

const useAppointmentsStore = create<AppointmentStoreState>((set, get) => ({
  appointments: [],
  isAuthenticated: false,
  session: null,
  loading: true,

  setAppointments: (appointments) => set({ appointments }),

  fetchAppointments: async (date) => {
    const {
      data: { user },
    } = await supaClient.auth.getUser();
    const userId = user?.id;

    const { data, error } = await supaClient
      .from('appointments')
      .select('*')
      .eq('date', date)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching appointments:', error);
      return;
    }

    set({ appointments: data as AppointmentData[] });
  },

  addAppointment: async (appointment) => {
    const {
      data: { user },
    } = await supaClient.auth.getUser();
    const userId = user?.id;

    const { data, error } = await supaClient
      .from('appointments')
      .insert([{ ...appointment, user_id: userId }]);

    if (error) {
      console.error('Error adding appointment:', error);
    } else {
      if (data) {
        console.log(data);
        set((state) => ({
          appointments: [...state.appointments, data[0] as AppointmentData],
        }));
      }
    }
  },

  updateAppointment: async (appointmentId, updatedData) => {
    const {
      data: { user },
    } = await supaClient.auth.getUser();
    const userId = user?.id;

    if (!userId) return;

    const { error } = await supaClient
      .from('appointments')
      .update(updatedData)
      .eq('id', appointmentId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating appointment:', error);
    } else {
      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, ...updatedData }
            : appointment
        ),
      }));
    }
  },

  deleteAppointment: async (appointmentId) => {
    const {
      data: { user },
    } = await supaClient.auth.getUser();
    const userId = user?.id;

    if (!userId) return;

    const { error } = await supaClient
      .from('appointments')
      .delete()
      .eq('id', appointmentId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting appointment:', error);
    } else {
      set((state) => ({
        appointments: state.appointments.filter(
          (appointment) => appointment.id !== appointmentId
        ),
      }));
    }
  },

  subscribeToRealtimeUpdates: (): (() => void) => {
    const appointmentsChannel = supaClient
      .channel('appointments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          set((state) => {
            let updatedAppointments = [...state.appointments];
            switch (eventType) {
              case 'INSERT':
                updatedAppointments.push(newRecord);
                break;
              case 'UPDATE':
                updatedAppointments = updatedAppointments.map((appt) =>
                  appt.id === newRecord.id ? newRecord : appt
                );
                break;
              case 'DELETE':
                updatedAppointments = updatedAppointments.filter(
                  (appt) => appt.id !== oldRecord.id
                );
                break;
              default:
                break;
            }
            return { appointments: updatedAppointments };
          });
        }
      )
      .subscribe();

    return () => {
      supaClient.removeChannel(appointmentsChannel);
    };
  },

  exportToExcel: () => {
    const appointments = get().appointments;
    const worksheet = XLSX.utils.json_to_sheet(appointments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments');

    const currentDate = new Date().toISOString().split('T')[0];
    const fileName = `appointments_${currentDate}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  },
}));

export default useAppointmentsStore;
