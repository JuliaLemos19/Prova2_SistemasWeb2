module.exports = { 
  development: { 
    client: 'sqlite3', 
    connection: { 
      filename: './db/projetoapi.sqlite' 
    }, 
    useNullAsDefault: true, 
    migrations: { 
      directory: './db/migrations' 
    } 
  } 
}; 
