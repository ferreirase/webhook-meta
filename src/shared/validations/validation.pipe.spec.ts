import { JoiValidationPipe } from './validation.pipe';
import { CreateUserSchema } from '@shared/validations/user-validations-schemas';
import { BadRequestException } from '@nestjs/common';

const validSchema = {
  name: 'Tayse Santos',
  email: 'tayse@gmail.com',
  phone: '+5562983449998',
  password: 'Senha123@',
  organization: 'FUNDAHC',
  sector: 'Pesquisa Clínica',
};

const invalidSchema = {
  email: 'tayse@gmail.com',
  phone: '+5562983449998',
  password: 'senha123',
  organization: 'FUNDAHC',
  sector: 'Pesquisa Clínica',
};

describe('Joi Validation Pipe', () => {
  let joiValidate: JoiValidationPipe;

  beforeEach(() => {
    joiValidate = new JoiValidationPipe(CreateUserSchema);
  });

  it('should return a error if schema is invalid', () => {
    try {
      joiValidate.transform(invalidSchema);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.status).toBe(400);
      expect(error.message).toBe('Name is invalid');
    }
  });

  it('should return a error if email is invalid', () => {
    try {
      joiValidate.transform({
        ...validSchema,
        email: 'teste@teste',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.status).toBe(400);
      expect(error.message).toBe('E-mail is invalid');
    }
  });

  it('should return a error if password is invalid', () => {
    try {
      joiValidate.transform({
        ...validSchema,
        password: 'senha123',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.status).toBe(400);
      expect(error.message).toBe('Password is invalid');
    }
  });

  it('should return a error if phone is invalid', () => {
    try {
      joiValidate.transform({
        ...validSchema,
        phone: '',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.status).toBe(400);
      expect(error.message).toBe('Phone is invalid');
    }
  });

  it('should return a error if organization is invalid', () => {
    try {
      joiValidate.transform({
        ...validSchema,
        organization: '',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.status).toBe(400);
      expect(error.message).toBe('Organization is invalid');
    }
  });

  it('should return a error if sector is invalid', () => {
    try {
      joiValidate.transform({
        ...validSchema,
        sector: '',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.status).toBe(400);
      expect(error.message).toBe('Sector is invalid');
    }
  });

  it('should return a valid schema', () => {
    expect(joiValidate.transform(validSchema)).toMatchObject(validSchema);
  });
});
