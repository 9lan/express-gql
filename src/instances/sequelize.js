import { Sequelize } from 'sequelize'

const sequelizeCumagini = new Sequelize(
	'test_db',
	'root',
	'password',
	{
		host: 'localhost',
		port: 3306,
		dialect: 'mysql',
		timezone: "+07:00",
		logging: false,
		// pool: {
		// 	max: 50,
		// 	min: 0,
		// 	idle: 150000,
		// 	acquire: 200000,
		// },
	}
);

const sequelizeTesting = new Sequelize('mysql://root:password@localhost:3306/test_db');

export { sequelizeCumagini, sequelizeTesting };
