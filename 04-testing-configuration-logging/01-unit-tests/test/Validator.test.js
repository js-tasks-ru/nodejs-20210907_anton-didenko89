const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });


    it('валидатор проверяет "min" лимит в строковых полях', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 8,
        },
      });

      const errors = validator.validate({ name: 'Java' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 5, got 4');
    });

    it('валидатор проверяет "max" лимит в строковых полях', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 8,
        },
      });

      const errors = validator.validate({ name: 'Javascript' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 8, got 10');
    });

    it('валидатор проверяет правильно ли передан тип данных', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 18 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });

    it('валидатор проверяет проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 25,
        },
      });

      const errors = validator.validate({ age: 17 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17');
    });

    it('валидатор проверяет "min" лимит в числовых полях', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 15,
          max: 25,
        },
      });

      const errors = validator.validate({ age: 14 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 15, got 14');
    });

    it('валидатор проверяет "max" лимит в числовых полях', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 15,
          max: 25,
        },
      });

      const errors = validator.validate({ age: 35 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 25, got 35');
    });

    it('валидатор проверяет что корректно заданные параметры чисел и строк не вернут ошибок', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 15,
          max: 25,
        },
        name: {
          type: 'string',
          min: 4,
          max: 25,
        },
      });

      const errors = validator.validate({ age: 15, name: 'Anton' });

      expect(errors).to.have.length(0);
    });
  });
});
