const { error } = require('console');
const fs = require('fs');

module.exports = async function(jsonData, path) {

    return new Promise((resolve, reject) => {

        if(!path || !jsonData) {
            reject("no data or path provided");
        }

        try {
        
            const jsonString = JSON.stringify(jsonData);
    
            fs.writeFile(path, jsonString, 'utf8', (err) => {
    
                if(err) {
                    reject(err);
                    return null;
    
                } 
    
                resolve("data written to: " + path);
            });
        } catch (err) {
            reject(err);
        }

    });

}