import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;
  console.log(databaseVersionValue);

  const databaseMaxConnetionResult = await database.query("SHOW max_connections;");
  const databaseMaxConnetionValue = parseInt(databaseMaxConnetionResult.rows[0].max_connections);
  console.log(databaseMaxConnetionValue);

/* solução 1 usando length
  const databaseOpenedConnectionsResult = await database.query("select * from pg_stat_activity where datname = 'local_db';")
  const databaseOpenedConnectionsValue = databaseOpenedConnectionsResult.rows.length;
  console.log(databaseOpenedConnectionsResult.rows.length);*/
/* solução 2 usando count e convertendo na query para inteiro usando ::int
  const databaseOpenedConnectionsResult = await database.query("select count(*)::int from pg_stat_activity where datname = 'local_db';")
  const databaseOpenedConnectionsValue = databaseOpenedConnectionsResult.rows.length;
  console.log(databaseOpenedConnectionsResult.rows[0].count);*/
/* Solução 3 usando variaveis 
  const databaseName = "local_db";
  const databaseOpenedConnectionsResult = await database.query(
    `select count(*)::int from pg_stat_activity where datname = '${databaseName}';`
    );
  const databaseOpenedConnectionsValue = databaseOpenedConnectionsResult.rows[0].count;
  console.log(databaseOpenedConnectionsResult.rows[0].count);*/
  //Query parametrizadas segura de sql injection
  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "select count(*)::int from pg_stat_activity where datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue = databaseOpenedConnectionsResult.rows[0].count;
  console.log(databaseOpenedConnectionsResult.rows[0].count);

  response.status(200).json({
    updated_at: updatedAt,
    dependencies:{
      database:{
        version: databaseVersionValue,
        max_connections: databaseMaxConnetionValue,
        opened_conections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
