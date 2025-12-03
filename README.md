# Prova2_SistemasWeb2

1 - Banco de dados capaz de armazenar informações de usuário e a entidade que é o
alvo a aplicação (1,0):
Usuário:
- Id (int)
- Nome (string)
- Senha (string)
- Status (ativo/inativo) (boolean)
Produto:
- Id (int)
- Nome (string)
- Preço (float)
- Status (ativo/inativo) (boolean)
- IdUsuarioCadastro (int)
- IdUsuarioUpdate (int)
2 - A API deve conter todos os métodos CRUD para o Usuário e Produto (4,0).
3 - A gestão de usuários deve ser efetuada através de uma aplicação Desktop (2,5).
4 - Todas as operações na entidade de produto devem ser executadas através de
WebSite, apenas com usuário que possua acesso a aplicação (2,5)
Observações:
Os Produtos devem conter as informações de usuário que o cadastrou
(IdusuarioCadastro) e tabém registro do usuário que o alterou, por exemplo passando do
status ativo para inativo (IdUsuarioUpdate).
