import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import stringify from './stringify.js';

const buildPath = (way) => path.resolve(process.cwd(), way);
const getData = (road) => fs.readFileSync(road, 'utf-8');
const getObj = (data) => JSON.parse(data);
const getKeys = (obj) => Object.keys(obj);

const genDiff = (...treks) => {
  const objs = treks.map((trek) => getObj(getData(buildPath(trek))));
  const keys = _.sortBy(_.union(getKeys(objs[0]), getKeys(objs[1])));
  const diff = {};
  const diffE = keys.map((key) => {
    if (!_.has(objs[0], key)) {
      const newKey = `+ ${key}`;
      diff[newKey] = objs[1][key];
    } else if (!_.has(objs[1], key)) {
      const newKey = `- ${key}`;
      diff[newKey] = objs[0][key];
    } else if (objs[0][key] !== objs[1][key]) {
      const newKey1 = `+ ${key}`;
      const newKey2 = `- ${key}`;
      diff[newKey1] = objs[0][key];
      diff[newKey2] = objs[1][key];
    } else {
      const newKey = `  ${key}`;
      diff[newKey] = objs[1][key];
    }
  });
  return stringify(diff, ' ', 3);
};

export default genDiff;
