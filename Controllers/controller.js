const { json } = require("express");
const client = require("../DBconnect");

class Controller {
  async Create(req, res) {
    ///////////создание поля таблицы и возврат обновленной таблицы
    client.connect(() => {
      client.query(`INSERT INTO datacell (time) VALUES ($1)`, [new Date()])
        .then((e) => {
          client.query("SELECT count(*) FROM datacell")
          .then((c) => {
            client.query(
                "SELECT * FROM datacell LIMIT 10 OFFSET " +
                  Math.floor(c.rows[0].count / 10) * 10
              )
              .then((e) =>
                res.json({
                  list: e.rows,
                  count: c.rows[0].count,
                  page: Math.ceil(c.rows[0].count / 10),
                })
              );
          });
        });
    });
  }

  /////////// возврат обновленной таблицы
  async Read(req, res) {
    const data = req.body;
    let queryBody = "";
    const offset = (data.page - 1) * 10;

    //////---------------надстрйока для фильтрации условия----------------////////
    if (data.typeFilter && data.valueFilter) {
      switch (data.typeFilter) {
        case "":
          queryBody = "";
          break;
        case "equals":
          queryBody =
            " WHERE " + data.cellFilter + ` = '` + data.valueFilter + `'`;
          break;
        case "contains":
          queryBody =
            " WHERE " +
            data.cellFilter +
            `::text LIKE  '%` +
            data.valueFilter +
            `%'`;
          break;
        case "more":
          queryBody =
            " WHERE " + data.cellFilter + ` > '` + data.valueFilter + `'`;
          break;
        case "less":
          queryBody =
            " WHERE " + data.cellFilter + `< '` + data.valueFilter + `'`;
          break;
      }
    }
    ////---------------------------------------------------------------------////

    return client.connect(() => {
      const sortStr = data.sort ? ` ORDER BY ` + data.sort + ` ASC ` : "";
      client
        .query(
          "SELECT * FROM datacell " +
            queryBody +
            "" +
            sortStr +
            " LIMIT 10 OFFSET " +
            offset
        )
        .then((e) => {
          client
            .query("SELECT count(*) FROM datacell " + queryBody)
            .then((c) =>
              res.json({
                list: e.rows,
                count: c.rows[0].count,
                page: data.typeFilter && 1,
                filter: data.sort ? "yes" : "not",
              })
            );
        });
    });
  } //
  
  /////////изменение ячейки/////////////////////
  async Update(req, res) {
    let { id, time, name, count, distance } = req.body;
    if (count === "") {
      count = null;
    }
    return client.connect(() =>
      client
        .query(
          "UPDATE datacell SET time=$1,name=$2,count=$3,distance=$4 WHERE id=$5",
          [time, name, count, distance, id]
        )
        .then(() => res.json("ok"))
    );
  }
/////////удаление строки таблицы ячейки/////////////////////
  async Delete(req, res) {
    const data = req.body;
    return client.connect(() =>
      client
        .query("DELETE FROM datacell WHERE id=$1 ", [data.id])
        .then(res.json("ok"))
    );
  }
}

module.exports = new Controller();
