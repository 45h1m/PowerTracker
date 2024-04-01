const fs = require('fs');

module.exports = async (path) => {

    return new Promise((resolve, reject) => {

        fs.readdir(path, (error, data) => {

            if(error) {
                reject(error);
            }

            resolve(data);
        });
    });
}