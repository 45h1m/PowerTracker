const fs = require('fs');

module.exports = async function(path) {

    return new Promise((resolve, reject) => {

        fs.readFile(path, 'utf8', (err, data) => {

            if(err) {
                reject(err);
            }

            try {
                
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (err) {
                reject(err);
            }
        });
    });
}