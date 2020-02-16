import Realm = require('realm');

abstract class RealmItem {
    abstract schema: Realm.ObjectSchema;
    abstract name: string;

    write() {
        Realm.open({
            path: 'data/data.realm',
            schema: [this.schema]
        }).then(realm => {
            realm.write(() => {
                realm.create(this.name, this, true);
            });
            realm.close();
        }).catch(error => {
            console.log(error);
        });
    }
}

export class Image extends RealmItem {
    schema: Realm.ObjectSchema = {
        name: 'Image',
        primaryKey: 'path',
        properties: {
            path: 'string',
            fileType: 'string',
            createdOn: 'date',
            tags: 'string[]',
        }
    }
    name: string = "Image";

    path: string;
    fileType: string;
    createdOn: Date;
    tags: string[];

    constructor(path: string) {
        super()
        this.path = path;
        this.fileType = "png";
        this.createdOn = new Date();
        this.tags = []
    }
}
