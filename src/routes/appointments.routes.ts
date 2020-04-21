import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

// Rota : Receber a requisicao, chamar outro arquivo, devolver um resposta

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider_id, date } = request.body;

    // parseISO - Transformando uma string (date) que esta vindo do body,
    //            para uma data.

    const parsedDate = parseISO(date);

    // transportado a logica de programacao para service
    const createAppointment = new CreateAppointmentService();

    // executa
    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider_id,
    });

    // retorna
    return response.json(appointment);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default appointmentsRouter;
