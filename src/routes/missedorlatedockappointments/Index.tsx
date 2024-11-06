import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { DateTime } from 'luxon';
import useAppointmentsStore, {
  AppointmentData,
} from '../../stores/appointmentsStore';

const MissedOrLateDockAppointments = () => {
  const { control, handleSubmit, watch, reset } = useForm();

  const {
    appointments,
    fetchAppointments,
    addAppointment,
    exportToExcel,
    subscribeToRealtimeUpdates,
  } = useAppointmentsStore();

  const [loading, setLoading] = useState(true);

  const startSelectedTime = watch('start_time') || '06:00';

  useEffect(() => {
    const fetchAppts = async () => {
      setLoading(true);
      try {
        await fetchAppointments(DateTime.now().toISODate());

        subscribeToRealtimeUpdates();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppts();
  }, [fetchAppointments, subscribeToRealtimeUpdates]);

  const onSubmit = async (formData: AppointmentData) => {
    const newAppointment = {
      ...formData,
      date: DateTime.now().toISODate(),
      appt_time: formData.appt_time || DateTime.now().toFormat('HH:mm'),
      supplier: formData.supplier,
      discrepancy: formData.discrepancy,
      dockbay: formData.dockbay,
      start_time: formData.start_time,
      end_time: formData.end_time,
      driver: formData.driver,
      num_pos: formData.num_pos,
    };
    await addAppointment(newAppointment);

    fetchAppointments(DateTime.now().toISODate());

    reset();
  };

  if (loading) {
    return (
      <div className='w-full flex items-center justify-center'>
        <div className='flex flex-row items-center mt-48'>
          <span className='loading loading-spinner'></span>
          <span className='ml-4'>loading</span>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-4 md:gap-4 lg:gap-8'>
      <div className='md:col-span-2 xl:col-span-1 bg-neutral p-4 lg:p-8 rounded-2xl'>
        <h1 className='lg:text-2xl font-bold mb-4 text-neutral-content'>
          Missed or Late Dock Appointments
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <Controller
                name='supplier'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text text-neutral-content'>
                        Supplier
                      </span>
                    </label>
                    <input
                      type='text'
                      {...field}
                      placeholder='Enter supplier name'
                      className='input input-bordered input-sm'
                    />
                  </div>
                )}
              />
            </div>

            <div>
              <Controller
                name='driver'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <div className='form-control mt-2'>
                    <label className='label'>
                      <span className='label-text text-neutral-content'>
                        Driver Name
                      </span>
                    </label>
                    <input
                      type='text'
                      {...field}
                      placeholder='Enter driver name'
                      className='input input-bordered input-sm'
                    />
                  </div>
                )}
              />
            </div>

            <div>
              <Controller
                name='appt_time'
                control={control}
                defaultValue='06:00'
                render={({ field }) => (
                  <div className='form-control mt-2'>
                    <label className='label'>
                      <span className='label-text text-neutral-content'>
                        Appointment Time
                      </span>
                    </label>
                    <select
                      {...field}
                      className='select select-bordered select-sm'
                    >
                      {[...Array(64 - 24 + 1).keys()].map((i) => {
                        const time = DateTime.fromObject({ hour: 6 })
                          .plus({ minutes: 15 * i })
                          .toFormat('h:mm a');
                        return (
                          <option key={i} value={time}>
                            {time}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              />
            </div>

            <div>
              <Controller
                name='dockbay'
                control={control}
                defaultValue={1}
                render={({ field }) => (
                  <div className='form-control mt-2'>
                    <label className='label'>
                      <span className='label-text text-neutral-content'>
                        Dock Bay
                      </span>
                    </label>
                    <select
                      {...field}
                      className='select select-bordered select-sm'
                    >
                      {[...Array(7).keys()].map((i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              />
            </div>

            <div>
              <Controller
                name='discrepancy'
                control={control}
                defaultValue='Late'
                render={({ field }) => (
                  <div className='form-control mt-2'>
                    <label className='label'>
                      <span className='label-text text-neutral-content'>
                        Discrepancy
                      </span>
                    </label>
                    <select
                      {...field}
                      className='select select-bordered select-sm'
                    >
                      {['Late', 'Early', 'No Show', 'No Appt.', 'Other'].map(
                        (status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <Controller
                name='start_time'
                control={control}
                defaultValue='06:00'
                render={({ field }) => (
                  <div className='form-control mt-2'>
                    <label className='label'>
                      <span className='label-text text-neutral-content'>
                        Start Time
                      </span>
                    </label>
                    <select
                      {...field}
                      className='select select-bordered select-sm'
                    >
                      {[...Array(120).keys()].map((i) => {
                        const time = DateTime.fromObject({ hour: 6 })
                          .plus({ minutes: 5 * i })
                          .toFormat('h:mm a');
                        return (
                          <option key={i} value={time}>
                            {time}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              />

              <Controller
                name='end_time'
                control={control}
                defaultValue='06:00'
                render={({ field }) => {
                  const startIndex = [...Array(120).keys()].findIndex((i) => {
                    const time = DateTime.fromObject({ hour: 6 })
                      .plus({ minutes: 5 * i })
                      .toFormat('h:mm a');
                    return time === startSelectedTime;
                  });

                  return (
                    <div className='form-control mt-2'>
                      <label className='label'>
                        <span className='label-text text-neutral-content'>
                          End Time
                        </span>
                      </label>
                      <select
                        {...field}
                        className='select select-bordered select-sm'
                      >
                        {[...Array(120 - startIndex).keys()].map((i) => {
                          const time = DateTime.fromObject({ hour: 6 })
                            .plus({ minutes: 5 * (i + startIndex) })
                            .toFormat('h:mm a');
                          return (
                            <option key={i} value={time}>
                              {time}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  );
                }}
              />
            </div>

            <div>
              <Controller
                name='num_pos'
                control={control}
                defaultValue={1}
                render={({ field }) => (
                  <div className='form-control mt-2'>
                    <label className='label'>
                      <span className='label-text text-neutral-content'>
                        # POs
                      </span>
                    </label>
                    <select
                      {...field}
                      className='select select-bordered select-sm'
                    >
                      {[...Array(100).keys()].map((i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              />
            </div>

            <div>
              <button
                type='submit'
                className='btn btn-primary btn-block text-primary-content mt-8'
              >
                Add
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className='col-span-1 md:col-span-2 xl:col-span-3 justify-items-center lg:justify-items-end bg-warning p-4 lg:p-8 rounded-2xl max-h-96 mt-4 md:mt-0'>
        <h2 className='text-xl font-semibold mb-4 text-warning-content'>
          Missed Appointments Table
        </h2>
        <div className='w-full overflow-scroll max-h-52 border border-primary rounded-lg'>
          <table className='table table-zebra table-xs w-full text-warning-content'>
            <thead className='text-warning-content'>
              <tr className='bg-white'>
                <th>Supplier</th>
                <th>Appt. Time</th>
                <th>Discrepancy</th>
                <th>Dock Bay</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Driver Name</th>
                <th># POs</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index}>
                  <td>{appointment.supplier}</td>
                  <td>{appointment.appt_time}</td>
                  <td>{appointment.discrepancy}</td>
                  <td>{appointment.dockbay}</td>
                  <td>{appointment.start_time}</td>
                  <td>{appointment.end_time}</td>
                  <td>{appointment.driver}</td>
                  <td>{appointment.num_pos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className='btn btn-primary text-white mt-4'
          onClick={exportToExcel}
        >
          Export as Excel
        </button>
      </div>
    </div>
  );
};

export default MissedOrLateDockAppointments;
