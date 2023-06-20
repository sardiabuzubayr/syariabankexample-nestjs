import { Sequelize } from 'sequelize-typescript';
import { Users } from '../modules/auth/models/user.model'
import { Roles } from '../modules/auth/models/role.model'

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        define:{
            timestamps:false,
            createdAt:false,
            updatedAt:false
        },
        pool:{
            max:100,
            min:0,
            idle:1000
        }
      });
      sequelize.addModels([Users, Roles]);
      await sequelize.sync();
      return sequelize;
    },
  },
];