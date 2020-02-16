import Realm = require('realm');

export class Database {

    constructor() {
        Realm.open({
            path: 'data/data.realm',
            schema: [Image.schema]
        }).then(realm => {
            realm.write(() => {
                realm.create('Image', new Image('./filename.png'));
            });
            realm.close();
        }).catch(error => {
            console.log(error);
        });
    }
}

export class Image {
    static schema: Realm.ObjectSchema = {
        name: 'Image',
        properties: {
            path: 'string',
            fileType: 'string',
            createdOn: 'date',
            tags: 'string[]',
        }
    }

    path: string;
    fileType: string;
    createdOn: Date;
    tags: string[];

    constructor(path: string) {
        this.path = path;
        this.fileType = "png";
        this.createdOn = new Date();
        this.tags = []
    }
}
