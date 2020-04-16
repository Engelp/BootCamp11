import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

// Rota : Receber a requisicao, chamar outro arquivo, devolver um resposta

appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentsRepository.all();

  return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;

    // parseISO - Transformando uma string (date) que esta vindo do body,
    //            para uma data.

    const parsedDate = parseISO(date);

    // transportado a logica de programacao para service
    const createAppointment = new CreateAppointmentService(
      appointmentsRepository,
    );

    // executa
    const appointment = createAppointment.execute({
      date: parsedDate,
      provider,
    });

    // retorna
    return response.json(appointment);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default appointmentsRouter;
