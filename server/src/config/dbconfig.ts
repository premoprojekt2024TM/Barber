
import { DataSource } from 'typeorm'; 
import { User } from '../models/User'; 
import { ExtendedUser } from '../models/ExtendedUser';
import { Store } from '../models/Store';
import 'reflect-metadata'; 

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',              
  port: 5432,                    
  username: 'root',      
  password: 'root',      
  entities: [User,ExtendedUser,Store],              
  synchronize: true,            
  logging: true                   
});


AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
