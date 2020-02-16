import { ImageDatabase, Image } from './database';


const imageDatabase = new ImageDatabase()
imageDatabase.connect();

imageDatabase.close();
