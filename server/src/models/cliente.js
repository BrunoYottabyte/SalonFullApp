const mongoose = require('mongoose');
const schema = mongoose.Schema;

const cliente = new schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório']
    }, 
    foto: String,
    email: {
        type: String,
        required: [true, 'E-mail é obrigatório.']
    },
    senha: {
        type: String,
        default: null
    },
    telefone: String,
    endereco: {
        cidade: String,
        uf: String,
        cep: String,
        numero: String,
        pais: String
    },
    dataNascimento: {
        type: String, // YYYY-MM-DD
        required: true,
    },
    sexo: {
        type: String,
        enum: ['M', 'F'],
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['A', 'I'],
        default: 'A'
    },
    documento: {
        tipo: {
            type: String,
            enum: ['individual', 'corporation'],
            required: true,
        },
        numero: {
            type: String,
            required: true,
        },
        
    },
    endereco: {
        cidade: String,
        uf: String,
        cep: String,
        numero: String,
        pais: String
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cliente', cliente)