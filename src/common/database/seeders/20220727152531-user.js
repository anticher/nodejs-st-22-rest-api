'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          id: '32770bdb-fedd-4880-8eff-dece84894efb',
          login: 'test-user-1',
          password: 'qwerty123',
          age: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        {
          id: '23d88e6f-db08-4fd9-9bca-0dc3290625f3',
          login: 'test-user-2',
          password: 'qwerty12345',
          age: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        {
          id: 'a3211293-cf7c-49ca-b670-d13bbd054ac3',
          login: 'test-user-3',
          password: 'qwerty123456789',
          age: 129,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        {
          id: 'b709acf3-5455-4458-8fc7-824f9f1be9d8',
          login: 'test-user-4',
          password: 'qwertyqwerty123',
          age: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        {
          id: '0110e38d-0cc2-4841-be33-21c66621a8af',
          login: 'test-user-5',
          password: 'qwertyqwerty12345',
          age: 75,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        {
          id: 'a1e28b96-3acb-41f0-beb2-21ab5181d488',
          login: 'test-user-6',
          password: 'qwertyqwerty123456789',
          age: 99,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: true,
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
