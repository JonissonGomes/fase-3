// Script de inicialização do MongoDB
// Cria os bancos de dados necessários para os microserviços

db = db.getSiblingDB('auth_service');
print('Banco de dados auth_service criado');

db = db.getSiblingDB('vehicles_service');
print('Banco de dados vehicles_service criado');

db = db.getSiblingDB('orders_service');
print('Banco de dados orders_service criado');

print('Inicialização do MongoDB concluída com sucesso!'); 