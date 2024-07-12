

const deserializeRow = (row, delimiter = ',') => {
    const values = [];
    let index = 0, matchStart = 0, isInsideQuotations = false;
    while (true) {
      if (index === row.length) {
        values.push(row.slice(matchStart, index));
        break;
      }
      const char = row[index];
      if (char === delimiter && !isInsideQuotations) {
        values.push(
          row
            .slice(matchStart, index)
            .replace(/^"|"$/g, '')
            .replace(/""/g, '"')
            .replace(/\\n/g, '\n')
        );
        matchStart = index + 1;
      }
      if (char === '"')
        if (row[index + 1] === '"') index += 1;
        else isInsideQuotations = !isInsideQuotations;
      index += 1;
    }
    return values;
};


const splitCSVByRows = (data, delimiter = '\n') => {
    const rows = [];
    let index = 0, matchStart = 0, isInsideQuotations = false;
    while (true) {
        if (index === data.length) {
            rows.push(data.slice(matchStart, index));
            break;
        }
        const char = data[index];
        if (char === delimiter && !isInsideQuotations) {
            rows.push(
              data
                .slice(matchStart, index)
                .replace(/\\n/g, '\n')
            );
            matchStart = index + 1;
        }
        if (char === '"')
            if (data[index + 1] === '"') index += 1;
            else isInsideQuotations = !isInsideQuotations;
        index += 1;
    }
    return rows;
    // return data.split(delimiter);
};

const parseCSV = (data, delimiter = ',') => {
    //const rows = data.split('\n');
    const rows = splitCSVByRows(data);
    const headers = deserializeRow(rows.shift(), delimiter);
    return rows.map((row) => {
      const values = deserializeRow(row, delimiter);
      return headers.reduce((obj, key, index) => {
        obj[key] = values[index];
        return obj;
      }, {});
    });
  };

export default parseCSV;