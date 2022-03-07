const api_key = require('../data/keys.json').api_key;
const axios = require('axios')

const api = axios.create({
    baseURL: 'https://api.pagar.me/core/v5/',
    headers: {               
        'Authorization': 'Basic' + Buffer.from(`${api_key}`).toString('base64'),
        'Content-Type': 'application/json'              
    },
})

// module.exports = async (endpoint, data) => {
//     try{
//         const response = await api.post(endpoint, ...data)
//         return {error: false, data: response.data}
//     }catch(err){
//         return {
//             error: true,
//             message: JSON.stringify(err.response.data.errors[0])
//         }
//     }
// }